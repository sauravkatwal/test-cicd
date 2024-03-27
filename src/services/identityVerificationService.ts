import { CreationOptional, Op, WhereOptions } from 'sequelize';
import { IdentityVerificationInterface, InputIdentityVerificationInterface } from '../interfaces';
import { IdentityVerificationRepository } from '../repositories';

export class IdentityVerificationService {
  private repository: IdentityVerificationRepository;

  constructor() {
    this.repository = new IdentityVerificationRepository();
  }

  public async create(input: InputIdentityVerificationInterface): Promise<IdentityVerificationInterface> {
    const identityVerificationExists = await this.repository.findOne({
      where: { identity: input.identity },
    });

    if (identityVerificationExists) {
      return this.updateOne(identityVerificationExists.id, {
        ...input,
      });
    } else {
      return this.repository.create({
        ...input,
      });
    }
  }

  public findOne({
    identity,
    token,
    expiryDate,
    meta
  }: {
    identity?: string;
    token?: string;
    expiryDate?: Date;
    meta?: any;
  }): Promise<IdentityVerificationInterface> {
    let where: WhereOptions = {};

    if (identity) {
      where = { ...where, identity: identity };
    }

    if (token) {
      where = { ...where, token: token };
    }

    if (expiryDate) {
      where = { ...where, expiryDate: {
        [Op.or]: [{ [Op.gt]: new Date() }, null]
      } };
    }

    if(meta) {
      where = { ...where, meta:{[Op.and] : [{workspaceId: meta.workspaceId}, {userWorkspaceId: meta.userWorkspaceId}]}}
    }

    return this.repository.findOne({
      where: where,
    });
  }

  public async updateOne(
    id: CreationOptional<number>,
    input: Partial<InputIdentityVerificationInterface>,
  ): Promise<IdentityVerificationInterface> {
    await this.repository.updateOne({
      id: id,
      input: input,
    });

    return this.repository.findByPk(id);
  }

  public async deleteOne(id: CreationOptional<number>): Promise<boolean> {
    await this.repository.deleteOne(id);
    return true;
  }
}