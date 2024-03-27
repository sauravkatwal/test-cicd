import { WhereOptions } from 'sequelize'
import { CampaignClickEventInterface, InputCampaignClickEventInterface, ModelsInterface } from "../interfaces";
import { CampaignClickEventRepository, MessagingPlatformRepository } from "../repositories";

export class CampaignClickEventService {
  private models: ModelsInterface;
  private repository: CampaignClickEventRepository;
  private messagingPlatformRepository: MessagingPlatformRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new CampaignClickEventRepository(this.models);
    this.messagingPlatformRepository = new MessagingPlatformRepository(this.models);
  }

  async create(input: InputCampaignClickEventInterface): Promise<CampaignClickEventInterface> {
    const messagingPlatform = await this.messagingPlatformRepository.findOne({ where: { slug: input.messagingPlatform } });
    if (!messagingPlatform) throw new Error(`Messaging Platform slug : ${input.service} does not exist!`);

    input = {
      ...input,
      messagingPlatformId: messagingPlatform.id
    }
    let where: WhereOptions<any> = {};

    if (input.emailRegistryCampaignId) {
      where = { ...where, emailRegistryCampaignId: input.emailRegistryCampaignId }
    }
    if (input.event) {
      where = { ...where, event: input.event }
    }
    if (input.link) {
      where = { ...where, link: input.link }
    }
    if (input.service) {
      where = { ...where, service: input.service }
    }
    const campaignClickEventExists = await this.repository.findOne({
      where: where,
    });

    if (campaignClickEventExists) {
      await this.repository.updateOne({ id: campaignClickEventExists.id, input: { count: campaignClickEventExists.count + 1 } });
      return this.repository.findByPk(campaignClickEventExists.id);
    } else {
      return this.repository.create(input);
    }

  }
}
