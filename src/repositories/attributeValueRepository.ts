import { InputAttributeValueInterface, AttributeValueInterface } from '../interfaces';
import  Model  from '../core/models/index-new';
import { BaseRepository } from './baseRepository';

export class AttributeValueRepository extends BaseRepository<
  InputAttributeValueInterface,
  AttributeValueInterface
> {
	constructor() {
		super(Model.AttributeValues);
	}
}
