import * as Sequelize from 'sequelize';

export interface InputServiceInterface {
  name: string;
  slug: string;
}
export interface ServiceInterface {
  id: number;
  name: string;
  slug: string;
}

export interface ServiceModelInterface
  extends Sequelize.Model<ServiceInterface>,
  ServiceInterface {}




