
import { api } from "../data/api_service.mjs";
import { getAuth, logout } from "./auth_controller.mjs";

export async function deleteMyAccount() {
  const { token } = getAuth();
  if (!token) throw new Error("Not logged in.");


  await api.request("/users/me", {
    method: "DELETE",
    token,
  });


  logout();
}

export async function updatePassword({ newPassword }) {
  const { token } = getAuth();
  if (!token) throw new Error("Not logged in.");

  await api.request("/users/me", {
    method: "PATCH",
    token,
    data: { password: newPassword },
  });
}
