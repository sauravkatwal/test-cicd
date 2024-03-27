import {
  InputCampaignClickEventInterface,
  CampaignClickEventInterface,
  ModelsInterface,
} from "../interfaces";
import { BaseRepository } from "./baseRepository";

export class CampaignClickEventRepository extends BaseRepository<InputCampaignClickEventInterface,
CampaignClickEventInterface
> {
  constructor(models: ModelsInterface) {
    super(models.CampaignClickEvent);
  }
}
