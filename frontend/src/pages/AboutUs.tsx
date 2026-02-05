import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-linear-to-br from-green-50 to-emerald-100 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-800 mb-4">
            Back to Nature
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            Rediscover true wellness through authentic Ayurveda and the healing
            power of nature.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        {/* Philosophy */}
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About Natural Plus Ayurveda
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At <span className="font-semibold">Natural Plus Ayurveda</span>, we
            believe that true wellness begins with nature. In a world moving
            fast toward chemical dependency and medicine-heavy lifestyles, our
            purpose is simple and powerful:
            <span className="font-semibold text-green-700">
              {" "}
              Go Back to Nature.
            </span>
          </p>
          <p className="text-gray-700 leading-relaxed">
            We are committed to promoting a medicine-free life by embracing the
            timeless wisdom of Ayurveda and the healing power of natural
            ingredients. Our approach focuses on restoring balance in the body,
            mind, and soul — naturally, gently, and sustainably.
          </p>
        </div>

        {/* Nature Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Healing Through Nature
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Nature has always provided everything the human body needs to
              heal, strengthen, and thrive. At Natural Plus Ayurveda, we
              carefully select herbs, plants, and natural resources that work
              in harmony with the body — not against it.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Beyond Cure — Prevention
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Our philosophy is not just about curing problems, but about
              preventing them through natural living. Ayurveda teaches us that
              balance is the key to long-term wellness.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-green-50 rounded-2xl border border-green-200 p-8">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              Our Mission
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>• Encourage a chemical-free, medicine-free lifestyle</li>
              <li>• Revive and spread authentic Ayurvedic wisdom</li>
              <li>
                • Help people reconnect with nature for long-term health and
                wellness
              </li>
            </ul>
          </div>

          {/* Vision */}
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-8">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We envision a healthier world where people rely less on synthetic
              medicines and more on natural, Ayurvedic solutions — a world where
              <span className="font-semibold text-emerald-700">
                {" "}
                “Back to Nature”
              </span>{" "}
              is not just a slogan, but a way of life.
            </p>
          </div>
        </div>

        {/* Closing */}
        <div className="text-center bg-white rounded-2xl border border-green-100 shadow-sm p-10">
          <p className="text-lg text-gray-800 font-medium mb-4">
            Natural Plus Ayurveda is more than a brand —
          </p>
          <p className="text-xl font-bold text-green-700 mb-6">
            It’s a movement toward purity, balance, and natural living 🌿
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl transition-all"
          >
            Explore Our Products
          </Link>
        </div>
      </section>
    </div>
  );
}
