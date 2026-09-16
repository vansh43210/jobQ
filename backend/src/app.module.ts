import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module.js'
import { JobsModule } from './jobs/jobs.module.js';

@Module({
  imports: [JobsModule, DbModule],
})
export class AppModule {}
