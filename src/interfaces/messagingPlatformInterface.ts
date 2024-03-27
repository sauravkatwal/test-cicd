import * as Sequelize from 'sequelize';
import { ModelTimestampExtend, CursorPaginationOrderSearchExtend } from '.';

export interface InputMessagingPlatformInterface {
  name: string;
  slug: string;
  level: number;
}

export interface MessagingPlatformInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  slug: string;
  level: number;
}

export interface MessagingPlatformModelInterface
  extends Sequelize.Model<Partial<MessagingPlatformInterface>, Partial<InputMessagingPlatformInterface>>,
    MessagingPlatformInterface {}

export interface ArgsMessagingPlatformInterface extends CursorPaginationOrderSearchExtend {}
