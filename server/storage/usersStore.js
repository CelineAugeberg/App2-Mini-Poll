

import store from "./inMemoryStore.js";

const COLLECTION = "users";

function clean(username) {
  return String(username || "").trim().toLowerCase();
}

async function findByUsername(username) {
  return store.findOne(COLLECTION, (u) => u.username === clean(username));
}

async function findById(id) {
  return store.findOne(COLLECTION, (u) => u.id === Number(id));
}

async function createUser(username, passwordHash, consent) {
  return store.insert(COLLECTION, {
    username: clean(username),
    passwordHash,
    consent: !!consent,
  });
}

async function deleteUser(id) {
  return store.removeOne(COLLECTION, (u) => u.id === Number(id));
}

async function updatePassword(id, newPasswordHash) {
  return store.updateOne(
    COLLECTION,
    (u) => u.id === Number(id),
    { passwordHash: newPasswordHash }
  );
}

export default { findByUsername, findById, createUser, deleteUser, updatePassword };
