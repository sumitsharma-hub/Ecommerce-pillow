function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  const masked = name[0] + "***" + name[name.length - 1];
  return `${masked}@${domain}`;
}

function maskPhone(phone: string): string {
  return "***" + phone.slice(-4);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone(phone: string): string {
  // Adjust to your format needs
  return phone.replace(/\s+/g, "").trim();
}