const bcrypt = require("bcrypt");

const inputPassword = "adminSecure123";
const storedHash = "$2b$10$LZ7Xumrj7DA0y7cNjEPG7.vJg9nJ7HyZFLZMb5evqt9DHRzGA4aa6";

bcrypt.compare(inputPassword, storedHash).then((match) => {
  console.log("✅ Match result:", match);
});
