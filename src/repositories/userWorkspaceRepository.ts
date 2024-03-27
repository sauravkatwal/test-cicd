import {
  InputUserWorkspaceInterface,
  UserWorkspaceInterface,
} from "../interfaces";
import { UserWorkspace } from "../core/models";
import { BaseRepository } from "./baseRepository";

export class UserWorkspaceRepository extends BaseRepository<
  InputUserWorkspaceInterface,
  UserWorkspaceInterface
> {
  constructor() {
    super(UserWorkspace);
  }
}
