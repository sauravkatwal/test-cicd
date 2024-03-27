import {
  Address,
  Attribute,
  Company,
  User,
  UserWorkspace,
  Workspace
} from '..';

import AttributeValues from '../attributeValue';
import Service from '../services';
import Transaction from '../transaction';
import TransactionEmailRegistry from '../transactionEmailRegistry';
import UserRole from '../userRole';
import CoreRole from '../coreRole';
import PointOfContacts from '../pointOfContacts';


// User and Workspace relation
Workspace.belongsTo(User, {
  foreignKey: 'owner_id',
  as: 'owner',
});

User.hasOne(Workspace, {
  foreignKey: 'owner_id',
  as: 'owner_workspace',
});

User.hasMany(UserWorkspace, {
  foreignKey: 'user_id',
  as: 'user_workspaces',
});

UserWorkspace.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Workspace.hasMany(UserWorkspace, {
  foreignKey: 'workspace_id',
  as: 'workspace_users',
});

UserWorkspace.belongsTo(Workspace, {
  foreignKey: 'workspace_id',
  as: 'workspace',
});

User.belongsToMany(Workspace, {
  through: { model: UserWorkspace },
  as: 'workspaces',
  foreignKey: 'user_id',
  otherKey: 'workspace_id',
});

Workspace.belongsToMany(User, {
  through: { model: UserWorkspace },
  as: 'users',
  foreignKey: 'workspace_id',
  otherKey: 'user_id',
});

// User and Company relation
Company.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

User.hasOne(Company, {
  foreignKey: 'user_id',
  as: 'company',
});

// company and workspace relation
Company.belongsTo(Workspace, {
  foreignKey: 'workspace_id',
  as: 'workspace',
});

Workspace.hasOne(Company, {
  foreignKey: 'workspace_id',
  as: 'companies',
});

Workspace.hasOne(Company, {
  foreignKey: 'workspace_id',
  as: 'company',
});

// Company and Address relation
Company.hasOne(Address, {
  foreignKey: 'company_id',
  as: 'address',
});

Address.belongsTo(Company, {
  foreignKey: 'company_id',
  as: 'company',
});


/* Relation between Attributes and Attributes Value */
Attribute.hasMany(AttributeValues, {
  foreignKey: 'attribute_id',
  as: 'attributeValues',
});

AttributeValues.belongsTo(Attribute, {
  foreignKey: 'attribute_id',
  as: 'attribute',
});

// Transaction , services and UserWorkspace
Transaction.belongsTo(Service, {
  foreignKey: 'serviceId',
  as: 'service',
});

Transaction.belongsTo(User, {
  foreignKey: 'transactionById',
  as: 'transactionBy',
});

TransactionEmailRegistry.belongsTo(Transaction, {
  foreignKey: 'transactionId',
  as: 'transaction',
});

Transaction.hasMany(TransactionEmailRegistry, {
  foreignKey: 'transactionId',
  as: 'transactionEmailRegistries',
});

UserRole.belongsTo(User, {
  as: 'userRole',
  foreignKey: 'userId'
});

User.hasOne(UserRole, {
  as: 'userRole',
  foreignKey: 'userId'
})

UserRole.belongsTo(CoreRole, {
  as: 'role',
  foreignKey: 'roleId'
})

PointOfContacts.belongsTo(Workspace, {
  foreignKey: 'workspaceId',
  as: 'workspace'
});

Workspace.hasOne(PointOfContacts, {
  foreignKey: 'workspaceId',
  as: 'pointOfContact'
})
