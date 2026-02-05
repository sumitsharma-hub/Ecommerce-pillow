import { Link } from "react-router-dom";
import { useState } from "react";
import {
  LocalPhone,
  Email,
  LocationOn,
  Facebook,
  Instagram,
  Twitter,
  InfoOutlined,
} from "@mui/icons-material";
import GroupsIcon from "@mui/icons-material/Groups";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openHelp, setOpenHelp] = useState(false);

  return (
    <>
      <footer className="bg-linear-to-b from-gray-900 to-gray-950 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">
                  <img src="/img/logo-natural-plus-white.png" alt="" className="w-[6em]"/>
                </span>
                <h3 className="text-xl font-bold text-green-400">
                  Natural Plus
                </h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Authentic Ayurvedic wellness inspired by nature. A step toward
                chemical-free, balanced living.
              </p>

              <div className="flex gap-3 mt-6">
                <SocialIcon icon={<Facebook fontSize="small" />} />
                <SocialIcon icon={<Instagram fontSize="small" />} />
                <SocialIcon icon={<Twitter fontSize="small" />} />
              </div>
            </div>

            {/* Quick Links */}
            <nav>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-green-500 rounded-full" />
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/about-us"
                    className="flex items-center gap-2 hover:text-green-400 transition-colors"
                  >
                    <GroupsIcon fontSize="small" />
                    About Us
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setOpenHelp(true)}
                    className="flex items-center gap-2 hover:text-green-400 transition-colors"
                  >
                    <InfoOutlined fontSize="small" />
                    How to Use Website
                  </button>
                </li>
              </ul>
            </nav>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-green-500 rounded-full" />
                Contact Us
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <Email className="text-green-400" fontSize="small" />
                  <span className="text-gray-400">support@naturalplus.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <LocalPhone className="text-green-400" fontSize="small" />
                  <a
                    href="tel:+917777916256"
                    className="hover:text-green-400 transition-colors"
                  >
                    +91 77779 16256
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <LocationOn className="text-green-400" fontSize="small" />
                  <address className="not-italic text-gray-400">
                    Mehsana, Gujarat – 384002
                  </address>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            © {currentYear}{" "}
            <span className="text-green-400 font-semibold">
              Natural Plus Ayurveda
            </span>
            . All rights reserved.
          </div>
        </div>
      </footer>

      {/* HOW TO USE WEBSITE MODAL */}
      {openHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenHelp(false)}
          />
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              How to Use Natural Plus Website
            </h2>

            <ol className="space-y-3 text-sm text-gray-700 list-decimal list-inside">
              <li>Browse Ayurvedic products from the home page</li>
              <li>Click a product to view details & benefits</li>
              <li>Add products to cart or use “Buy Now”</li>
              <li>Proceed to checkout and place your order</li>
              <li>Track your order from “My Orders”</li>
            </ol>

            <button
              onClick={() => setOpenHelp(false)}
              className="mt-6 w-full bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-xl font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* Reusable social icon */
function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="p-2 bg-gray-800 hover:bg-green-700 rounded-lg transition-colors">
      {icon}
    </button>
  );
}
