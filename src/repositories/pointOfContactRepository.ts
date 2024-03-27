import { PointOfContact, InputPointOfContactInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class PointOfContactRepository extends BaseRepository<
    InputPointOfContactInterface,
    PointOfContact
> {
  constructor() {
    super(Model.PointOfContacts);
  }
}