import {
  BatchSanitizeEmailRegistryGroupInterface,
  InputBatchSanitizeEmailRegistryGroupInterface,
  ModelsInterface,
} from '../interfaces';
import { BaseRepository } from './baseRepository';

export class BatchSanitizeEmailRegistryGroupRepository extends BaseRepository<
  InputBatchSanitizeEmailRegistryGroupInterface,
  BatchSanitizeEmailRegistryGroupInterface
> {
  constructor(models: ModelsInterface) {
    super(models.BatchSanitizeEmailRegistryGroup);
  }
}
