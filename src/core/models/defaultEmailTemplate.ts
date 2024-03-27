import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { MessagingPlatformEnum } from '../../enums';
const sequelize = Database.sequelize;

export class DefaultEmailTemplate extends Sequelize.Model<
  Sequelize.InferAttributes<DefaultEmailTemplate>,
  Sequelize.InferCreationAttributes<DefaultEmailTemplate>
> {
  declare id: Sequelize.CreationOptional<number>;
  declare name: string;
  declare slug: string;
  declare messagingPlatform: string;
  declare content: object;
  declare content_html: object;
  declare description: string;
  declare status: string;
}

DefaultEmailTemplate.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    messagingPlatform: {
      type: Sequelize.ENUM(
        MessagingPlatformEnum.email,
        MessagingPlatformEnum.whatsapp,
        MessagingPlatformEnum.viber,
        MessagingPlatformEnum.sms,
      ),
      field: 'messaging_platform',
      allowNull: false,
    },
    content: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
    content_html: {
      type: Sequelize.JSONB,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
    },
  },

  {
    tableName: 'default_email_templates',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['slug'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);
