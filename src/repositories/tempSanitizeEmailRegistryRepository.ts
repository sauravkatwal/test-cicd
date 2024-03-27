import {
  TempSanitizeEmailRegistryInterface,
  InputTempSanitizeEmailRegistryInterface,
  ModelsInterface,
} from '../interfaces';
import { BaseRepository } from './baseRepository';

export class TempSanitizeEmailRegistryRepository extends BaseRepository<
  InputTempSanitizeEmailRegistryInterface,
  TempSanitizeEmailRegistryInterface
> {
  constructor(models: ModelsInterface) {
    super(models.TempSanitizeEmailRegistry);
  }
}
