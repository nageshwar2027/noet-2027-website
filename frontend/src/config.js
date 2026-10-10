const configuredApiUrl = (import.meta.env.VITE_API_URL || "").trim();

const LOCAL_API_URL = "http://localhost:8000";
const PRODUCTION_API_URL = "https://noet-2027-website.onrender.com";

const isLocalApiUrl =
/^https?://(localhost|127.0.0.1)(:\d+)?(?:/.*)?$/i.test(
configuredApiUrl
);

const fallbackApiUrl = import.meta.env.DEV
? LOCAL_API_URL
: PRODUCTION_API_URL;

const apiUrl =
configuredApiUrl && !(import.meta.env.PROD && isLocalApiUrl)
? configuredApiUrl
: fallbackApiUrl;

export const API_BASE_URL = apiUrl.replace(//+$/, "");
