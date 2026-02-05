import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
// import Banner from "../components/Banner";
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
    <main className="min-h-screen bg-[#FAFAF7]" >
      {/* <Banner /> */}

      {/* Featured Products */}
      <section
        aria-labelledby="featured-products"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <header className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-green-800 text-sm font-semibold rounded-full mb-4">
            Natural Plus Collection
          </span>

          <h2
            id="featured-products"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Pure & Authentic Ayurvedic Products
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our range of natural oils, herbal pastes and traditional
            formulations made with time‑tested Ayurvedic wisdom.
          </p>
        </header>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">
              Our natural products are coming soon 🌿
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"id="product-list">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10">
          <FeatureCard
            icon="/img/safe-delivery.png"
            title="Safe & Secure Delivery"
            description="Carefully packed and delivered fresh to your doorstep."
          />
          <FeatureCard
            icon="img/organic.png"
            title="100% Natural Ingredients"
            description="No harmful chemicals. Only pure, natural goodness."
          />
          <FeatureCard
            icon="img/best-seller.png"
            title="Trusted Quality"
            description="Made using traditional methods and quality-tested."
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}

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
    <article className="text-center p-6 rounded-2xl transition-colors">
      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <img src={icon} alt=""className="w-10 h-10"/>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </article>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-green-100 overflow-hidden animate-pulse">
      <div className="aspect-4/3 bg-green-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-green-100 rounded w-3/4" />
        <div className="h-3 bg-green-100 rounded w-1/2" />
        <div className="h-6 bg-green-100 rounded w-1/4 mt-4" />
      </div>
    </div>
  );
}