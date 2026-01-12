import { ApiClient } from "api-client";

const apiClient = new ApiClient({
  TOKEN: () => localStorage.getItem("token") || "",
});

export { apiClient };
