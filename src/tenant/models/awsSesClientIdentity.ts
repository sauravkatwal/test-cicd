import * as Sequelize from 'sequelize';
import { AwsSesStatus, IdentityType } from '../../enums';
import { AwsSesClientIdentityModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const AWSSesClientIdentity = sequelize.define<AwsSesClientIdentityModelInterface>(
    'aws_ses_client_identities',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM(IdentityType.Domain, IdentityType.EmailAddress),
        allowNull: false,
        defaultValue: IdentityType.EmailAddress,
      },
      identity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          AwsSesStatus.pending,
          AwsSesStatus.success,
          AwsSesStatus.failed,
          AwsSesStatus.notStarted,
          AwsSesStatus.temporaryFailure,
        ),
        allowNull: false,
        defaultValue: AwsSesStatus.pending,
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
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'aws_ses_client_identities_id_workspace_id',
          fields: ['identity', 'workspace_id'],
          unique: true,
        },
      ],
    },
  );
  return AWSSesClientIdentity;
};

