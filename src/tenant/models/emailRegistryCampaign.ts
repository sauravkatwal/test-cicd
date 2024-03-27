import * as Sequelize from 'sequelize';
import { EmailRegistryCampaignModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const EmailRegistryCampaign = sequelize.define<EmailRegistryCampaignModelInterface>(
    'email_registry_campaigns',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email_registry_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'email_registries',
          key: 'id',
        },
      },
      campaign_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'campaigns',
          key: 'id',
        },
      },
      email_registry_group_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'email_registry_groups',
          key: 'id',
        },
      },
      is_deliverable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      aws_ses_message_id: {
        type: Sequelize.STRING,
      },
      sparrowViberBatchId: {
        type: Sequelize.STRING,
        field: 'sparrow_viber_batch_id'
      },
      sparrowSmsMessageId: {
        type: Sequelize.STRING,
        field: 'sparrow_sms_message_id'
      }
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ['email_registry_id', 'email_registry_group_id', 'campaign_id'],
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );

  const handleChildrenBeforeFindHook = async (options: any, level = 0) : Promise<any> => {
    if (!options) return Promise.resolve();

    if (level >= 1 && options.model) {
      await options.model.runHooks('beforeFind', options);
    }

    if (options.include) {
      return Promise.all(
        options.include.map((includeOptions: any) => {
          return handleChildrenBeforeFindHook(includeOptions, level + 1);
        })
      );
    }

    return Promise.resolve();
  };

  EmailRegistryCampaign.addHook('beforeFind', handleChildrenBeforeFindHook);
  
  return EmailRegistryCampaign;

};
