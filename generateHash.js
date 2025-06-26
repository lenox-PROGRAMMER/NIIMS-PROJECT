const bcrypt = require("bcrypt");

bcrypt.hash("adminSecure123", 10).then((hash) => {
  console.log("🔐 Fresh hash:", hash);
});
