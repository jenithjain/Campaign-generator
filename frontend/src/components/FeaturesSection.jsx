export default function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Optimization",
      description: "Advanced machine learning algorithms continuously optimize your campaigns for maximum performance.",
      icon: "🤖"
    },
    {
      title: "Real-Time Analytics",
      description: "Get instant insights into campaign performance with comprehensive real-time dashboards.",
      icon: "📊"
    },
    {
      title: "Automated A/B Testing",
      description: "Intelligent testing that automatically finds the best performing variations of your campaigns.",
      icon: "🧪"
    },
    {
      title: "Smart Targeting",
      description: "AI-driven audience segmentation that identifies and targets your most valuable customers.",
      icon: "🎯"
    },
    {
      title: "Predictive Scaling",
      description: "Forecast campaign performance and scale budgets automatically based on AI predictions.",
      icon: "📈"
    },
    {
      title: "Cross-Platform Integration",
      description: "Seamlessly manage campaigns across all major advertising platforms from one dashboard.",
      icon: "🔗"
    }
  ];

  return (
    <section id="features" className="py-20 bg-[#070A13]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Intelligent Features for 
            <span style={{ color: 'rgb(173, 248, 45)' }}> Smart Campaigns</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Our AI-powered platform provides everything you need to create, manage, 
            and optimize high-performing marketing campaigns.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}