import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { PointOfContactModelInterface } from '../../interfaces';

const sequelize = Database.sequelize;

const PointOfContacts= sequelize.define<PointOfContactModelInterface>(
    'point_of_contacts',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'workspace_id',
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'last_name',
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'phone_number',
      },
      jobTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'job_title',
      },
      jobPosition: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'job_position',
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          name: 'point_of_contacts_workspace_id',
          fields: ['workspace_id'],
          where: {
            deleted_at: null,
          }, 
        },
      ],
    },
  );
  
  export default PointOfContacts;
  