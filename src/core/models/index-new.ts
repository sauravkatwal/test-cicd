import AttributeValues from './attributeValue';
import CountryDivision from './countryDivision';
import IdentityVerification from './identityVerification';
import Module from './module';
import PointOfContacts from './pointOfContacts';
import Privilege from './privilege';
import Screen from './screen';
import { ServiceRate } from './serviceRates';
import Service from './services';
import Transaction from './transaction';
import TransactionEmailRegistry from './transactionEmailRegistry';
import TransactionLog from './transactionLog';
import UserRole from './userRole';
import WorkspaceApiKey from './workspaceApiKeys';
import CoreRole from './coreRole';

const Model = {
  Module,
  Privilege,
  Screen,
  CountryDivision,
  AttributeValues,
  PointOfContacts,
  Service,
  Transaction,
  TransactionLog,
  TransactionEmailRegistry,
  UserRole,
  ServiceRate,
  IdentityVerification,
  WorkspaceApiKey,
  CoreRole,
};

export default Model;
