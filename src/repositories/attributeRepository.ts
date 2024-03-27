import { InputAttributeInterface, AttributeInterface } from "../interfaces";
import { Attribute } from "../core/models";
import { BaseRepository } from "./baseRepository";

export class AttributeRepository extends BaseRepository<
  InputAttributeInterface,
  AttributeInterface
> {
  constructor() {
    super(Attribute);
  }
}
