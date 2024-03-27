import * as Sequelize from "sequelize";
import { Database } from "../../config";
const sequelize = Database.sequelize;

export class Workspace extends Sequelize.Model<
  Sequelize.InferAttributes<Workspace>,
  Sequelize.InferCreationAttributes<Workspace>
> {
  declare id: Sequelize.CreationOptional<number>;
  declare dbDatabase: string;
  declare dbUsername: string;
  declare dbPassword: string
  declare dbHost: string;
  declare dbPort: number;
  declare dbDialect: string;
  declare dbDialectOptions: any;
  declare dbLogging: boolean;
  declare label: string;
  declare secret: string;
  declare owner_id: Sequelize.CreationOptional<number>;
}

Workspace.init(
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    dbDatabase: {
      type: Sequelize.STRING(25),
      defaultValue: "postgres",
      field: 'db_database',
    },
    dbUsername: {
      type: Sequelize.STRING(25),
      defaultValue: "postgres",
      field: 'db_username',
    },
    dbPassword: {
      type: Sequelize.STRING(25),
      defaultValue: "postgres",
      field: 'db_password',
    },
    dbHost: {
      type: Sequelize.STRING(25),
      defaultValue: "localhost",
      field: 'db_host',
    },
    dbPort: {
      type: Sequelize.INTEGER,
      defaultValue: 5432,
      field: 'db_port',
    },
    dbDialect: {
      type: Sequelize.STRING(25),
      defaultValue: "postgres",
      field: 'db_dialect',
    },
    dbDialectOptions: {
      type: Sequelize.JSONB,
      field: 'db_dialect_options',
    },
    dbLogging: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      field: 'db_logging',
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    secret: {
      type: Sequelize.STRING(27),
      allowNull: false,
    },
    owner_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    tableName: "workspaces",
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["secret"],
        where: {
          deleted_at: null,
        },
      },
    ],
  }
);