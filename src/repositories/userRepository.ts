import { InputUserInterface, UserInterface } from "../interfaces";
import { User } from "../core/models";
import { BaseRepository } from "./baseRepository";

export class UserRepository extends BaseRepository<
  InputUserInterface,
  UserInterface
> {
  constructor() {
    super(User);
  }
}
