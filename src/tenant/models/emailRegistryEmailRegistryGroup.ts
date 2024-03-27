import * as Sequelize from 'sequelize';
import { EmailRegistryEmailRegistryGroupModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const EmailRegistryEmailRegistryGroup = sequelize.define<EmailRegistryEmailRegistryGroupModelInterface>(
    'email_registry_email_registry_groups',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      emailRegistryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'email_registry_id',
        references: {
          model: 'email_registries',
          key: 'id',
        },
      },
      emailRegistryGroupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'email_registry_group_id',
        references: {
          model: 'email_registry_groups',
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          name: 'email_registry_email_registry_groups_email_registry_id_email_registry_group_id',
          fields: ['emailRegistryId', 'emailRegistryGroupId'],
          where: {
            deletedAt: null,
          },
        },
      ],
    },
  );

  return EmailRegistryEmailRegistryGroup;
};
