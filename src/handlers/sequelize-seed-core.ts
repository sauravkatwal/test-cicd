import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { Sequelize } from 'sequelize';

dotenv.config();

export const sequelizeSeedHandlerCore = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  let sequelize: Sequelize | null = null;

  try {
    const dbType = 'core';
    const seedersPath = path.join(__dirname, '..', dbType, 'seeders');
    sequelize = new Sequelize({
      database: process.env.DB_NAME || '',
      username: process.env.DB_USER || '',
      password: process.env.DB_PASSWORD || '',
      host: process.env.DB_HOST || '',
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
    console.error(`Error in Sequelize seeding for core:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Sequelize seeding for core failed.' }),
    };
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
};
