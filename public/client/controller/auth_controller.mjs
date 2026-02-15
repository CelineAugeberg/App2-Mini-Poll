// public/client/controller/auth_controller.mjs
import { api } from "../data/api_service.mjs";

let authToken = null;
let currentUser = null;

export function getAuth() {
  return { token: authToken, user: currentUser };
}

export function logout() {
  authToken = null;
  currentUser = null;
}

export async function signup({ username, password, consent }) {
  // POST /users
  return api.request("/users", {
    method: "POST",
    data: { username, password, consent: !!consent },
  });
}

export async function login({ username, password }) {
  // POST /auth/login -> { auth: token, user: { id, username } }
  const res = await api.request("/auth/login", {
    method: "POST",
    data: { username, password },
  });

  authToken = res.auth;
  currentUser = res.user;
  return res;
}

