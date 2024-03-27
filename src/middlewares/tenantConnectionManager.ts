import { TenantDatabaseInstance } from '../config';
import setupAssociations from '../tenant/models/associations';
import { ModelsInterface, WorkspaceInterface } from '../interfaces';
import { Dialect } from 'sequelize';

class Tenant {
  private static instance: Tenant;
  private connectionMap: Map<string, ModelsInterface>;

  private constructor() {
    this.connectionMap = new Map();
  }

  static get(): Tenant {
    if (!Tenant.instance) {
      Tenant.instance = new Tenant();
    }
    return Tenant.instance;
  }

  connectTenantDB = async (workspace: WorkspaceInterface): Promise<ModelsInterface> => {
    const connectionKey = workspace.secret;
    if (this.connectionMap.has(connectionKey)) {
      const models = this.connectionMap.get(connectionKey)!;
      try {
        await models.EmailRegistry.sequelize?.authenticate();
        return this.connectionMap.get(connectionKey)!;
      } catch (error) {
        const tenantConnection = new TenantDatabaseInstance(
          workspace.dbDialect as Dialect,
          workspace.dbDatabase,
          workspace.dbUsername,
          workspace.dbPassword,
          workspace.dbHost,
          workspace.dbPort,
          workspace.dbLogging,
          workspace.dbDialectOptions,
        );
        await tenantConnection.connection();
        const models = setupAssociations(tenantConnection.sequelize);
        this.connectionMap.set(connectionKey, models);

        return models;
      }
    }

    const tenantConnection = new TenantDatabaseInstance(
      workspace.dbDialect as Dialect,
      workspace.dbDatabase,
      workspace.dbUsername,
      workspace.dbPassword,
      workspace.dbHost,
      workspace.dbPort,
      workspace.dbLogging,
      workspace.dbDialectOptions,
    );
    await tenantConnection.connection();
    const models = setupAssociations(tenantConnection.sequelize);
    this.connectionMap.set(connectionKey, models);

    return models;
  };
}

const tenant = Tenant.get();

export { tenant as Tenant };
