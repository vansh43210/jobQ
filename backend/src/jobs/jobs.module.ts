import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JobsController } from './jobs.controller.js';
import { JobsService } from './jobs.service.js';
import { DbModule } from '../db/db.module.js';
import { ValidateStatusMiddleware } from '../validate-status/validate-status.middleware.js';

@Module({
  imports: [DbModule],
  controllers: [JobsController],
  providers: [JobsService]
})
export class JobsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateStatusMiddleware)
      .forRoutes({
        path: 'jobs/:id/status',
        method: RequestMethod.PATCH,
      });
  }
}