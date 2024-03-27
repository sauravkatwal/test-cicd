import { TransactionEmailRegistryInterface, InputTransactionEmailRegistryInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class TransactionEmailRegistryRepository extends BaseRepository<InputTransactionEmailRegistryInterface, TransactionEmailRegistryInterface> {
  constructor() {
    super(Model.TransactionEmailRegistry);
  }
}
