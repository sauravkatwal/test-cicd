import { EmailRegistryCampaignInterface, InputEmailRegistryCampaignInterface, ModelsInterface } from '../interfaces';
import { BaseRepository } from './baseRepository';

export class EmailRegistryCampaignRepository extends BaseRepository<
  InputEmailRegistryCampaignInterface,
  EmailRegistryCampaignInterface
> {
  constructor(models: ModelsInterface) {
    super(models.EmailRegistryCampaign);
  }
}
