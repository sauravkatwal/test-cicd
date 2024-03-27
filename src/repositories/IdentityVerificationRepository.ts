import { IdentityVerificationInterface, InputIdentityVerificationInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class IdentityVerificationRepository extends BaseRepository<
    InputIdentityVerificationInterface,
    IdentityVerificationInterface
> {
  constructor() {
    super(Model.IdentityVerification);
  }
}