const userDatabase = [];
let nextId = 1;

function clean(username) {
  return String(username || "").trim().toLowerCase();
}

async function findUserByUsername(username) {
  const u = clean(username);
  return Promise.resolve(userDatabase.find(x => x.username === u) || null);
}

async function createUser(username, passwordHash, consent) {
  const u = clean(username);

  const user = {
    id: nextId++,
    username: u,
    passwordHash,
    consent: !!consent
  };

  userDatabase.push(user);
  return Promise.resolve(user);
}

async function deleteUserById(id) {
  id = Number(id);
  const i = userDatabase.findIndex(x => x.id === id);
  if (i === -1) return Promise.resolve(false);
  userDatabase.splice(i, 1);
  return Promise.resolve(true);
}

async function updateUserPassword(id, newPasswordHash) {
  id = Number(id);
  const user = userDatabase.find(x => x.id === id);
  if (!user) return Promise.resolve(false);
  user.passwordHash = newPasswordHash;
  return Promise.resolve(true);
}

export default {
  findUserByUsername,
  createUser,
  deleteUserById,
  updateUserPassword
};



