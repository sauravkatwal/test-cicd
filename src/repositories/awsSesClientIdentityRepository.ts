import { AWSSesClientIdentitiyInterface, InputAWSSesClientIdentityInterface, ModelsInterface } from '../interfaces';
import { BaseRepository } from './baseRepository';

export class AWSSesClientIdentityRepository extends BaseRepository<
  InputAWSSesClientIdentityInterface,
  AWSSesClientIdentitiyInterface
> {
  constructor(models: ModelsInterface) {
    super(models.AWSSesClientIdentity);
  }
}