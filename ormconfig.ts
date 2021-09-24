import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'db.secret',
  synchronize: true,
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['dist/src/model/migrations/*.js'],
  cli: {
    migrationsDir: 'src/model/migrations',
  },
};

export default config;
