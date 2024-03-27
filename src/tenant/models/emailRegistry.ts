import * as Sequelize from 'sequelize';
import {
  EmailRegistrySanitizedReasonEnum,
  EmailRegistrySanitizedStatusEnum,
  EmailRegistryStatusEnum,
} from '../../enums';
import { EmailRegistryModelInterface } from '../../interfaces';
import { encryption } from '../../config';

export default (sequelize: Sequelize.Sequelize) => {
  const EmailRegistry = sequelize.define<EmailRegistryModelInterface>(
    'email_registries',
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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'email_verified',
      },
      phoneNumber: {
        type: Sequelize.STRING,
        field: 'phone_number',
      },
      phoneNumberVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'phone_number_verified',
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
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
        type: Sequelize.ENUM(
          EmailRegistryStatusEnum.sanitized,
          EmailRegistryStatusEnum.unsanitized,
          EmailRegistryStatusEnum.inprogress,
        ),
        allowNull: false,
        defaultValue: EmailRegistryStatusEnum.unsanitized,
      },
      sanitizedStatus: {
        type: Sequelize.ENUM(
          EmailRegistrySanitizedStatusEnum.deliverable,
          EmailRegistrySanitizedStatusEnum.risky,
          EmailRegistrySanitizedStatusEnum.undeliverable,
          EmailRegistrySanitizedStatusEnum.unknown,
        ),
        defaultValue: null,
        field: 'sanitized_status',
      },
      sanitizedReason: {
        type: Sequelize.ENUM(
          EmailRegistrySanitizedReasonEnum.accepted_email,
          EmailRegistrySanitizedReasonEnum.dns_error,
          EmailRegistrySanitizedReasonEnum.invalid_domain,
          EmailRegistrySanitizedReasonEnum.invalid_email,
          EmailRegistrySanitizedReasonEnum.low_deliverability,
          EmailRegistrySanitizedReasonEnum.low_quality,
          EmailRegistrySanitizedReasonEnum.rejected_email,
          EmailRegistrySanitizedReasonEnum.unavailable_smtp,
          EmailRegistrySanitizedReasonEnum.unknown,
        ),
        defaultValue: null,
        field: 'sanitized_reason',
      },
      sanitizedResponse: {
        type: Sequelize.JSONB,
        field: 'sanitized_response',
      },
      genderId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'gender_id',
        references: {
          model: 'attribute_values',
          key: 'id',
        },
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      nationalityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'nationality_id',
        references: {
          model: 'attribute_values',
          key: 'id',
        },
      },
      provinceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'province_id',
        references: {
          model: 'country_divisions',
          key: 'id',
        },
      },
      districtId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'district_id',
        references: {
          model: 'country_divisions',
          key: 'id',
        },
      },
      municipality: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ward: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      profession: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sanitizedDate: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'sanitized_date',
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          name: 'email_registries_email_workspace_id',
          fields: ['email', 'workspaceId'],
          where: {
            deletedAt: null,
          },
        },
      ],
    },
  );

  EmailRegistry.addHook('beforeCount', async (options: any) => {
    if (options.where && options.where[Sequelize.Op.or]) {
      const conditions = options.where[Sequelize.Op.or];
      conditions.forEach((condition: { email: Sequelize.Utils.Where; name: Sequelize.Utils.Where }) => {
        if ('email' in condition) {
          condition.email = sequelize.where(
            sequelize.fn('pgp_sym_decrypt', sequelize.cast(sequelize.col('email'), 'bytea'), encryption.symmetricKey),
            '=',
            condition.email,
          );
        }
      });
    }
  });

  EmailRegistry.addHook('beforeFind', async (options: any) => {
    if (options.where && 'email' in options.where) {
      if (Array.isArray(options.where.email)) {
        options.where.email = sequelize.where(
          sequelize.fn('pgp_sym_decrypt', sequelize.cast(sequelize.col('email'), 'bytea'), encryption.symmetricKey),
          {
            [Sequelize.Op.in]: options.where.email,
          },
        );
      } else {
        options.where.email = sequelize.where(
          sequelize.fn('pgp_sym_decrypt', sequelize.cast(sequelize.col('email'), 'bytea'), encryption.symmetricKey),
          '=',
          options.where.email,
        );
      }
    }
    if (options.where && options.where[Sequelize.Op.or]) {
      const conditions = options.where[Sequelize.Op.or];
      conditions.forEach((condition: { email: Sequelize.Utils.Where; name: Sequelize.Utils.Where }) => {
        if ('email' in condition) {
          condition.email = sequelize.where(
            sequelize.fn('pgp_sym_decrypt', sequelize.cast(sequelize.col('email'), 'bytea'), encryption.symmetricKey),
            '=',
            condition.email,
          );
        }
      });
    }
    if (options.attributes === undefined) {
      options.attributes = Object.keys(EmailRegistry.getAttributes());
    }

    options.attributes = (options.attributes || []).map((attribute: string) => {
      if (attribute === 'email' || attribute === 'phoneNumber') {
        const decryptedAttribute = attribute === 'phoneNumber' ? 'phone_number' : attribute;

        return [
          sequelize.fn('pgp_sym_decrypt', sequelize.cast(sequelize.col(decryptedAttribute), 'bytea'), encryption.symmetricKey),
          attribute,
        ];
      }
      return attribute;
    });
  });

  return EmailRegistry;
};
