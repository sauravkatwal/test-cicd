import { EmailRegistryInterface, InputEmailRegistryInterface, ModelsInterface } from '../interfaces';
import { BaseRepository } from './baseRepository';
export class EmailRegistryRepository extends BaseRepository<InputEmailRegistryInterface, EmailRegistryInterface> {
  constructor(models: ModelsInterface) {
    super(models.EmailRegistry);
  }
}
