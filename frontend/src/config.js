const configuredApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = (configuredApiUrl || 'https://noet-2027-website.onrender.com').replace(/\/+$/, '');

let warmupPromise = null;

/**
 * Fires a non-blocking GET /health/ request to the backend.
 * Pre-warms the Render instance in the background so that subsequent
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

