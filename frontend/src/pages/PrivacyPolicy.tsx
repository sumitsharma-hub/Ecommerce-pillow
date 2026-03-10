import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 mb-8">Last Updated: March 2026</p>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            NaturalPlus Ayurveda ("we", "our", "us") respects your privacy and
            is committed to protecting your personal information. This Privacy
            Policy describes how your personal information is collected, used,
            and shared when you visit or make a purchase from our website.
          </p>

          <Section title="1. Information We Collect">
            <p>
              When you visit our website, we automatically collect certain
              information about your device, including information about your web
              browser, IP address, time zone, and cookies installed on your
              device.
            </p>
            <p className="mt-3">
              Additionally, when you make a purchase or attempt to make a
              purchase, we collect certain information from you including your
              full name, billing address, shipping address, payment information,
              email address, and phone number. This information is referred to as
              Order Information.
            </p>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>
              We use the Order Information that we collect generally to process
              and fulfill orders placed through the website, communicate with you
              regarding your orders, screen orders for potential risk or fraud,
              provide customer support, and improve our website and services.
            </p>
          </Section>

          <Section title="3. Sharing Your Personal Information">
            <p>
              We may share your personal information with trusted third parties
              to help us operate our business such as payment gateway providers,
              shipping and courier partners, and website hosting services. We do
              not sell or rent your personal information to third parties.
            </p>
          </Section>

          <Section title="4. Data Security">
            <p>
              We take reasonable precautions and follow industry best practices
              to ensure your personal information is not lost, misused, accessed,
              disclosed, altered, or destroyed. All payment transactions are
              processed through secure and encrypted payment gateways.
            </p>
          </Section>

          <Section title="5. Changes to This Policy">
            <p>
              NaturalPlus Ayurveda reserves the right to update this Privacy
              Policy at any time. Any changes will be posted on this page.
            </p>
          </Section>

          <Section title="6. Contact Information" last>
            <p>
              For questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-2">
              Email:{" "}
              <a
                href="mailto:support@naturalplusayurveda.com"
                className="text-green-700 hover:text-green-800 font-medium"
              >
                support@naturalplusayurveda.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+917777916256"
                className="text-green-700 hover:text-green-800 font-medium"
              >
                +91 77779 16256
              </a>
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