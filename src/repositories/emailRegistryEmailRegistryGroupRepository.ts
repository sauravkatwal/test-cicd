import {
  EmailRegistryEmailRegistryGroupInterface,
  InputEmailRegistryEmailRegistryGroupInterface,
  ModelsInterface,
} from '../interfaces';
import { BaseRepository } from './baseRepository';

export class EmailRegistryEmailRegistryGroupRepository extends BaseRepository<
  InputEmailRegistryEmailRegistryGroupInterface,
  EmailRegistryEmailRegistryGroupInterface
> {
  constructor(models: ModelsInterface) {
    super(models.EmailRegistryEmailRegistryGroup);
  }
}
