// public/client/data/api_service.mjs
class ApiService {
  static #instance;

  static getInstance() {
    if (!ApiService.#instance) ApiService.#instance = new ApiService();
    return ApiService.#instance;
  }

  async request(path, { method = "GET", data = null, token = null } = {}) {
    const headers = {};

    if (data !== null) {
      headers["Content-Type"] = "application/json";
    }

    // Serveren din bruker x-access-auth
    if (token) {
      headers["x-access-auth"] = token;
    }

    const res = await fetch(path, {
      method,
      headers,
      body: data !== null ? JSON.stringify(data) : undefined,
    });

    // Prøv å lese JSON hvis mulig
    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json")
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    if (!res.ok) {
      const err = new Error(
        (payload && (payload.message || payload.error)) ||
          (typeof payload === "string" && payload) ||
          `HTTP ${res.status}`
      );
      err.status = res.status;
      err.payload = payload;
      throw err;
    }

    return payload;
  }
}

export const api = ApiService.getInstance();
