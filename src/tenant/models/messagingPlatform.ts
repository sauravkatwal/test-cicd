import * as Sequelize from 'sequelize';
import { MessagingPlatformModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const MessagingPlatform = sequelize.define<MessagingPlatformModelInterface>(
    'messaging_platforms',
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
      },
      level: {
        type: Sequelize.INTEGER,
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
          name: 'messaging_platforms_slug',
          fields: ['slug'],
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );
  return MessagingPlatform;
};


// MessagingPlatform.hasMany(FallbackStrategyMessagingPlatform, {
//   as: 'fallbackStrategyMessagingPlatform',
//   foreignKey: 'messagingPlatformId'
// });

// MessagingPlatform.belongsToMany(FallbackStrategy, {
//   through: { model: FallbackStrategyMessagingPlatform },
//   as: 'fallbackStrategy',
//   foreignKey: 'fallbackStratrgyId',
//   otherKey: 'messagingPlatformId',
// });
