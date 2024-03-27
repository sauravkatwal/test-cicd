import { WorkspaceResourcePurposeEnum, WorkspaceResourceTypeEnum } from './../../enums';
import * as Sequelize from 'sequelize';
import { WorkspaceResourceModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const WorkspaceResource = sequelize.define<WorkspaceResourceModelInterface>(
    'workspace_resources',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'workspaces',
          key: 'id',
        },
        field: "workspace_id"
      },
      credentials: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM(
          WorkspaceResourceTypeEnum.sqs,
          WorkspaceResourceTypeEnum.email,
          WorkspaceResourceTypeEnum.viber,
          WorkspaceResourceTypeEnum.sms,
          WorkspaceResourceTypeEnum.whatsapp,
        ),
        allowNull: false
      },
      purpose: {
        type: Sequelize.ENUM(
          WorkspaceResourcePurposeEnum.campaign,
          WorkspaceResourcePurposeEnum.import,
        ),
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_active"
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["workspaceId", "type", "purpose"],
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );
  return WorkspaceResource;
};
