import { Db } from '../database/db';
import { Env } from '../helpers';
import { Logger } from '../helpers/logger';
import { seedData } from './Data.seed';

export class SeedsController {
  private db: Db;

  constructor() {
    Logger.info('Seeds controller initialized...');
    this.db = new Db();
  }

  public async initSeeds() {
    await this.runSeeds();
    this.db.DisconnectDb();
  }

  private async runSeeds() {
    const seeders = [this.runProdSeeds()];
    if (Env.Server.IS_LOCAL_ENV) {
      seeders.push(this.runLocalSeeds());
    }
    await Promise.all(seeders);
  }

  private async runProdSeeds() {
    Logger.info('Seeding all seeds...');
    // const seeders = [
    //   // new seeder functions here
    // ]
    // await Promise.all(seeders);
  }

  private async runLocalSeeds() {
    Logger.info('Seeding local database...');
    const seeders = [seedData(this.db)];
    await Promise.all(seeders);
  }
}
