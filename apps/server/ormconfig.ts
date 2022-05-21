import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export const mainDBConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'db.secret',
  synchronize: true,
  entities: ['dist/src/**/!(session).entity.js'],
  migrations: ['dist/src/model/migrations/*.js'],
  cli: {
    migrationsDir: 'src/model/migrations',
  },
};

export const sessionDBConfig: SqliteConnectionOptions = {
  type: 'sqlite',
  name: 'session',
  database: 'db-session.secret',
  synchronize: true,
  entities: ['dist/src/**/session.entity.js'],
};

export const ORMConfig = { mainDBConfig, sessionDBConfig };

export default ORMConfig;
