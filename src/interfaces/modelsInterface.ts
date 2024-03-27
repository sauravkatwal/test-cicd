import { ModelCtor } from "sequelize";
import {
  EmailRegistryModelInterface,
  EmailRegistryEmailRegistryGroupModelInterface,
  EmailRegistryGroupModelInterface,
  EmailTemplateModelInterface,
  TempSanitizeEmailRegistryModelInterface,
  SanitizedNotificationModelInterface,
  BatchSanitizeEmailRegistryModelInterface,
  BatchSanitizeEmailRegistryGroupModelInterface,
  AwsSesClientIdentityModelInterface,
  MessagingPlatformModelInterface,
  CacheEmailTemplateModelInterface,
  TestEmailRegistryModelInterface,
  CommentModelInterface,
  CredentialModelInterface,
  UserWorkspaceRoleModelInterface,
  CampaignModelInterface,
  CampaignClickEventModelInterface,
  CampaignScheduleModelInterface,
  EmailRegistryCampaignModelInterface,
  RoleModelInterface,
  ScreenRoleMappingModelInterface,
  WorkspaceResourceModelInterface
} from ".";

export interface ModelsInterface {
  EmailRegistry: ModelCtor<EmailRegistryModelInterface>;
  EmailRegistryGroup: ModelCtor<EmailRegistryGroupModelInterface>;
  EmailRegistryEmailRegistryGroup: ModelCtor<EmailRegistryEmailRegistryGroupModelInterface>;
  TempSanitizeEmailRegistry: ModelCtor<TempSanitizeEmailRegistryModelInterface>;
  SanitizedNotification: ModelCtor<SanitizedNotificationModelInterface>;
  BatchSanitizeEmailRegistry: ModelCtor<BatchSanitizeEmailRegistryModelInterface>;
  BatchSanitizeEmailRegistryGroup: ModelCtor<BatchSanitizeEmailRegistryGroupModelInterface>;
  EmailTemplate: ModelCtor<EmailTemplateModelInterface>;
  AWSSesClientIdentity: ModelCtor<AwsSesClientIdentityModelInterface>;
  MessagingPlatform: ModelCtor<MessagingPlatformModelInterface>;
  CacheEmailTemplate: ModelCtor<CacheEmailTemplateModelInterface>;
  TestEmailRegistry: ModelCtor<TestEmailRegistryModelInterface>;
  Comment: ModelCtor<CommentModelInterface>;
  Credential: ModelCtor<CredentialModelInterface>;
  UserWorkspaceRole: ModelCtor<UserWorkspaceRoleModelInterface>;
  Campaign: ModelCtor<CampaignModelInterface>;
  CampaignClickEvent: ModelCtor<CampaignClickEventModelInterface>;
  CampaignSchedule: ModelCtor<CampaignScheduleModelInterface>;
  EmailRegistryCampaign: ModelCtor<EmailRegistryCampaignModelInterface>;
  Role: ModelCtor<RoleModelInterface>;
  ScreenRoleMapping: ModelCtor<ScreenRoleMappingModelInterface>;
  WorkspaceResource: ModelCtor<WorkspaceResourceModelInterface>;
}
