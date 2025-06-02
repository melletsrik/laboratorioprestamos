const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
}

hashPassword("123"); // Cambia "123" por la contraseña que quieras hashear
hashPassword("456");
