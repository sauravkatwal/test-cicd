import * as Sequelize from 'sequelize';
import { EmailRegistryGroupStatusEnum, EmailRegistryGroupTypesEnum } from '../../enums';
import { EmailRegistryGroupModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const EmailRegistryGroup = sequelize.define<EmailRegistryGroupModelInterface>(
    'email_registry_groups',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'workspace_id',
        references: {
          model: 'workspaces',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.ENUM(EmailRegistryGroupStatusEnum.active, EmailRegistryGroupStatusEnum.inactive),
        allowNull: false,
        defaultValue: EmailRegistryGroupStatusEnum.inactive,
      },
      type: {
        type: Sequelize.ENUM(EmailRegistryGroupTypesEnum.email, EmailRegistryGroupTypesEnum.message),
        allowNull: false,
        defaultValue: EmailRegistryGroupTypesEnum.email,
      },
      filterCriteria: {
        type: Sequelize.JSONB,
        allowNull: true,
        field: 'filter_criteria',
      },
      isExistingCriteria: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        field: 'is_existing_criteria',
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      groupCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          name: 'email_registry_groups_slug_workspace_id_type',
          fields: ['slug', 'workspaceId', 'type'],
          where: {
            deletedAt: null,
          },
        },
      ],
    },
  );
  
  return EmailRegistryGroup;
};
