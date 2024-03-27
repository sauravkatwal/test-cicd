import { Address, Company } from "../core/models";
import { AddressInterface, InputAddressInterface } from "../interfaces";
import { AddressRepository, CompanyRepository } from "../repositories";
import { WhereOptions } from "sequelize";

export class AddressService {
  private repository: AddressRepository;
  private companyRepository: CompanyRepository;

  constructor() {
    this.repository = new AddressRepository();
    this.companyRepository = new CompanyRepository();
  }

  async create(input: InputAddressInterface): Promise<AddressInterface> {
    const addressExists = await this.repository.findOne({
      where: { company_id: input.company_id },
    });
    if (addressExists) {
      await this.repository.updateOne({ id: addressExists.id, input });
      return this.repository.findByPk(addressExists.id);
    } else {
      return this.repository.create(input);
    }
  }

  async updateOne(input: InputAddressInterface, workspaceId: number): Promise<AddressInterface> {
    const where : WhereOptions<any> = {
      workspace_id: workspaceId
    };
    const companyExists = await this.companyRepository.findOne({
      where,
      include: [
        {
          model: Address,
          as: 'address'
        }
      ]
    });
    if (!companyExists) throw new Error(`Company with workspace ${workspaceId} does not exist!`);

    const update = await this.repository.updateOne({ id: companyExists.address.id, input });
    if (!update) throw new Error(`Address: ${companyExists.address.id} does not exist!`);
    return this.repository.findByPk(companyExists.address.id);
  }
}
