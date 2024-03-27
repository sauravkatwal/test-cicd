import { InputPrivilegeInterface, PrivilegeInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class PrivilegeRepository extends BaseRepository<InputPrivilegeInterface, PrivilegeInterface> {
  constructor() {
    super(Model.Privilege);
  }
}
