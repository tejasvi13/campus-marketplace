
const ALLOWED_DOMAINS = ["student.edu"];

function getDomain(email) {
  return String(email).toLowerCase().trim().split("@")[1] || "";
}

function isValidEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function isAllowedEmail(email) {
  return ALLOWED_DOMAINS.includes(getDomain(email));
}

function allowedDomainsText() {
  return ALLOWED_DOMAINS.map((domain) => "@" + domain).join(" or ");
}

module.exports = {
  ALLOWED_DOMAINS,
  isValidEmailFormat,
  isAllowedEmail,
  allowedDomainsText,
};