var users = [];

async function add(user) {
  users.push(user);
  return users.length - 1;
}

async function get(index) {
  if (index)
    return Object.assign({}, users[index]);

  var usersObj = Object.assign({}, users);
  var entries = Object.entries(usersObj);
  var present = entries.filter(([k,v]) => !!v);
  var result = Object.fromEntries(present);
  return result;
}

async function update(index, user) {
  return users[index] = user;
}

async function del(index) {
  return delete users[index];
}

module.exports = {
  add,
  get,
  update,
  delete: del,
};
