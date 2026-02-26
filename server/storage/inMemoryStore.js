

const collections = new Map();
let nextId = 1;

function getCollection(name) {
  if (!collections.has(name)) collections.set(name, []);
  return collections.get(name);
}

function insert(name, record) {
  const col = getCollection(name);
  const entry = { id: nextId++, ...record };
  col.push(entry);
  return entry;
}

function findOne(name, predicate) {
  return getCollection(name).find(predicate) ?? null;
}

function updateOne(name, predicate, changes) {
  const record = getCollection(name).find(predicate);
  if (!record) return false;
  Object.assign(record, changes);
  return true;
}

function removeOne(name, predicate) {
  const col = getCollection(name);
  const i = col.findIndex(predicate);
  if (i === -1) return false;
  col.splice(i, 1);
  return true;
}

export default { insert, findOne, updateOne, removeOne };
