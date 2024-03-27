import AWSSesClientIdentity from './awsSesClientIdentity';
import BatchSanitizeEmailRegistry from './batchSanitizeEmailRegistry';
import BatchSanitizeEmailRegistryGroup from './batchSanitizeEmailRegistryGroup';
import Campaign from './campaign';
import CampaignClickEvent from './campaignClickEvent';
import CampaignSchedule from './campaignSchedule';
import EmailRegistry from './emailRegistry';
import EmailRegistryEmailRegistryGroup from './emailRegistryEmailRegistryGroup';
import EmailRegistryGroup from './emailRegistryGroup';
import EmailTemplate from './emailTemplate';
import Role from './role';
import SanitizedNotification from './sanitizedNotification';
import ScreenRoleMapping from './screenRoleMapping';
import TempSanitizeEmailRegistry from './tempSanitizeEmailRegistry';
import TestEmailRegistry from './testEmailRegistry';
import Credentials from './credential';
import workspaceResource from './workspaceResource';

const Model = {
  EmailTemplate,
  EmailRegistry,
  EmailRegistryGroup,
  EmailRegistryEmailRegistryGroup,
  AWSSesClientIdentity,
  CampaignClickEvent,
  Campaign,
  CampaignSchedule,
  TestEmailRegistry,
  ScreenRoleMapping,
  Role,
  TempSanitizeEmailRegistry,
  BatchSanitizeEmailRegistry,
  BatchSanitizeEmailRegistryGroup,
  SanitizedNotification,
  Credentials,
  workspaceResource,
};

export default Model;
