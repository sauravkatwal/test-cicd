import { InputScreenInterface, ScreenInterface } from '../interfaces';
import Model from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class ScreenRepository extends BaseRepository<InputScreenInterface, ScreenInterface> {
  constructor() {
    super(Model.Screen);
  }
}
