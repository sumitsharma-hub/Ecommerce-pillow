import PDFDocument from "pdfkit";

export function generateShippingSlip(order: any) {
  const doc = new PDFDocument({ margin: 50 });

  doc.fontSize(18).text("Shipping Slip", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text("FROM:");
  doc.text("Natural Plus Ayurveda, Pvt Ltd");
  doc.text("Mehsana Gujarat, 384002, India");
  doc.moveDown();

  doc.text("TO:");
  doc.text(order.name);
  doc.text(order.phone);
  doc.text(order.address);

  doc.moveDown();
  doc.text(`Order ID: ${order.id}`);
  doc.text(`Payment: ${order.paymentMethod}`);

  if (order.tracking) {
    doc.moveDown();
    doc.text(`Courier: ${order.tracking.courierName}`);
    doc.text(`Tracking No: ${order.tracking.trackingNumber}`);
  }

  return doc;
}
