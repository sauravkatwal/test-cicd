import * as Sequelize from 'sequelize';
import { TempSanitizeEmailRegistryModelInterface } from '../../interfaces';
import { EmailRegistrySanitizedStatusEnum, EmailRegistrySanitizedReasonEnum } from '../../enums';

export default (sequelize: Sequelize.Sequelize) => {
  const TempSanitizeEmailRegistry = sequelize.define<TempSanitizeEmailRegistryModelInterface>(
    'temp_sanitize_email_registries',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
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
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'workspace_id',
      },
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
    },
  );

  return TempSanitizeEmailRegistry;
};
