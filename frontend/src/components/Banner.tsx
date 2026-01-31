// Banner.tsx
import { Link } from "react-router-dom";

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-rose-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-200 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/3 w-64 h-64 bg-amber-100 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 text-sm font-medium rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              New Collection Available
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Sleep Better.
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-rose-500">
                Live Better.
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience the perfect blend of luxury and comfort with our premium 
              pillows. Crafted for posture support, temperature regulation, and 
              the deepest sleep you've ever had.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/products"
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-semibold rounded-xl shadow-lg shadow-violet-200 hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Shop Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Video
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center gap-8 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-rose-400 border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-900">2,500+</span>
                  <span className="text-gray-500"> Happy Customers</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-600 ml-1">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-violet-200 rounded-2xl rotate-12 opacity-60" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-rose-200 rounded-full opacity-60" />
              
              {/* Main image placeholder - replace with actual image */}
              <div className="relative bg-gradient-to-br from-violet-100 to-rose-100 rounded-3xl aspect-square flex items-center justify-center shadow-2xl shadow-violet-200/50">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-4 bg-white/50 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-violet-600 font-medium">Hero Image</p>
                  <p className="text-sm text-violet-400">Replace with product image</p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -right-4 top-1/4 bg-white rounded-2xl shadow-xl p-4 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">100% Organic</p>
                    <p className="text-xs text-gray-500">Premium Materials</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}