import { Sequelize } from 'sequelize';
import getEmailRegistryModel from './emailRegistry';
import getEmailRegistryGroupModel from './emailRegistryGroup';
import getEmailRegistryEmailRegistryGroup from './emailRegistryEmailRegistryGroup';
import getTempSanitizeEmailRegistry from './tempSanitizeEmailRegistry';
import getSanitizedNotification from './sanitizedNotification';
import getBatchSanitizeEmailRegistry from './batchSanitizeEmailRegistry';
import getBatchSanitizeEmailRegistryGroup from './batchSanitizeEmailRegistryGroup';
import getEmailTemplate from './emailTemplate';
import getAWSSesClientIdentity from './awsSesClientIdentity';
import getMessagingPlatform from './messagingPlatform';
import getCacheEmailTemplate from './cacheEmailTemplate';
import getTestEmailRegistry from './testEmailRegistry';
import getComment from './comment';
import getCredential from './credential';
import getUserWorkspaceRole from './userWorkspaceRole';
import getCampaign from './campaign';
import getCampaignClickEvent from './campaignClickEvent';
import getCampaignSchedule from './campaignSchedule';
import getEmailRegistryCampaign from './emailRegistryCampaign';
import getScreenRoleMapping from './screenRoleMapping';
import getWorkspaceResource from './workspaceResource';

import { ModelsInterface } from '../../interfaces';
import CoreModel from '../../core/models/index-new';
import { Workspace } from '../../core/models/workspace';
import getRole from './role';
import Module from '../../core/models/module';
import Privilege from '../../core/models/privilege';
import Screen from '../../core/models/screen';
import { User } from '../../core/models/user';
import { UserWorkspace } from '../../core/models/userWorkspace';


