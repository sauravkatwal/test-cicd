import { WhereOptions } from "sequelize";
import { PointOfContact, InputPointOfContactInterface } from "../interfaces";
import {PointOfContactRepository} from '../repositories'

export class PointOfContactService {
  private repository: PointOfContactRepository;

  constructor() {
    this.repository = new PointOfContactRepository();
  }

  async create(input: InputPointOfContactInterface): Promise<PointOfContact> {
    return this.repository.create(input);
  }

  async update({ workspaceId, input }: { workspaceId: number, input: Partial<InputPointOfContactInterface>}){
    const where : WhereOptions<any> = {
      workspaceId: workspaceId
    };
    const pointOfContactExists = await this.repository.findOne({
      where
    })
    if (!pointOfContactExists) throw new Error(`Point of Contacts with worksapce ${workspaceId} does not exist!`);
    const [update] = await this.repository.updateOne({ id: pointOfContactExists.id, input });
    if (update === 0) throw new Error(`Point Of contact id: ${pointOfContactExists.id} does not exist!`);
    return this.repository.findByPk(pointOfContactExists.id);
  }
}