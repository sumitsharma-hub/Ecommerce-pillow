// PaymentIcons.tsx
// Simple SVG icons for UPI, PhonePe, GPay, Paytm

export function UPIIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#fff" />
      <text x="16" y="20" textAnchor="middle" fontSize="14" fill="#166534">UPI</text>
    </svg>
  );
}

export function PhonePeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#fff" />
      <text x="16" y="20" textAnchor="middle" fontSize="12" fill="#6A1B9A">PhonePe</text>
    </svg>
  );
}

export function GPayIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#fff" />
      <text x="16" y="20" textAnchor="middle" fontSize="12" fill="#4285F4">GPay</text>
    </svg>
  );
}

export function PaytmIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#fff" />
      <text x="16" y="20" textAnchor="middle" fontSize="12" fill="#0033A0">Paytm</text>
    </svg>
  );
}
