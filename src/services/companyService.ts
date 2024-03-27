import { Address } from '../core/models';
import { Op, WhereOptions } from 'sequelize';
import { CompanyInterface, InputCompanyInterface } from '../interfaces';
import { CompanyRepository } from '../repositories';

export class CompanyService {
  private repository: CompanyRepository;

  constructor() {
    this.repository = new CompanyRepository();
  }

  async create(input: InputCompanyInterface): Promise<CompanyInterface> {
    const registrationNumberExists = await this.repository.findOne({
      where: {
        registration_number: input.registration_number,
        user_id: {
          [Op.ne]: input.user_id,
        },
      },
    });
    if (registrationNumberExists) {
      throw new Error(`Registration number:${input.registration_number} is already taken`);
    }

    const companyExists = await this.repository.findOne({
      where: { user_id: input.user_id },
    });
    if (companyExists) {
      await this.repository.updateOne({ id: companyExists.id, input: input });
      return this.repository.findByPk(companyExists.id);
    } else {
      return this.repository.create(input, {
          include: [{ model: Address, as: 'address' }],
      });

    }
  }

  async findOne({
    name,
    companyRegNo,
  }: {
    name?: string;
    companyRegNo?: string;
  }) : Promise<CompanyInterface> {
    let where : WhereOptions<any> = {};
    if(name) {
      where = {
        ...where, name: name
      };
    }
    if(companyRegNo) {
      where = {
        ...where, registration_number: companyRegNo
      };
    }

    return this.repository.findOne({ where });
  }

  async deleteOne(id: number): Promise<boolean> {
    const companyExists = await this.repository.findByPk(id);
    if (!companyExists) throw new Error(`Company: ${id} does not exist!`);

    const remove = await this.repository.deleteOne(id);
    if (remove === 0) throw new Error(`Company: ${id} does not exist!`);
    return true;
  }
}
