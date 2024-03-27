import {
    DefaultEmailTemplateInterface,
    InputDefaultEmailTemplateInterface,
  } from "../interfaces";
  import { DefaultEmailTemplate } from "../core/models";
  import { BaseRepository } from "./baseRepository";
  
  export class DefaultEmailTemplateRepository extends BaseRepository<InputDefaultEmailTemplateInterface,
    DefaultEmailTemplateInterface
  > {
    constructor() {
      super(DefaultEmailTemplate);
    }
  }
  