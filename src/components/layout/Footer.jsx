import { Link } from 'react-router-dom'
import { Store, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  'Boutique': [
    { to: '/products', label: 'Tous les produits' },
    { to: '/products?category=electronics', label: 'Électronique' },
    { to: '/products?category=clothing', label: 'Vêtements' },
    { to: '/products?category=home', label: 'Maison' },
    { to: '/products?isSale=true', label: 'Promotions' },
  ],
  'Mon Compte': [
    { to: '/profile', label: 'Mon profil' },
    { to: '/profile/orders', label: 'Mes commandes' },
    { to: '/profile/wishlist', label: 'Ma wishlist' },
    { to: '/register', label: 'Créer un compte' },
  ],
  'Aide': [
    { to: '/faq', label: 'FAQ' },
    { to: '/shipping', label: 'Livraison & Retours' },
    { to: '/contact', label: 'Nous contacter' },
    { to: '/legal', label: 'CGV / Mentions légales' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[var(--color-text)] text-white mt-20" role="contentinfo">
      <div className="container-page py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-primary-500)] flex items-center justify-center">
                <Store size={18} />
              </div>
              <span className="font-display font-800 text-lg tracking-tight">
                Shop<span className="text-[var(--color-primary-400)]">Zen</span>
              </span>
            </div>
            <p className="text-sm text-white/55 leading-relaxed">
              Votre boutique en ligne de confiance. Des milliers de produits sélectionnés avec soin, livrés rapidement.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/55">
              <span className="flex items-center gap-2"><Mail size={13} /> contact@shopzen.fr</span>
              <span className="flex items-center gap-2"><Phone size={13} /> +33 1 23 45 67 89</span>
              <span className="flex items-center gap-2"><MapPin size={13} /> Paris, France</span>
            </div>
            <div className="flex gap-3 mt-1">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--color-primary-500)] transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-700 uppercase tracking-widest mb-4 text-white/80">{title}</h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/55 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2025 ShopZen. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link to="/legal" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link to="/legal" className="hover:text-white transition-colors">CGV</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
