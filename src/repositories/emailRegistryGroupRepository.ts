import { EmailRegistryGroupInterface, InputEmailRegistryGroupInterface, ModelsInterface } from '../interfaces';
import { BaseRepository } from './baseRepository';

export class EmailRegistryGroupRepository extends BaseRepository<
  InputEmailRegistryGroupInterface,
  EmailRegistryGroupInterface
> {
  constructor(models: ModelsInterface) {
    super(models.EmailRegistryGroup);
  }
}
