import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Footer from "../components/Footer";

export default function TermsAndConditions() {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">    
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium mb-6 bg-transparent border-none p-0"
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
          Back
        </button>

        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Terms & Conditions
          </h1>
          <p className="text-xs text-gray-400 mb-8">Last Updated: March 2026</p>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            By accessing or using the NaturalPlus Ayurveda website, you agree to
            comply with and be bound by the following terms and conditions.
          </p>

          <Section title="1. Use of Website">
            <p>
              By using this website, you confirm that you are at least 18 years
              of age or accessing the website under the supervision of a parent
              or guardian.
            </p>
          </Section>

          <Section title="2. Product Information">
            <p>
              NaturalPlus Ayurveda offers Ayurvedic and natural wellness
              products. All product descriptions, images, and pricing are
              provided with the intention of being accurate; however, NaturalPlus
              Ayurveda reserves the right to correct errors or update information
              without prior notice.
            </p>
            <p className="mt-3">
              Our products are intended for general wellness purposes only and
              are not intended to diagnose, treat, cure, or prevent any disease.
              Customers should consult a qualified healthcare professional before
              using herbal products.
            </p>
          </Section>

          <Section title="3. Orders & Acceptance">
            <p>
              NaturalPlus Ayurveda reserves the right to refuse or cancel any
              order for reasons including but not limited to product
              availability, errors in product information or pricing, and
              suspicious or fraudulent transactions.
            </p>
          </Section>

          <Section title="4. Intellectual Property">
            <p>
              All content available on this website including logos, product
              images, graphics, text, and design are the property of NaturalPlus
              Ayurveda. Unauthorized use, reproduction, or distribution of
              website content is strictly prohibited.
            </p>
          </Section>

          <Section title="5. Governing Law" last>
            <p>
              These Terms & Conditions shall be governed by and interpreted in
              accordance with the laws of India.
            </p>
          </Section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Section({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-6 pb-6 border-b border-gray-100"}>
      <h2 className="text-base font-bold text-gray-900 mb-2">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
    </div>
  );
}