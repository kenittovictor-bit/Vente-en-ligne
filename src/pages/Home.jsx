import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Star, Zap } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import { PRODUCTS, CATEGORIES } from '../data/mockProducts'

const HERO_STATS = [
  { value: '50K+', label: 'Clients satisfaits' },
  { value: '12K+', label: 'Produits disponibles' },
  { value: '4.8★', label: 'Note moyenne' },
]

const FEATURES = [
  { Icon: Truck, title: 'Livraison offerte', desc: 'Dès 60€ d\'achat en France métropolitaine', color: 'text-[var(--color-primary-500)]', bg: 'bg-[var(--color-primary-50)]' },
  { Icon: RefreshCw, title: 'Retour 30 jours', desc: 'Retours gratuits, sans questions posées', color: 'text-[var(--color-success-600)]', bg: 'bg-[var(--color-success-50)]' },
  { Icon: ShieldCheck, title: 'Paiement sécurisé', desc: 'Stripe & PayPal, données protégées PCI-DSS', color: 'text-[var(--color-warning-600)]', bg: 'bg-[var(--color-warning-50)]' },
  { Icon: Star, title: 'Qualité garantie', desc: 'Produits sélectionnés et testés par notre équipe', color: 'text-[var(--color-accent-500)]', bg: 'bg-[var(--color-accent-50)]' },
]

const featuredProducts = PRODUCTS.slice(0, 8)
const saleProducts = PRODUCTS.filter((p) => p.isSale).slice(0, 4)
const newProducts = PRODUCTS.filter((p) => p.isNew).slice(0, 4)

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary-900)] via-[var(--color-primary-700)] to-[var(--color-primary-500)]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[var(--color-accent-500)] blur-3xl" />
        </div>
        <div className="container-page relative z-10 py-20 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-500 mb-6 backdrop-blur-sm">
              <Zap size={12} fill="currentColor" />
              Nouvelles collections arrivées
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-800 text-white leading-[1.1] mb-6">
              Découvrez des milliers de
              <span className="text-[var(--color-primary-200)]"> produits d'exception</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-xl">
              Livraison rapide, paiement sécurisé et retours gratuits sous 30 jours. Votre satisfaction, notre priorité.
            </p>
            <div className="flex flex-wrap gap-3 mb-12">
              <Link to="/products" className="btn btn-accent btn-lg">
                Découvrir le catalogue
                <ArrowRight size={18} />
              </Link>
              <Link to="/products?isSale=true" className="btn btn-lg bg-white/15 text-white border-white/20 hover:bg-white/25">
                Voir les promotions
              </Link>
            </div>
            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              {HERO_STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-800 text-white">{value}</p>
                  <p className="text-sm text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="container-page py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ Icon, title, desc, color, bg }) => (
              <div key={title} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-[var(--radius-lg)] ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <p className="text-sm font-700 text-[var(--color-text)]">{title}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-600 text-[var(--color-primary-500)] uppercase tracking-widest mb-2">Explorer</p>
            <h2 className="section-title">Nos catégories</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-500 text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]">
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="card p-4 flex flex-col items-center gap-2.5 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200 text-center group"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-600 text-[var(--color-text)] group-hover:text-[var(--color-primary-500)] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sales */}
      {saleProducts.length > 0 && (
        <section className="bg-gradient-to-r from-[var(--color-accent-50)] to-orange-50 py-12">
          <div className="container-page">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge bg-[var(--color-accent-500)] text-white">Ventes flash</span>
                </div>
                <h2 className="section-title">Promotions en cours</h2>
              </div>
              <Link to="/products?isSale=true" className="hidden sm:flex items-center gap-1.5 text-sm font-500 text-[var(--color-accent-500)] hover:text-[var(--color-accent-600)]">
                Tout voir <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container-page py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-600 text-[var(--color-primary-500)] uppercase tracking-widest mb-2">Sélection</p>
            <h2 className="section-title">Produits populaires</h2>
          </div>
          <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-sm font-500 text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]">
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="bg-[var(--color-primary-50)] py-12">
          <div className="container-page">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="badge bg-[var(--color-primary-500)] text-white mb-2">Nouveautés</span>
                <h2 className="section-title mt-1">Dernières arrivées</h2>
              </div>
              <Link to="/products?isNew=true" className="hidden sm:flex items-center gap-1.5 text-sm font-500 text-[var(--color-primary-500)]">
                Tout voir <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="container-page py-14">
        <div className="rounded-2xl bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-400)] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-800 text-white mb-3">
              Inscrivez-vous et bénéficiez de 10% de réduction
            </h2>
            <p className="text-white/70 text-base">
              Créez votre compte gratuitement et utilisez le code <strong className="text-white">WELCOME10</strong>
            </p>
          </div>
          <Link to="/register" className="btn btn-lg bg-white text-[var(--color-primary-600)] hover:bg-white/90 shrink-0 font-700">
            Créer un compte gratuit
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
