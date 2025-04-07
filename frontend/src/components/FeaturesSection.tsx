// src/components/FeaturesSection.tsx
export default function FeaturesSection() {
    const features = [
      {
        icon: '📝',
        title: 'Publiez des posts',
        description: 'Partagez vos idées et moments avec la communauté.',
      },
      {
        icon: '💬',
        title: 'Envoyez des messages',
        description: 'Discutez en privé avec vos amis.',
      },
      {
        icon: '👥',
        title: 'Rejoignez des groupes',
        description: 'Participez à des discussions thématiques.',
      },
    ];
  
    return (
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fonctionnalités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }