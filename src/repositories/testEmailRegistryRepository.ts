import { InputTestEmailRegistryInterface, ModelsInterface, TestEmailRegistryInterface } from '../interfaces';
import { BaseRepository } from './baseRepository';

export class TestEmailRegistryRepository extends BaseRepository<InputTestEmailRegistryInterface, TestEmailRegistryInterface> {
  constructor(models: ModelsInterface) {
    super(models.TestEmailRegistry);
  }
}
