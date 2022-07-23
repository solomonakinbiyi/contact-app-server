import bcrypt from "bcrypt";

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hashed) => {
        if (err) {
          reject(err);
        }
        resolve(hashed);
      });
    });
  });
};

export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};
