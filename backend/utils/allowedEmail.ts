export const ALLOWED_DOMAINS: string[] = ["student.edu"];

function getDomain(email: string): string {
  return String(email).toLowerCase().trim().split("@")[1] || "";
}

export function isValidEmailFormat(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export function isAllowedEmail(email: string): boolean {
  return ALLOWED_DOMAINS.includes(getDomain(email));
}

export function allowedDomainsText(): string {
  return ALLOWED_DOMAINS.map((domain: string) => "@" + domain).join(" or ");
}
