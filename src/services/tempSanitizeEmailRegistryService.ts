import { InputTempSanitizeEmailRegistryInterface, ModelsInterface, TempSanitizeEmailRegistryInterface } from '../interfaces';
import { TempSanitizeEmailRegistryRepository } from '../repositories';

export class TempSanitizeEmailRegistryService {
  private models: ModelsInterface;
  private repository: TempSanitizeEmailRegistryRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new TempSanitizeEmailRegistryRepository(models);
  }

  bulkCreate(input: InputTempSanitizeEmailRegistryInterface[]): Promise<TempSanitizeEmailRegistryInterface[]> {
    return this.repository.bulkCreate(input);
  }
}
