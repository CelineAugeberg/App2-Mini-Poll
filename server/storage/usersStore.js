
const userDatabase = [];
let nextId = 1;

function normalizeUsername(username) {
    return String(username || "").trim().toLowerCase();
}

async function findUserByUsername(username) {
    let normalized = normalizeUsername(username);

    let foundUser = userDatabase.find(user => {
        return user.username.toLowerCase() === normalized;
    });
    return Promise.resolve(foundUser || null);
}

async function findUserById(id) {
    let foundUser = userDatabase.find(user => user.id === Number(id));
    return Promise.resolve(foundUser || null);
}

async function createUser(username, passwordHash, consent) {
    let normalized = normalizeUsername(username);

     let existing = userDatabase.find(user => user.username.toLowerCase() === normalized);
    if (existing) {
        return Promise.resolve(null); 
    }

    let newUser = {
        id: nextId++,
        username: normalized,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
        consent: {
            acceptedTos: !!consent.acceptedTos,
            acceptedPrivacy: !!consent.acceptedPrivacy,
            acceptedAt: new Date().toISOString(),
            version: consent.version || "1.0"
        }
    };
        userDatabase.push(newUser);

    return Promise.resolve(newUser);
}

async function listUsers() {
    return Promise.resolve(userDatabase);
}

module.exports = {
    findUserByUsername,
    findUserById,
    createUser,
    listUsers
};