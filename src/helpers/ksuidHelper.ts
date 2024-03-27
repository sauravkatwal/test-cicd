import KSUID from "ksuid";

class Ksuid {
  private static instance: Ksuid;

  private constructor() {}

  static get(): Ksuid {
    if (!Ksuid.instance) {
      Ksuid.instance = new Ksuid();
    }
    return Ksuid.instance;
  }

  randomSync(): string {
    return KSUID.randomSync().string;
  }
}

const ksuid = Ksuid.get();

export { ksuid as Ksuid };