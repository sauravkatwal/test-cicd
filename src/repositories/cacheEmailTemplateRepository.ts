import {
    EmailTemplateInterface,
    InputEmailTemplateInterface,
    ModelsInterface
  } from "../interfaces";
  import { BaseRepository } from "./baseRepository";
  
  export class CacheEmailTemplateRepository extends BaseRepository<InputEmailTemplateInterface,
  EmailTemplateInterface
  > {
    constructor(models: ModelsInterface) {
      super(models.CacheEmailTemplate);
    }
  }
  