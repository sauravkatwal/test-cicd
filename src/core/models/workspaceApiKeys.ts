import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { WorkspaceApiKeyModelInterface } from '../../interfaces';

const sequelize = Database.sequelize;

const WorkspaceApiKey = sequelize.define<WorkspaceApiKeyModelInterface>(
  'workspace_api_keys',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    apiKey: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'api_key',
    },
    workspaceId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'workspace_id',
    },
    enable: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        name: 'workspace_api_keys_workspace_id_api_key',
        fields: ['workspace_id', 'api_key'],
        where: {
          deleted_at: null,
        },
      },
    ],
  },
);

export default WorkspaceApiKey;