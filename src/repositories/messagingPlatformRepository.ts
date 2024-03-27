import { MessagingPlatformInterface, InputMessagingPlatformInterface, ModelsInterface } from "../interfaces";
import { BaseRepository } from "./baseRepository";

export class MessagingPlatformRepository extends BaseRepository<
InputMessagingPlatformInterface,
MessagingPlatformInterface
> {
  constructor(models: ModelsInterface) {
    super(models.MessagingPlatform);
  }
}
