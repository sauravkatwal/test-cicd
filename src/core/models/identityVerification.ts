import * as Sequelize from 'sequelize';
import { Database } from '../../config';
import { IdentityVerificationModelInterface } from '../../interfaces'; 

const sequelize = Database.sequelize;

const IdentityVerification = sequelize.define<IdentityVerificationModelInterface>(
  'identity_verifications',
  {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      identity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'expiry_date',
      },
      meta: {
        type: Sequelize.JSONB, 
      },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
  }
);

export default IdentityVerification;
