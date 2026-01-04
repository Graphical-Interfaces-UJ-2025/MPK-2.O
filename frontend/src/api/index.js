import axios from "axios";
import { ApiClient } from "api-client";

const apiClient = new ApiClient({
  HEADERS: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export { apiClient };
