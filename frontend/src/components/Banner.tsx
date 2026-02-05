import { Link } from "react-router-dom";
import { ArrowForward, PlayCircle } from "@mui/icons-material";

export default function Banner() {
  return (
    <section className="relative bg-linear-to-br from-green-50 via-white to-green-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Content */}
        <header className="text-center lg:text-left">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            Pure • Natural • Ayurvedic
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Wellness Rooted in
            <span className="block text-green-700">
              Nature & Tradition
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Experience the benefits of natural oils, herbal pastes and
            traditional formulations crafted for everyday wellness.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="#product-list"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-700 text-white rounded-xl hover:bg-green-800 transition"
            >
              Explore Products
              <ArrowForward />
            </Link>

            <button className="inline-flex items-center gap-2 px-8 py-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">
              <PlayCircle className="text-green-700" />
              Our Process
            </button>
          </div>
        </header>

        {/* Image Placeholder */}
        <div className="hidden lg:block">
          <div className="aspect-square rounded-3xl bg-green-100 flex items-center justify-center">
            <p className="text-green-700 font-medium">
              Product / Lifestyle Image
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}