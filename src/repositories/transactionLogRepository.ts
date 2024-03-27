import { TransactionLogInterface, InputTransactionLogInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class TestTransactionLogRepository extends BaseRepository<InputTransactionLogInterface, TransactionLogInterface> {
  constructor() {
    super(Model.TransactionLog);
  }
}
