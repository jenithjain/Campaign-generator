from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from dotenv import load_dotenv
import os
import json
import shutil
from pathlib import Path
from datetime import datetime
import uuid

from models.schema import BriefRequest, RegenerateRequest, CampaignManifest
from agents.orchestrator import CampaignOrchestrator

# Load environment variables from parent directory or current directory
env_path = Path(__file__).parent.parent / '.env'
if not env_path.exists():
    env_path = Path(__file__).parent / '.env'

print(f"Loading .env from: {env_path}")
print(f".env exists: {env_path.exists()}")

# Try loading with override=True to force reload
load_dotenv(dotenv_path=env_path, override=True)

# Debug: Read file directly to see what's in it
if env_path.exists():
    with open(env_path, 'r', encoding='utf-8') as f:
        content = f.read()
        print(f"\n.env file content (first 200 chars):\n{content[:200]}")
        print(f"\nSearching for GOOGLE_API_KEY in file: {'GOOGLE_API_KEY' in content}")

print(f"\nGOOGLE_API_KEY loaded: {os.getenv('GOOGLE_API_KEY') is not None}")
if os.getenv('GOOGLE_API_KEY'):
    print(f"GOOGLE_API_KEY value (first 10 chars): {os.getenv('GOOGLE_API_KEY')[:10]}")
else:
    print("GOOGLE_API_KEY is None or empty")

app = FastAPI(title="Campaign Generator API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize orchestrator
orchestrator = CampaignOrchestrator()

# Storage setup
STORAGE_DIR = Path("./storage")
ASSETS_DIR = STORAGE_DIR / "assets"
CAMPAIGNS_DIR = STORAGE_DIR / "campaigns"

STORAGE_DIR.mkdir(exist_ok=True)
ASSETS_DIR.mkdir(exist_ok=True)
CAMPAIGNS_DIR.mkdir(exist_ok=True)

# Mount assets directory
app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")

@app.get("/")
def read_root():
    return {"message": "Campaign Generator API", "status": "running"}

@app.post("/api/generate-campaign")
async def generate_campaign(request: BriefRequest):
    """Generate campaign from brief"""
    try:
        # Generate manifest
        result = orchestrator.generate_campaign_manifest(request.brief)
        
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=result.get("error"))
        
        manifest = result["manifest"]
        
        # Execute asset generation
        manifest = orchestrator.execute_asset_generation(manifest)
        
        # Save campaign
        campaign_id = manifest["campaign_id"]
        campaign_file = CAMPAIGNS_DIR / f"{campaign_id}.json"
        
        with open(campaign_file, "w") as f:
            json.dump(manifest, f, indent=2)
        
        return {"success": True, "campaign": manifest}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/campaign/{campaign_id}")
async def get_campaign(campaign_id: str):
    """Get campaign by ID"""
    campaign_file = CAMPAIGNS_DIR / f"{campaign_id}.json"
    
    if not campaign_file.exists():
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    with open(campaign_file, "r") as f:
        campaign = json.load(f)
    
    return {"success": True, "campaign": campaign}

@app.post("/api/regenerate-asset")
async def regenerate_asset(request: RegenerateRequest):
    """Regenerate a specific asset"""
    try:
        # Find campaign containing this asset
        for campaign_file in CAMPAIGNS_DIR.glob("*.json"):
            with open(campaign_file, "r") as f:
                manifest = json.load(f)
            
            # Check if asset exists in this campaign
            asset_ids = [a["id"] for a in manifest.get("asset_plan", [])]
            if request.asset_id in asset_ids:
                # Regenerate
                result = orchestrator.regenerate_asset(
                    manifest, 
                    request.asset_id, 
                    request.modify_instructions
                )
                
                if not result.get("success"):
                    raise HTTPException(status_code=500, detail=result.get("error"))
                
                # Save updated manifest
                with open(campaign_file, "w") as f:
                    json.dump(result["manifest"], f, indent=2)
                
                return {"success": True, "campaign": result["manifest"]}
        
        raise HTTPException(status_code=404, detail="Asset not found")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/campaigns")
async def list_campaigns():
    """List all campaigns"""
    campaigns = []
    for campaign_file in CAMPAIGNS_DIR.glob("*.json"):
        with open(campaign_file, "r") as f:
            campaign = json.load(f)
            campaigns.append({
                "campaign_id": campaign["campaign_id"],
                "brief": campaign["brief"],
                "created_at": campaign["created_at"],
                "status": campaign["status"]
            })
    
    return {"success": True, "campaigns": campaigns}

@app.post("/api/export-campaign/{campaign_id}")
async def export_campaign(campaign_id: str):
    """Export campaign as ZIP"""
    import zipfile
    from io import BytesIO
    
    campaign_file = CAMPAIGNS_DIR / f"{campaign_id}.json"
    
    if not campaign_file.exists():
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    with open(campaign_file, "r") as f:
        campaign = json.load(f)
    
    # Create ZIP in memory
    zip_buffer = BytesIO()
    
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        # Add manifest
        zip_file.writestr("campaign_manifest.json", json.dumps(campaign, indent=2))
        
        # Add assets
        for asset in campaign.get("asset_plan", []):
            if asset.get("url"):
                asset_path = Path(asset["url"])
                if asset_path.exists():
                    zip_file.write(asset_path, f"assets/{asset_path.name}")
            
            if asset.get("content"):
                filename = f"assets/{asset['id']}.txt"
                zip_file.writestr(filename, asset["content"])
    
    zip_buffer.seek(0)
    
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename=campaign_{campaign_id}.zip"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