const setupAssociations = (sequelize: Sequelize): ModelsInterface => {
  const EmailRegistry = getEmailRegistryModel(sequelize);
  const EmailRegistryGroup = getEmailRegistryGroupModel(sequelize);
  const EmailRegistryEmailRegistryGroup = getEmailRegistryEmailRegistryGroup(sequelize);
  const TempSanitizeEmailRegistry = getTempSanitizeEmailRegistry(sequelize);
  const SanitizedNotification = getSanitizedNotification(sequelize);
  const BatchSanitizeEmailRegistry = getBatchSanitizeEmailRegistry(sequelize);
  const BatchSanitizeEmailRegistryGroup = getBatchSanitizeEmailRegistryGroup(sequelize);
  const EmailTemplate = getEmailTemplate(sequelize);
  const AWSSesClientIdentity = getAWSSesClientIdentity(sequelize);
  const MessagingPlatform = getMessagingPlatform(sequelize);
  const CacheEmailTemplate = getCacheEmailTemplate(sequelize);
  const TestEmailRegistry = getTestEmailRegistry(sequelize);
  const Comment = getComment(sequelize);
  const Credential = getCredential(sequelize);
  const UserWorkspaceRole = getUserWorkspaceRole(sequelize);
  const Campaign = getCampaign(sequelize);
  const CampaignClickEvent = getCampaignClickEvent(sequelize);
  const CampaignSchedule = getCampaignSchedule(sequelize);
  const EmailRegistryCampaign = getEmailRegistryCampaign(sequelize);
  const Role = getRole(sequelize);
  const ScreenRoleMapping = getScreenRoleMapping(sequelize);
  const WorkspaceResource = getWorkspaceResource(sequelize);

  /** Start email_registries Associations */

  EmailRegistry.hasMany(EmailRegistryEmailRegistryGroup, {
    foreignKey: 'emailRegistryId',
    as: 'emailRegistryEmailRegistryGroups',
  });

  EmailRegistry.belongsToMany(EmailRegistryGroup, {
    through: { model: EmailRegistryEmailRegistryGroup },
    as: 'emailRegistryGroups',
    foreignKey: 'emailRegistryId',
    otherKey: 'emailRegistryGroupId',
  });

  EmailRegistry.belongsTo(CoreModel.CountryDivision, {
    foreignKey: 'districtId',
    as: 'district',
  });

  EmailRegistry.belongsTo(CoreModel.CountryDivision, {
    foreignKey: 'provinceId',
    as: 'province',
  });

  EmailRegistry.belongsTo(CoreModel.AttributeValues, {
    foreignKey: 'genderId',
    as: 'gender',
  });

  EmailRegistry.belongsTo(CoreModel.AttributeValues, {
    foreignKey: 'nationalityId',
    as: 'nationality',
  });

  EmailRegistry.belongsTo(Workspace, {
    foreignKey: 'workspaceId',
    as: 'workspace',
  });

  EmailRegistry.hasMany(EmailRegistryCampaign, {
    foreignKey: 'emailRegistryId',
    as: 'emailRegistryCampaigns',
  });

  EmailRegistry.belongsToMany(CoreModel.Transaction, {
    through: {
      model: CoreModel.TransactionEmailRegistry,
    },
    as: 'transaction',
    foreignKey: 'emailRegistryId',
    otherKey: 'transactionId',
  });

  EmailRegistry.hasMany(CoreModel.TransactionEmailRegistry, {
    foreignKey: 'emailRegistryId',
    as: 'transactionEmailRegistries',
  });

  /** End email_registries Associations */


  /** Start email_registry_groups Associations */

  EmailRegistryGroup.hasMany(EmailRegistryEmailRegistryGroup, {
    foreignKey: 'emailRegistryGroupId',
    as: 'emailRegistryGroupEmailRegistries',
  });

  EmailRegistryGroup.belongsToMany(EmailRegistry, {
    through: { model: EmailRegistryEmailRegistryGroup },
    as: 'emailRegistries',
    foreignKey: 'emailRegistryGroupId',
    otherKey: 'emailRegistryId',
  });

  EmailRegistryGroup.belongsToMany(TestEmailRegistry, {
    through: { model: EmailRegistryEmailRegistryGroup },
    as: 'testEmailRegistry',
    foreignKey: 'emailRegistryGroupId',
    otherKey: 'emailRegistryId',
  });

  /** End email_registry_groups Associations */

  /** Start email_registry_email_registry_groups Associations */

  EmailRegistryEmailRegistryGroup.belongsTo(EmailRegistry, {
    foreignKey: 'emailRegistryId',
    as: 'emailRegistry',
  });

  EmailRegistryEmailRegistryGroup.belongsTo(TestEmailRegistry, {
    foreignKey: 'emailRegistryId',
    as: 'testEmailRegistry',
  });

  EmailRegistryEmailRegistryGroup.belongsTo(EmailRegistryGroup, {
    foreignKey: 'emailRegistryGroupId',
    as: 'emailRegistryGroup',
  });

  /** End email_registry_email_registry_groups Associations */

  /** Start temp_sanitize_email_registries Associations */



  /** End temp_sanitize_email_registries Associations */

  /** Start sanitized_notifications Associations */



  /** End sanitized_notifications Associations */

  /** Start batch_sanitize_email_registries Associations */



  /** End batch_sanitize_email_registries Associations */

  /** Start batch_sanitize_email_registry_groups Associations */



  /** End batch_sanitize_email_registry_groups Associations */

  /** Start email_templates Associations */

  EmailTemplate.belongsTo(Workspace, {
    foreignKey: 'workspace_id',
    as: 'workspace',
  });

  EmailTemplate.belongsTo(User, {
    foreignKey: 'created_by_id',
    as: 'created_by',
  });

  EmailTemplate.belongsTo(User, {
    foreignKey: 'updated_by_id',
    as: 'updated_by',
  });

  EmailTemplate.hasMany(CampaignSchedule, {
    foreignKey: 'templateId',
    as: 'campaignSchedule',
  });

  /** End email_templates Associations */

  /** Start aws_ses_client_identities Associations */

  /** End aws_ses_client_identities Associations */

  /** Start messaging_platforms Associations */

  /** End messaging_platforms Associations */

  /** Start cache_email_templates Associations */

  CacheEmailTemplate.hasOne(CampaignSchedule, {
    foreignKey: 'cacheTemplateId',
    as: 'campaign',
  });

  // CacheEmailTemplate.belongsTo(User, {
  //   foreignKey: 'created_by_id',
  //   as: 'created_by',
  // });

  // CacheEmailTemplate.belongsTo(User, {
  //   foreignKey: 'updated_by_id',
  //   as: 'updated_by',
  // });

  /** End cache_email_templates Associations */

  /** Start test_email_registries Associations */

  TestEmailRegistry.belongsTo(Workspace, {
    foreignKey: 'workspaceId',
    as: 'workspace',
  });

  TestEmailRegistry.hasMany(EmailRegistryEmailRegistryGroup, {
    foreignKey: 'emailRegistryId',
    as: 'emailRegistryEmailRegistryGroups',
  });

  TestEmailRegistry.belongsToMany(EmailRegistryGroup, {
    through: { model: EmailRegistryEmailRegistryGroup },
    as: 'emailRegistryGroups',
    foreignKey: 'emailRegistryId',
    otherKey: 'emailRegistryGroupId',
  });

  TestEmailRegistry.hasMany(EmailRegistryCampaign, {
    foreignKey: 'emailRegistryId',
    as: 'emailRegistryCampaigns',
  });

  /** End test_email_registries Associations */

  /** Start comments Associations */

  Comment.belongsTo(Campaign, {
    foreignKey: 'campaignId',
    as: 'campaign',
  });

  Comment.belongsTo(UserWorkspace, {
    foreignKey: 'createdById',
    as: 'userWorkspace',
  });

  /** End comments Associations */

  /** Start credentials Associations */

  Credential.belongsTo(MessagingPlatform, {
    as: 'messagingPlatform',
    foreignKey: 'messagingPlatformId'
  })

  /** End credentials Associations */

  /** Start user_workspace_roles Associations */

  UserWorkspaceRole.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role',
  });

  UserWorkspaceRole.belongsTo(UserWorkspace, {
    foreignKey: 'user_workspace_id',
    as: 'user_workspace',
  });


  /** End user_workspace_roles Associations */

  /** Start roles Associations */

  Role.hasMany(UserWorkspaceRole, {
    foreignKey: 'roleId',
    as: 'userWorkspaceRoles',
  });

  Role.hasMany(ScreenRoleMapping, {
    foreignKey: 'roleId',
    as: 'roleMaps',
  });

  /** End roles Associations */

  /** Start campaign Associations */

  Campaign.belongsTo(Workspace, {
    foreignKey: 'workspace_id',
    as: 'workspace',
  });

  Campaign.hasMany(EmailRegistryCampaign, {
    foreignKey: 'campaign_id',
    as: 'emailRegistryCampaigns',
  });

  Campaign.belongsToMany(EmailRegistry, {
    through: EmailRegistryCampaign,
    as: 'emailRegistryReceipts',
    foreignKey: 'campaign_id',
    otherKey: 'email_registry_id',
  });

  Campaign.belongsToMany(TestEmailRegistry, {
    through: EmailRegistryCampaign,
    as: 'testEmailRegistryReceipts',
    foreignKey: 'campaign_id',
    otherKey: 'email_registry_id',
  });

  Campaign.belongsToMany(EmailRegistryGroup, {
    through: EmailRegistryCampaign,
    as: 'email_registry_group_receipts',
    foreignKey: 'campaign_id',
    otherKey: 'email_registry_group_id',
  });

  // Campaign.hasMany(Comment, {
  //   foreignKey: 'campaignId',
  //   as: 'comments',
  // });

  Campaign.hasOne(CampaignSchedule, {
    foreignKey: 'campaignId',
    as: 'schedule',
  });

  /** End campaign Associations */

  /** Start campaign_click_events Associations */

  CampaignClickEvent.belongsTo(EmailRegistryCampaign, {
    foreignKey: 'email_registry_campaign_id',
    as: 'emailRegistryCampaign',
  });

  /** End campaign_click_events Associations */

  /** Start campaign_schedule Associations */

  CampaignSchedule.belongsTo(EmailTemplate, {
    foreignKey: 'templateId',
    as: 'template',
  });

  CampaignSchedule.belongsTo(CacheEmailTemplate, {
    foreignKey: 'cacheTemplateId',
    as: 'cacheTemplate',
  });

  CampaignSchedule.belongsTo(Campaign, {
    foreignKey: 'campaignId',
    as: 'campaign',
  });

  CampaignSchedule.belongsTo(MessagingPlatform, {
    foreignKey: 'messagingPlatformId',
    as: 'messagingPlatform',
  });

  CampaignSchedule.belongsTo(CampaignSchedule, {
    foreignKey: 'parentId',
    as: 'parentCampaignSchedule',
  });

  CampaignSchedule.hasMany(CampaignSchedule, {
    foreignKey: 'parentId',
    as: 'fallbacks',
  });

  /** End campaign_schedule Associations */

  /** Start email_registry_campaigns Associations */

  EmailRegistryCampaign.belongsTo(Campaign, {
    foreignKey: 'campaign_id',
    as: 'campaign',
  });

  EmailRegistryCampaign.belongsTo(EmailRegistryGroup, {
    as: 'email_registry_group_',
    foreignKey: 'email_registry_group_id',
  });

  EmailRegistryCampaign.belongsTo(EmailRegistry, {
    foreignKey: 'email_registry_id',
    as: 'email_registry',
  });


  EmailRegistryCampaign.belongsTo(TestEmailRegistry, {
    foreignKey: 'email_registry_id',
    as: 'test_email_registry',
  });

  EmailRegistryCampaign.belongsTo(EmailRegistryGroup, {
    foreignKey: 'email_registry_group_id',
    as: 'email_registry_group',
  });

  EmailRegistryCampaign.hasMany(CampaignClickEvent, {
    foreignKey: 'email_registry_campaign_id',
    as: 'campaignClickEvents',
  });

  /** End email_registry_campaigns Associations */

  /** Start screen_role_mappings Associations */

  ScreenRoleMapping.belongsTo(Module, {
    foreignKey: 'moduleId',
    as: 'module',
  });

  ScreenRoleMapping.belongsTo(Privilege, {
    foreignKey: 'privilegeId',
    as: 'privilege',
  });

  ScreenRoleMapping.belongsTo(Screen, {
    foreignKey: 'screenId',
    as: 'screen',
  });

  ScreenRoleMapping.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role',
  });

  /** End screen_role_mappings Associations */

  /** Start modules Associations */

  // Module.hasMany(ScreenRoleMapping, {
  //   foreignKey: 'moduleId',
  //   as: 'screenRoleMappings',
  // });

  /** End modules Associations */

  /** Start privileges Associations */

  // Privilege.hasMany(ScreenRoleMapping, {
  //   foreignKey: 'privilegeId',
  //   as: 'privileges',
  // });

  /** End privileges Associations */

  /** Start screens Associations */

  // Screen.hasMany(ScreenRoleMapping, {
  //   foreignKey: 'screenId',
  //   as: 'screens',
  // });

  /** End screens Associations */

  /** Start transactions Associations */

  // Transaction.belongsTo(CampaignSchedule, {
  //   foreignKey: 'campaignScheduleId',
  //   as: 'campaignSchedule',
  // });

  /** End transactions Associations */

  /** Start transaction_email_registries Associations */

  // TransactionEmailRegistry.belongsTo(EmailRegistry, {
  //   foreignKey: 'emailRegistryId',
  //   as: 'emailRegistry',
  // });

  /** End transaction_email_registries Associations */

  /** Start user_workspaces Associations */

  // UserWorkspace.hasMany(Comment, {
  //   foreignKey: 'createdById',
  //   as: 'comments',
  // });

  // UserWorkspace.hasMany(UserWorkspaceRole, {
  //   foreignKey: 'user_workspace_id',
  //   as: 'user_roles',
  // });


  /** End user_workspaces Associations */

  /** Start workspaces Associations */

  // Workspace.hasMany(Campaign, {
  //   foreignKey: 'workspace_id',
  //   as: 'campaign',
  // });

  // Workspace.hasMany(EmailTemplate, {
  //   foreignKey: 'workspace_id',
  //   as: 'email_templates',
  // });

  // Workspace.hasMany(EmailRegistry, {
  //   foreignKey: 'workspaceId',
  //   as: 'emailRegistries',
  // });

  // Workspace.hasMany(TestEmailRegistry, {
  //   foreignKey: 'workspaceId',
  //   as: 'testEmailRegistry',
  // });

  /** End workspaces Associations */

  /** Start workspace resource Associations */
  WorkspaceResource.belongsTo(Workspace, {
    foreignKey: 'workspaceId',
    as: 'workspace'
  });

  // Workspace.hasMany(WorkspaceResource, {
  //   foreignKey: 'workspaceId',
  //   as: 'workspaceResources',
  // });
  /** End workspace resource Associations */

  return {
    EmailRegistry,
    EmailRegistryGroup,
    EmailRegistryEmailRegistryGroup,
    TempSanitizeEmailRegistry,
    SanitizedNotification,
    BatchSanitizeEmailRegistry,
    BatchSanitizeEmailRegistryGroup,
    EmailTemplate,
    AWSSesClientIdentity,
    MessagingPlatform,
    CacheEmailTemplate,
    TestEmailRegistry,
    Comment,
    Credential,
    UserWorkspaceRole,
    Campaign,
    CampaignClickEvent,
    CampaignSchedule,
    EmailRegistryCampaign,
    Role,
    ScreenRoleMapping,
    WorkspaceResource,
  };
};

export default setupAssociations;
