import { TransactionInterface, InputTransactionInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class TransactionRepository extends BaseRepository<
  InputTransactionInterface,
  TransactionInterface
> {
  constructor() {
    super(Model.Transaction);
  }
}