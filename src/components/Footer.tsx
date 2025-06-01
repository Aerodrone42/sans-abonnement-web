
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-blue text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SI</span>
              </div>
              <span className="font-bold text-xl">Site Internet Sans Abonnement</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Spécialiste de la création de sites internet sans abonnement pour artisans, 
              commerçants et indépendants. Votre site professionnel, sans engagement.
            </p>
            <div className="flex space-x-4">
              <span className="bg-accent px-3 py-1 rounded-full text-sm">Sans abonnement</span>
              <span className="bg-primary px-3 py-1 rounded-full text-sm">Livré en 14 jours</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Nos services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Site vitrine professionnel</li>
              <li>Optimisation SEO</li>
              <li>Adaptation mobile</li>
              <li>Hébergement sécurisé</li>
              <li>Formation incluse</li>
              <li>Support technique</li>
            </ul>
          </div>

          {/* Secteurs */}
          <div>
            <h3 className="font-bold text-lg mb-4">Secteurs d'activité</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Artisans du bâtiment</li>
              <li>Commerces de proximité</li>
              <li>Restaurants & bars</li>
              <li>Professions libérales</li>
              <li>Auto-entrepreneurs</li>
              <li>Services à la personne</li>
            </ul>
          </div>
        </div>

        {/* Liens légaux */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                CGV
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                Plan du site
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              © {currentYear} Site Internet Sans Abonnement. Tous droits réservés.
            </p>
          </div>
        </div>

        {/* Zone SEO */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">
              <strong>Création site internet sans abonnement</strong> | Site vitrine professionnel | 
              Site internet pas cher | Site web sur mesure
            </p>
            <p>
              Création de site internet pour artisans, commerçants, indépendants partout en France. 
              Paiement en une fois, hébergement inclus, sans engagement.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
