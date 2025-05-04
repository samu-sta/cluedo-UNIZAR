// Mock para el módulo argon2
module.exports = {
  hash: jest.fn(async (password) => {
    return `hashed_${password}`;
  }),
  
  verify: jest.fn(async (hash, plain) => {
    if (plain === 'wrong_password') {
      return false;
    }
    return true;
  })
};