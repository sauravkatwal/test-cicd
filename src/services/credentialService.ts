import {
  CredentialInterface,
  InputCredentialInterface,
  ModelsInterface
} from "../interfaces";
import { CredentialRepository } from "../repositories";
import { MessagingPlatformEnum } from "../enums";
import { WhereOptions } from "sequelize";

export class CredentialService {
  private models: ModelsInterface;
  private repository: CredentialRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new CredentialRepository(this.models);
  }

  async create(input: InputCredentialInterface): Promise<CredentialInterface> {
    return this.repository.create(input);
  }

  async findByPk(id: number) {
    return this.repository.findByPk(id);
  }

  async findOne(input: Partial<InputCredentialInterface>, messagingPlatform: MessagingPlatformEnum) {
    let messagingPlatformWhere: WhereOptions<any> = {};
    if(messagingPlatform) {
      messagingPlatformWhere = { ...messagingPlatformWhere, slug: messagingPlatform };
    }
    const credentials = await this.repository.findOne({
      where: input,
      include: [
        {
          model: this.models.MessagingPlatform,
          as: 'messagingPlatform',
          attributes: ['id', 'name', 'slug'],
          ...(Object.keys(messagingPlatformWhere).length > 0 && { where: messagingPlatformWhere }),

        },
      ]
    });
    if (!credentials) throw new Error("Credential does not exist");

    return credentials;
  }
}
