import { CompanyInterface, InputCompanyInterface } from "../interfaces";
import { Company } from "../core/models";
import { BaseRepository } from "./baseRepository";

export class CompanyRepository extends BaseRepository<
  InputCompanyInterface,
  CompanyInterface
> {
  constructor() {
    super(Company);
  }
}
