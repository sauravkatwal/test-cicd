import { InputCampaignInterface, CampaignInterface, ModelsInterface } from '../interfaces';
import { BaseRepository } from './baseRepository';

export class CampaignRepository extends BaseRepository<InputCampaignInterface, CampaignInterface> {
  constructor(models: ModelsInterface) {
    super(models.Campaign);
  }
}
