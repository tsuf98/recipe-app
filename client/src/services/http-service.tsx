import Cookies from "js-cookie";
import { toast } from "react-toastify";
export const API_URL = import.meta.env.VITE_API_URL + "/api";

export class HttpService {
  constructor(private readonly baseUrl: string) {}

  async fetch(url: string, method: string, params: RequestInit = {}) {
    try {
      const token = Cookies.get("token");
      if (token) {
        params.headers = new Headers({
          ...(params.headers ?? {}),
          Authorization: `Bearer ${token}`,
        });
      }
      const res = await fetch(API_URL + this.baseUrl + url, {
        ...params,
        method,
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
      return undefined;
    }
  }

  get(url: string, params?: RequestInit) {
    return this.fetch(url, "GET", params);
  }

  patch(url: string, params?: RequestInit) {
    return this.fetch(url, "PATCH", params);
  }

  post(url: string, params?: RequestInit) {
    return this.fetch(url, "POST", params);
  }

  delete(url: string, params?: RequestInit) {
    return this.fetch(url, "DELETE", params);
  }
}

export const recipeService = new HttpService("/recipes");

export const tagService = new HttpService("/tags");

export const userService = new HttpService("/users");
