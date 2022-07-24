import { Sequelize } from 'sequelize-typescript';
import { Document, User } from '../models';
import { DATABASE_URL } from './env';
import { Umzug, SequelizeStorage } from 'umzug';

const sequelize = new Sequelize(DATABASE_URL!, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

sequelize.addModels([User, Document]);

const syncDatabase = async () => {
  await User.sync();
  await Document.sync();
};

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}
const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await syncDatabase();
    await runMigrations();
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

export { connectToDatabase, sequelize, rollbackMigration }