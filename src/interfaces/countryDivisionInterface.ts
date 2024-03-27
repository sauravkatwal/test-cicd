import * as Sequelize from 'sequelize';
import { ModelTimestampExtend, PaginationOrderSearchExtend } from '.';
import {CountryDivisionTypeEnum} from '../enums' 

export interface InputCountryDivisionInterface {
  name: string;
  slug?: string;
  country?: number;
  state_id?: number;
  district?: string;
  is_default?: boolean;
  type: string;
}

export interface CountryDivisionInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  slug: string;
  country: number;
  state_id: number;
  district: string;
  is_default: boolean;
  type: string;
}



export interface CountryDivisionModelInterface
  extends Sequelize.Model<CountryDivisionInterface, Partial<InputCountryDivisionInterface>>,
  CountryDivisionInterface {}


  export interface ArgsCountryDivisionInterface extends  PaginationOrderSearchExtend  {
    type?: CountryDivisionTypeEnum;
    state?: string;
    country?: string;
  }