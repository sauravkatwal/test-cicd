import { InputSanitizedNotificationInterface, ModelsInterface, SanitizedNotificationInterface } from '../interfaces';
import { BaseRepository } from './baseRepository';

export class SanitizedNotificationRepository extends BaseRepository<
  InputSanitizedNotificationInterface,
  SanitizedNotificationInterface
> {
  constructor(models: ModelsInterface) {
    super(models.SanitizedNotification);
  }
}
