import { Sequelize } from 'sequelize';
import * as path from 'path';
import * as fs from 'fs';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as dotenv from 'dotenv';

dotenv.config();

export const sequelizeSeedHandlerTenant = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let sequelize: Sequelize | null = null;

  try {
    const dbType = 'tenant';
    const seedersPath = path.join(__dirname, '..', dbType, 'seeders');
    sequelize = new Sequelize({
      database: process.env.DB_NAME_TENANT || '',
      username: process.env.DB_USER_TENANT || '',
      password: process.env.DB_PASSWORD_TENANT || '',
      host: process.env.DB_HOST_TENANT || '',
      dialect: 'postgres',
    });

    const seeders = fs.readdirSync(seedersPath).filter((file) => file.endsWith('.js'));

    for (const seeder of seeders) {
      const seederFilePath = path.join(seedersPath, seeder);
      const { up } = require(seederFilePath);

      await up(sequelize.getQueryInterface(), Sequelize);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Sequelize seeding for ${dbType} completed successfully!` }),
    };
  } catch (error) {
    console.error(`Error in Sequelize seeding for tenant:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Sequelize seeding for tenant failed.' }),
    };
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};
