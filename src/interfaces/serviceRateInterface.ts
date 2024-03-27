import * as Sequelize from 'sequelize';
import { ModelTimestampExtend, CursorPaginationOrderSearchExtend, UserWorkspaceInterface, ServiceInterface } from '.';
import { ServiceEnum } from 'enums';

export interface InputServiceRateInterface {
  serviceId?: Sequelize.CreationOptional<number>;
  creditUnit?: number;
  amount: number;
  service?: ServiceEnum;
  workspaceId: number;
}

export interface ServiceRateInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  serviceId: Sequelize.CreationOptional<number>;
  creditUnit: number;
  amount: number;
  service?: ServiceInterface;
  workspaceId: Sequelize.CreationOptional<number>;
}

export interface ServiceRateModelInterface
  extends Sequelize.Model<Partial<ServiceRateInterface>, Partial<InputServiceRateInterface>>,
    ServiceRateInterface {}

export interface ArgsServiceRateInterface extends CursorPaginationOrderSearchExtend {
  workspaceId?: number;
  service?: number;
}
