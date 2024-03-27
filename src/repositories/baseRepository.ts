import * as Sequelize from 'sequelize';
import { WhereOptions } from 'sequelize';
import { Attributes, GroupOption, IncludeOptions, Order } from 'sequelize/types/model';
import { Database } from '../config';

interface RepositoryWriter<IT, RT> {
  create(input: Partial<IT>, include?: IncludeOptions, transaction?: Sequelize.TransactionOptions): Promise<RT>;
  bulkCreate(input: Partial<IT[]>, transaction?: Sequelize.TransactionOptions): Promise<RT[]>;
  updateOne({ id, input, include }: { id: number; input: Partial<IT>; include: IncludeOptions[] }): Promise<[number]>;
  update({ where, input }: { where: object; input: Partial<IT> }): Promise<[number]>;
  deleteOne(id: number): Promise<number>;
  deleteMany({ where }: { where: object }): Promise<number>;
  restore(id: number): Promise<number>;
  query({ functionName, where, params }: { functionName: string; where: object; params: string }): Promise<any>;
}

interface RepositoryReader<RT> {
  findAll({
    where,
    attributes,
    include,
    order,
    group,
    limit,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    group?: GroupOption;
    limit?: number;
  }): Promise<RT[]>;
  findOne({
    where,
    attributes,
    include,
    order,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
  }): Promise<RT>;
  findByPk(
    id: number,
    options?: {
      attributes?: Attributes<any>;
      include?: IncludeOptions[];
    },
  ): Promise<RT>;
  findAndCountAll({
    where,
    attributes,
    include,
    order,
    offset,
    limit,
    distinct,
    group,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    offset?: number;
    limit?: number;
    distinct?: boolean;
    group?: GroupOption;
  }): Promise<{ count: number; rows: RT[] }>;
  count({ where }: { where?: WhereOptions<any> }): Promise<number>;
}

export abstract class BaseRepository<IT, RT> implements RepositoryWriter<IT, RT>, RepositoryReader<RT> {
  constructor(public readonly model: any) {}

  findAll({
    where,
    attributes,
    include,
    order,
    group,
    limit,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    group?: GroupOption;
    limit?: number;
  }): Promise<RT[]> {
    return this.model.findAll({ where, attributes, include, order, group, limit });
  }

  findOne({
    where,
    attributes,
    include,
    order,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
  }): Promise<RT> {
    return this.model.findOne({ where, attributes, include, order });
  }

  findByPk(
    id: number,
    options?: {
      attributes?: Attributes<any>;
      include?: IncludeOptions[];
    },
  ): Promise<RT> {
    return this.model.findByPk(id, options);
  }

  findAndCountAll({
    where,
    attributes,
    include,
    order,
    offset,
    limit,
    distinct,
    group,
  }: {
    where?: WhereOptions<any>;
    attributes?: Attributes<any>;
    include?: IncludeOptions[];
    order?: Order;
    offset?: number;
    limit?: number;
    distinct?: boolean;
    group?: GroupOption;
  }): Promise<{ count: number; rows: RT[] }> {
    return this.model.findAndCountAll({
      where,
      attributes,
      include,
      order,
      offset,
      limit,
      distinct,
      group,
    });
  }

  count({
    where,
    include,
    distinct,
  }: {
    where?: WhereOptions<any>;
    include?: IncludeOptions[];
    distinct?: boolean;
  }): Promise<number> {
    return this.model.count({ where, include, distinct });
  }

  create(input: Partial<IT>, include?: IncludeOptions, transaction?: Sequelize.TransactionOptions): Promise<RT> {
    return this.model.create(input, include, transaction);
  }

  bulkCreate(input: Partial<IT[]>, transaction?: Sequelize.TransactionOptions ): Promise<RT[]> {
    return this.model.bulkCreate(input, {
      ignoreDuplicates: true,
    },       
    transaction,
    );
  }

  updateOne({ id, input }: { id: number; input: Partial<IT> }): Promise<[number]> {
    return this.model.update(input, { where: { id } });
  }

  update({ where, input }: { where: WhereOptions<any>; input: Partial<IT> }): Promise<[number]> {
    return this.model.update(input, { where });
  }

  deleteOne(id: number): Promise<number> {
    return this.model.destroy({
      where: { id },
    });
  }

  deleteMany({ where }: { where: object }): Promise<number> {
    return this.model.destroy({
      where,
    });
  }

  restore(id: number): Promise<number> {
    return this.model.restore({
      where: { id },
    });
  }

  query({ functionName, where, params }: { functionName: string; where: object; params: string }): Promise<any> {
    return Database.sequelize.query(`SELECT * FROM ${functionName}(${params})`, {
      replacements: { ...where },
      type: Sequelize.QueryTypes.SELECT,
    });
  }

  tenantDbQuery({ functionName, where, params }: { functionName: string; where: object; params: string }): Promise<any> {
    return this.model.sequelize.query(`SELECT * FROM ${functionName}(${params})`, {
      replacements: { ...where },
      type: Sequelize.QueryTypes.SELECT,
    });
  }
}
