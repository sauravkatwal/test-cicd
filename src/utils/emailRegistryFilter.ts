import { InputFilterCriteria, InputEmailRegistryInterface, EmailRegistryInterface, ModelsInterface } from '../interfaces';
import { EmailRegistryService } from '../services'
import { AttributeValueService,CountryDivisionService  } from '../services';
class EmailRegistryFilter {
  private static instance: EmailRegistryFilter;
  constructor() { }

  static get(): EmailRegistryFilter {
    if (!EmailRegistryFilter.instance) {
      EmailRegistryFilter.instance = new EmailRegistryFilter();
    }
    return EmailRegistryFilter.instance;
  }

  async filterData(filterCriteria: InputFilterCriteria, workspaceId: number, models: ModelsInterface, data?: InputEmailRegistryInterface[], ids?: number[]) {
    const { age, gender, nationality, province, district } = filterCriteria;

    let emailRegistryList: EmailRegistryInterface[] = [];

    if (data) {
      const emails: string[] = data.map(item => item.email);
      emailRegistryList = await new EmailRegistryService(models).findAll({ workspaceId, emails });
    } else {
      emailRegistryList = await new EmailRegistryService(models).findAll({ workspaceId, ids });
    }

    const genderDetails = gender ? await new AttributeValueService().findOne(gender) : null;
    const nationalityDetails = nationality ? await new AttributeValueService().findOne(nationality) : null;
    const provinceDetails = province ? await new CountryDivisionService().findOne(province) : null;
    const districtDetails = district ? await new CountryDivisionService().findOne(district) : null;

    if (gender && genderDetails) {
      const filteredUserIds: number[] = emailRegistryList
        .filter(item => item.genderId === genderDetails.id)
        .map(item => item.id);
      return filteredUserIds;
    }

    if (nationality && nationalityDetails) {
      const filteredUserIds: number[] = emailRegistryList
        .filter(item => item.nationalityId === nationalityDetails.id)
        .map(item => item.id);
      return filteredUserIds;
    }
  
    if (province && provinceDetails) {
      const filteredUserIds: number[] = emailRegistryList
        .filter(item => item.provinceId === provinceDetails.id)
        .map(item => item.id);
      return filteredUserIds;
    }
  
    if (district && districtDetails) {
      const filteredUserIds: number[] = emailRegistryList
        .filter(item => item.districtId === districtDetails.id)
        .map(item => item.id);
      return filteredUserIds;
    }
     
    if (age && age.from && age.to) {
      const filteredUserIds: number[] = emailRegistryList
        .filter(item => {
          const userAge = calculateAge(new Date(item.dob!));
          return userAge >= age.from && userAge <= age.to;
        })
        .map(item => item.id);
      return filteredUserIds;
    }
    
  function calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
}

const emailRegistryFilter = EmailRegistryFilter.get();
export { emailRegistryFilter as EmailRegistryFilter };