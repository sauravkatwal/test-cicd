import { EmailTemplateInterface, InputEmailTemplateInterface, ModelsInterface } from '../interfaces';
import { CacheEmailTemplateRepository } from '../repositories';

export class CacheEmailTemplateService {
  private models: ModelsInterface;
  private repository: CacheEmailTemplateRepository;

  constructor(models: ModelsInterface) {
    this.models = models;
    this.repository = new CacheEmailTemplateRepository(this.models);
  }

  async updateOne(id: number, input: InputEmailTemplateInterface): Promise<EmailTemplateInterface> {
    const cacheEmailTemplateExists = await this.repository.findByPk(id);
    if (!cacheEmailTemplateExists) throw new Error(`Cache Email Template: ${id} does not exist!`);
    const [update] = await this.repository.updateOne({ id, input });
    if (update === 0) throw new Error(`Cache Email Template: ${id} does not exist!`);
    return this.repository.findByPk(id);
  }
}
