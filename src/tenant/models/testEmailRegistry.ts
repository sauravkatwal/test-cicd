import * as Sequelize from 'sequelize';
import { EmailRegistrySanitizedReasonEnum, EmailRegistrySanitizedStatusEnum, EmailRegistryStatusEnum } from '../../enums';
import { TestEmailRegistryModelInterface } from '../../interfaces';

export default (sequelize: Sequelize.Sequelize) => {
  const TestEmailRegistry = sequelize.define<TestEmailRegistryModelInterface>(
    'test_email_registries',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
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
        allowNull: true,
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
        type: Sequelize.ENUM(EmailRegistryStatusEnum.sanitized, EmailRegistryStatusEnum.unsanitized),
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
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          name: 'test_email_registries_email_workspace_id',
          fields: ['email', 'workspaceId'],
          where: {
            deletedAt: null,
          },
        },
      ],
    },
  );
  return TestEmailRegistry;
};
