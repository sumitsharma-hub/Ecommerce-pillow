import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import ProductCard from "../components/ProductCard";
import { useGetProductsQuery } from "../features/product/productApi";
import Footer from "../components/Footer";

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: products = [], isLoading } = useGetProductsQuery();

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      {/* ── Hero Section ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-700">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] bg-emerald-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-green-100 text-xs sm:text-sm font-semibold rounded-full mb-6 border border-white/10">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                100% Natural &amp; Ayurvedic
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Pure Wellness,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-lime-300">
                  Rooted in Nature
                </span>
              </h1>

              <p className="mt-5 sm:mt-6 text-green-100/80 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover authentic Ayurvedic oils, herbal pastes &amp;
                traditional formulations — crafted with time‑tested wisdom for
                your everyday health.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                <a
                  href="#product-list"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-green-800 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-50 transition-all text-sm sm:text-base"
                >
                  Shop Now
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
                <a
                  href="#why-us"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all text-sm sm:text-base"
                >
                  Why Natural Plus?
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-green-300 to-emerald-500 border-2 border-green-800 flex items-center justify-center text-[10px] font-bold text-white"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-0.5 text-yellow-400 text-sm">
                    {"★★★★★"}
                  </div>
                  <p className="text-green-200 text-xs mt-0.5">
                    Trusted by 2,000+ happy customers
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Hero Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-72 h-74 sm:w-80 sm:h-80 lg:w-[26rem] lg:h-[26rem]">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-400/30 to-lime-300/20 blur-2xl scale-110" />
                <div className="relative w-full h-full rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                  <img
                    src="/img/banner-hero.png"
                    alt="Natural Plus Ayurvedic Products"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🌿</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      100% Organic
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Lab tested &amp; certified
                    </p>
                  </div>
                </div>

                {/* Floating badge 2 */}
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      Premium Quality
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Traditional recipes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
              fill="#FAFAF7"
            />
          </svg>
        </div>
      </section>

      {/* ── Marquee / Announcement Bar ─────────────────────────────── */}
      <section className="bg-[#FAFAF7] pt-2 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Free Shipping Pan India
            </span>
            {/* <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              COD Available
            </span> */}
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              100% Natural Ingredients
            </span>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Secure Payments
            </span>
          </div>
        </div>
      </section>

      {/* ── Featured Products ──────────────────────────────────────── */}
      <section
        id="product-list"
        aria-labelledby="featured-products"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <header className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-800 text-xs sm:text-sm font-semibold rounded-full mb-4">
            Our Collection
          </span>

          <h2
            id="featured-products"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3"
          >
            Pure & Authentic Ayurvedic Products
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Discover our range of natural oils, herbal pastes and traditional
            formulations made with time‑tested Ayurvedic wisdom.
          </p>
        </header>

        {/* Products Grid — 2 cols on mobile, 4 on desktop */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">🌿</span>
            </div>
            <p className="text-gray-600 font-medium">
              Our natural products are coming soon!
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Stay tuned for something amazing.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Why Choose Us ──────────────────────────────────────────── */}
      <section
        id="why-us"
        className="bg-white border-t border-gray-100 py-16 sm:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Why Choose Natural Plus?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
              We're committed to bringing you the purest products nature has to
              offer.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon="/img/safe-delivery.png"
              title="Safe & Secure Delivery"
              description="Carefully packed and delivered fresh to your doorstep with real-time tracking."
            />
            <FeatureCard
              icon="/img/organic.png"
              title="100% Natural Ingredients"
              description="No harmful chemicals or preservatives. Only pure, natural goodness sourced responsibly."
            />
            <FeatureCard
              icon="/img/best-seller.png"
              title="Trusted Quality"
              description="Made using traditional methods, quality-tested and loved by thousands of customers."
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-green-800 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Start Your Natural Wellness Journey
            </h2>
            <p className="text-green-200 mt-2 text-sm sm:text-base">
              Free shipping on all orders. Cash on delivery available.
            </p>
          </div>
          <a
            href="#product-list"
            className="shrink-0 bg-white text-green-800 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-green-50 transition-all text-sm sm:text-base"
          >
            Browse Products
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ── Feature Card ───────────────────────────────────────────────── */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <article className="text-center p-6 sm:p-8 rounded-2xl bg-gray-50 hover:bg-green-50/50 transition-colors duration-300 group">
      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-5 group-hover:shadow-md transition-shadow">
        <img src={icon} alt="" className="w-10 h-10" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </article>
  );
}

/* ── Skeleton Card ──────────────────────────────────────────────── */
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-green-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-green-50" />
      <div className="p-3 sm:p-4 space-y-2.5">
        <div className="h-3.5 bg-green-100 rounded-full w-3/4" />
        <div className="h-3 bg-green-50 rounded-full w-1/2" />
        <div className="h-5 bg-green-100 rounded-full w-1/3 mt-3" />
        <div className="h-9 bg-green-50 rounded-xl w-full mt-3" />
      </div>
    </div>
  );
}