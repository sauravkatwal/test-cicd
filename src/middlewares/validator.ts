import joi, { ArraySchema, ObjectSchema, StringSchema } from "joi";

class Validator {
  private static instance: Validator;

  private constructor() {}

  static get(): Validator {
    if (!Validator.instance) {
      Validator.instance = new Validator();
    }
    return Validator.instance;
  }

  check = (schema: ObjectSchema | ArraySchema | StringSchema, input: any) => {
    const { value, error } = schema.validate(input, {
      abortEarly: false,
    });
    if (error) throw error;
  };
   // Adding a method to validate an email
   validateEmail = (email: string) => {
    const emailSchema = joi.string().email().required();
    this.check(emailSchema, {email});
  };

}

const validator = Validator.get();

export { validator as Validator };
