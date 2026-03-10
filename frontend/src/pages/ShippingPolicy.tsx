import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Footer from "../components/Footer";

export default function ShippingPolicy() {
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
            Shipping Policy
          </h1>
          <p className="text-xs text-gray-400 mb-8">Last Updated: March 2026</p>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            NaturalPlus Ayurveda provides shipping services across India.
          </p>

          <Section title="Order Processing">
            <p>
              All orders are processed within 1–3 business days after successful
              payment confirmation. Orders placed on weekends or public holidays
              will be processed on the next working day.
            </p>
          </Section>

          <Section title="Delivery Time">
            <p>Estimated delivery times are as follows:</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <DeliveryCard label="Metro Cities" time="3–5 business days" />
              <DeliveryCard label="Other Cities" time="4–7 business days" />
              <DeliveryCard label="Remote Locations" time="Up to 10 business days" />
            </div>
            <p className="mt-3 text-xs text-gray-400">
              Delivery timelines may vary due to courier service operations,
              weather conditions, or unforeseen circumstances.
            </p>
          </Section>

          <Section title="Shipping Charges">
            <p>
              Shipping charges, if applicable, will be displayed at checkout
              before completing the purchase.
            </p>
          </Section>

          <Section title="Order Tracking" last>
            <p>
              Once the order is shipped, customers will receive a tracking number
              via SMS or email. Customers can use this tracking number to monitor
              delivery status. If you face any issues tracking your order, please
              contact our customer support team.
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

function DeliveryCard({ label, time }: { label: string; time: string }) {
  return (
    <div className="bg-green-50 rounded-xl p-3 text-center">
      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-bold text-gray-900 mt-1">{time}</p>
    </div>
  );
}