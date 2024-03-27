import sequelize, { Dialect } from 'sequelize';

export class TenantDatabaseInstance {
  public sequelize: sequelize.Sequelize;
  private dialect: sequelize.Dialect;
  private dbname: string;
  private username: string;
  private password: string;
  private host: string;
  private port: number;
  private maxPool: number;
  private minPool: number;
  private dbDialectOptions: object | undefined;

  public constructor(
    dbDialect: Dialect,
    dbDatabase: string,
    dbUserName: string,
    dbPassword: string,
    dbHost: string,
    dbPort: number,
    dbLogging: boolean,
    dbDialectOptions: Object | undefined,
  ) {
    this.dialect = dbDialect;
    this.dbname = dbDatabase;
    this.username = dbUserName;
    this.password = dbPassword;
    this.host = dbHost;
    this.port = dbPort;
    this.maxPool = 10;
    this.minPool = 1;
    this.dbDialectOptions = dbDialectOptions;

    this.sequelize = new sequelize.Sequelize(this.dbname, this.username, this.password, {
      host: this.host,
      dialect: this.dialect,
      dialectOptions: this.dbDialectOptions,
      port: this.port,
      logging: dbLogging ? console.log : false,
      timezone: 'utc',
      pool: {
        max: this.maxPool,
        min: this.minPool,
        idle: 0,
        acquire: 5000,
        evict: 30000,
      },
      define: {
        timestamps: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async connection(): Promise<void> {
    try {
      await this.sequelize.authenticate();
    } catch (error: any) {
      console.error(error.message);
      throw Error(error.message);
    }
  }
}
