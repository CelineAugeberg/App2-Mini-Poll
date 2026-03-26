import { api } from "../data/api_service.mjs";
import { getAuth } from "./auth_controller.mjs";

export async function createPoll({ question, options }) {
  const { token } = getAuth();
  return api.request("/polls", { method: "POST", data: { question, options }, token });
}

export async function getMyPolls() {
  const { token } = getAuth();
  return api.request("/polls", { token });
}

export async function getPoll(id) {
  return api.request(`/polls/${id}`);
}

export async function votePoll(id, optionIndex) {
  return api.request(`/polls/${id}/vote`, { method: "POST", data: { optionIndex } });
}

export async function updatePoll(id, { question, options }) {
  const { token } = getAuth();
  return api.request(`/polls/${id}`, { method: "PUT", data: { question, options }, token });
}

export async function deletePoll(id) {
  const { token } = getAuth();
  return api.request(`/polls/${id}`, { method: "DELETE", token });
}
