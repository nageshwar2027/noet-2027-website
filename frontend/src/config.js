const configuredApiUrl = (import.meta.env.VITE_API_URL || "").trim();

const LOCAL_API_URL = "http://localhost:8000";
const PRODUCTION_API_URL = "https://noet-2027-website.onrender.com";

const isLocalApiUrl = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/.*)?$/i.test(
  configuredApiUrl
);

const fallbackApiUrl = import.meta.env.DEV ? LOCAL_API_URL : PRODUCTION_API_URL;

const apiUrl =
  configuredApiUrl && !(import.meta.env.PROD && isLocalApiUrl)
    ? configuredApiUrl
    : fallbackApiUrl;

export const API_BASE_URL = apiUrl.replace(/\/+$/, "");

let warmupPromise = null;

/**
 * Fires a non-blocking GET /health/ request to the backend.
 * Pre-warms the backend instance in the background so that subsequent
 * form submissions execute without a cold-start delay.
 */
export const warmupBackend = () => {
  if (warmupPromise) {
    return warmupPromise;
  }
  try {
    warmupPromise = fetch(`${API_BASE_URL}/health/`, {
      method: 'GET',
      mode: 'cors',
    })
      .then((res) => {
        if (!res.ok) {
          warmupPromise = null;
        }
        return res;
      })
      .catch(() => {
        // Allow a retry on next interaction if ping failed
        warmupPromise = null;
      });
  } catch (_) {
    warmupPromise = null;
  }
  return warmupPromise;
};

