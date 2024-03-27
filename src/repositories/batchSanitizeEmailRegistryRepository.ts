import {
  BatchSanitizeEmailRegistryInterface,
  InputBatchSanitizeEmailRegistryInterface,
  ModelsInterface,
} from '../interfaces';
import { BaseRepository } from './baseRepository';

export class BatchSanitizeEmailRegistryRepository extends BaseRepository<
  InputBatchSanitizeEmailRegistryInterface,
  BatchSanitizeEmailRegistryInterface
> {
  constructor(models: ModelsInterface) {
    super(models.BatchSanitizeEmailRegistry);
  }
}
