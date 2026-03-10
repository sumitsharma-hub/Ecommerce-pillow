import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Footer from "../components/Footer";

export default function ReturnRefundPolicy() {
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
            Returns & Refund Policy
          </h1>
          <p className="text-xs text-gray-400 mb-8">Last Updated: March 2026</p>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Due to the nature of Ayurvedic and consumable products, NaturalPlus
            Ayurveda maintains a strict return and refund policy to ensure
            product safety and hygiene.
          </p>

          <Section title="Eligible Return Conditions">
            <p>
              Returns are accepted only under the following conditions: the
              product is damaged during delivery, or the product seal is already
              opened at the time of delivery.
            </p>
          </Section>

          <Section title="Return Request Process">
            <p>
              Customers must notify us within 24 hours of receiving the product.
              To initiate a return request, customers must provide their Order
              ID, clear photos or videos of the damaged product, and photos of
              the product packaging.
            </p>
            <p className="mt-3 text-orange-600 font-medium text-xs bg-orange-50 inline-block px-3 py-1 rounded-full">
              Return requests submitted after 24 hours may not be accepted.
            </p>
          </Section>

          <Section title="Non-Returnable Conditions">
            <p>
              Returns will not be accepted in the following situations: the
              product has been opened or used by the customer, the return
              request is made after 24 hours of delivery, or the product is
              returned without its original packaging.
            </p>
          </Section>

          <Section title="Refund Process">
            <p>
              Once the return request is verified and approved, a replacement
              product will be shipped or a refund will be issued to the original
              payment method. Refund processing may take 5–7 business days
              depending on the payment provider.
            </p>
          </Section>

          <Section title="Track Your Order" last>
            <p>
              Once your order is shipped, you will receive a tracking number via
              SMS or email. You can track your shipment using the courier
              tracking link provided in the shipping confirmation message. If
              you face any issues tracking your order, please contact our
              customer support team.
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
