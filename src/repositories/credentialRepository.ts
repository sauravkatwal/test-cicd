import { CredentialInterface, InputCredentialInterface, ModelsInterface } from '../interfaces';
import { BaseRepository } from './baseRepository';

export class CredentialRepository extends BaseRepository<
  InputCredentialInterface,
  CredentialInterface
> {
  constructor(models: ModelsInterface) {
    super(models.Credential);
  }
}