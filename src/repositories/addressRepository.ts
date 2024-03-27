import { AddressInterface, InputAddressInterface } from "../interfaces";
import { Address } from "../core/models";
import { BaseRepository } from "./baseRepository";

export class AddressRepository extends BaseRepository<
  InputAddressInterface,
  AddressInterface
> {
  constructor() {
    super(Address);
  }
}
