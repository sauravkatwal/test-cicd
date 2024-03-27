import crypto from "crypto";

class Password {
  private static instance: Password;
  constructor() {}

  static get(): Password {
    if (!Password.instance) {
      Password.instance = new Password();
    }
    return Password.instance;
  }

  generate(password: string): { salt: string; hash: string } {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    return {
      salt: salt,
      hash: hash,
    };
  }

  validate({
    password,
    hash,
    salt,
  }: {
    password: string;
    hash: string;
    salt: string;
  }): boolean {
    const hashVerify = crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
    return hash === hashVerify;
  }
}

const password = Password.get();

export { password as Password };
