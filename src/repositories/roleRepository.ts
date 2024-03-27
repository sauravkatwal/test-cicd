import { InputRoleInterface, ModelsInterface, RoleInterface } from "../interfaces";
import { BaseRepository } from "./baseRepository";

export class RoleRepository extends BaseRepository<
  InputRoleInterface,
  RoleInterface
> {
  constructor(models: ModelsInterface) {
    super(models.Role);
  }
}
