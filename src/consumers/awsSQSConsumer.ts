import slug from 'slug';

import { EmailRegistryGroupStatusEnum, EmailRegistryGroupTypesEnum } from '../enums';
import { Helper, Ksuid } from '../helpers';
import { InputCBSEmailRegistryInterface } from '../interfaces';
import { Tenant } from '../middlewares';
import {
  EmailRegistryEmailRegistryGroupService,
  EmailRegistryGroupService,
  EmailRegistryService,
  WorkspaceService
} from '../services';

export const emailRegistriesSQSConsumer = async (
  event: { Records: any[] },
  context: any
) => {
  const { Records: records } = event;
  for (let i = 0; i < records.length; i++) {
    const messageAttributes = records[i].messageAttributes;

    const workspaceId = Number(messageAttributes?.workspaceId.stringValue);
    const email = messageAttributes?.email.stringValue;
    try {
      const workspace = await new WorkspaceService().findByPk(workspaceId);
      const models = await Tenant.connectTenantDB(workspace);
      const input: InputCBSEmailRegistryInterface = JSON.parse(records[i].body);
      let emailRegistry, emailRegistryGroup;

      emailRegistry = await new EmailRegistryService(models).findOne({ workspaceId, email });

      if(emailRegistry) {
        await new EmailRegistryService(models).update({ email: email }, {
          workspaceId: input.workspaceId!,
          name: input.name!,
          phoneNumber: input.phoneNumber && input.phoneNumber?.match(/^\+9779\d{9}$/) ? input.phoneNumber : undefined,
          description: input.description,
          dob: input.dob,
          genderId: input.genderId,
          nationalityId: input.nationalityId,
          provinceId: input.provinceId,
          districtId: input.districtId,
          municipality: input.municipality,
          ward: input.ward,
          profession: input.profession,
        })
      }

      if (messageAttributes?.groupLabel.stringValue !== 'null') {
        emailRegistryGroup = await new EmailRegistryGroupService(models).findOne({
          slug: slug(messageAttributes?.groupLabel.stringValue || ''),
          type: EmailRegistryGroupTypesEnum.email,
        });
        if(emailRegistryGroup && emailRegistry) {
          const emailRegistryEmailRegistryGroupExists = await new EmailRegistryEmailRegistryGroupService(models).findOne({
            emailRegistryId: emailRegistry.id,
            emailRegistryGroupId: emailRegistryGroup.id
          });
          if(!emailRegistryEmailRegistryGroupExists) {
            await new EmailRegistryEmailRegistryGroupService(models).create({
              emailRegistryId: emailRegistry.id,
              emailRegistryGroupId: emailRegistryGroup.id
            });
          }
        }
        if (!emailRegistryGroup) {
          emailRegistryGroup = await new EmailRegistryGroupService(models!).create({
            label: input.groupLabel!,
            description: input.groupLabel,
            workspaceId: input.workspaceId!,
            type: EmailRegistryGroupTypesEnum.email,
            status: EmailRegistryGroupStatusEnum.active,
            emailRegistries: emailRegistry ? [emailRegistry.id] : undefined,
            groupCode: Ksuid.randomSync(),
          });
        }
      }

      if (!emailRegistry) {
        emailRegistry = await new EmailRegistryService(models).createV2({
          workspaceId: input.workspaceId!,
          name: input.name!,
          email: input.email!,
          phoneNumber: input.phoneNumber && input.phoneNumber?.match(/^\+9779\d{9}$/) ? input.phoneNumber : undefined,
          description: input.description,
          dob: input.dob,
          genderId: input.genderId,
          nationalityId: input.nationalityId,
          provinceId: input.provinceId,
          districtId: input.districtId,
          municipality: input.municipality,
          ward: input.ward,
          profession: input.profession,
          emailRegistryGroupId: emailRegistryGroup ? emailRegistryGroup.id : undefined,
        });
      }

      if (input.sanitize === true) {
        emailRegistry.email = input.email!;
        await Helper.sanitizeEmailRegistry({
          data: emailRegistry!,
          email: input.email!,
          models: models,
        });
      }
      console.info('---CONSUMED SUCCESS---');
    } catch (error: any) {
      console.error({ error });
      throw Error(error);
    }
  }
};
