
import { InputCampaignScheduleInterface, CampaignScheduleInterface, ModelsInterface } from '../interfaces';
import { BaseRepository } from './baseRepository';

export class CampaignScheduleRepository extends BaseRepository<InputCampaignScheduleInterface, CampaignScheduleInterface> {
  constructor(models: ModelsInterface) {
    super(models.CampaignSchedule);
  }
}
