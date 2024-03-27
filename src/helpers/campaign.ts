import {
  EmailRegistryStatusEnum,
  EmailRegistrySanitizedStatusEnum,
  FallbackTypeEnum,
  EventEnum,
  MessagingPlatformEnum,
} from '../enums';
import {
  EmailTemplateInterface,
  InputCampaignInterface,
  CampaignInterface,
  InputEmailRegistryCampaignInterface,
  InputCampaignScheduleInterface,
  ModelsInterface,
} from '../interfaces';
import {
  CampaignService,
  EmailRegistryCampaignService,
  CampaignScheduleService,
  EmailRegistryGroupService,
} from '../services';

class Campaign {
  private static instance: Campaign;

  private constructor() {}

  static get(): Campaign {
    if (!Campaign.instance) {
      Campaign.instance = new Campaign();
    }
    return Campaign.instance;
  }

  async updateCampaign(id: number, input: InputCampaignInterface, models: ModelsInterface): Promise<CampaignInterface> {
    const data = await new CampaignService(models).update(id, input);
    if (input.schedule) {
      this.updateCampaignScheduleAssociation({
        campaignId: data.id,
        schedule: input.schedule,
        workspaceId: data.workspaceId,
        models: models
      });
    }
    if (input.emailRegistries || input.emailRegistryGroups) {
      this.updateCampaignAssociation({
        campaign_id: id,
        email_registries: input.emailRegistries,
        email_registry_groups: input.emailRegistryGroups,
        models: models
      });
    }
    return data;
  }

  async updateCampaignScheduleAssociation({
    campaignId,
    schedule,
    workspaceId,
    models,
  }: {
    campaignId: number;
    schedule: InputCampaignScheduleInterface;
    workspaceId: number;
    models: ModelsInterface;
  }) {
    await new CampaignScheduleService(models).deleteMany({ campaignId });
    schedule.campaignId = campaignId;
    schedule.workspaceId = workspaceId;
    await new CampaignScheduleService(models).create(schedule);
  }

  async updateCampaignAssociation({
    campaign_id,
    email_registries,
    email_registry_groups,
    models
  }: {
    campaign_id: number;
    email_registries: number[];
    email_registry_groups: number[];
    models: ModelsInterface;
  }) {
    await new EmailRegistryCampaignService(models).deleteMany({ campaign_id });
    const email_registries_input: InputEmailRegistryCampaignInterface[] = [];
    if (email_registries?.length > 0) {
      email_registries.map((item) => {
        email_registries_input.push({ email_registry_id: item, campaign_id: campaign_id });
      });
    }
    if (email_registry_groups?.length > 0) {
      const promise = email_registry_groups.map(async (item) => {
        const email_registry_group = await new EmailRegistryGroupService(models).findByPk(item);
        email_registry_group.emailRegistries?.map((email_registry) => {
          email_registries_input.push({
            email_registry_id: email_registry.id,
            campaign_id: campaign_id,
            email_registry_group_id: item,
          });
        });
      });
      await Promise.all(promise);
    }

    await new EmailRegistryCampaignService(models).bulkCreate(email_registries_input);
  }
}

const campaign = Campaign.get();

export { campaign as Campaign };
