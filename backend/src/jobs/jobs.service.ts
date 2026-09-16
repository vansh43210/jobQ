import {
  BadRequestException,
  Body,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { db } from '../db/db.js';
import { jobsTable } from '../db/schemas/jobSchema.js';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class JobsService {
  constructor(@Inject('DATABASE') private readonly database: typeof db) {}

  async createJob(data: any) {
    const { jobTitle, jobType } = data;
    if (!jobTitle) {
      throw new BadRequestException('jobTitle was not provided');
    }

    if (!jobType) {
      throw new BadRequestException('job type was not provided');
    }

    try {
      const [insertedData] = await this.database
        .insert(jobsTable)
        .values({
          job_title: data.jobTitle,
          type: data.jobType,
        })
        .returning({
          jobId: jobsTable.job_id,
          time: jobsTable.createdAt,
        });

      if (!insertedData) {
        throw new InternalServerErrorException('Job was not created');
      }

      return insertedData;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to create job');
    }
  }

  async getJobs() {
    const allJobs = await this.database.select().from(jobsTable);
    return allJobs;
  }

  async deleteJob(id: string) {
    const deletedJob = await db
      .delete(jobsTable)
      .where(eq(jobsTable.job_id, Number(id)))
      .returning();

    if (deletedJob.length === 0) {
      throw new NotFoundException('Requested job not found');
    }

    return {
      message: 'Job deleted successfully',
    };
  }

  async updateStatus(id: string, body: any) {
    const {currentStatus, requestedStatus} = body;
    const jobId = Number(id);

    const updatedJob = await this.database
      .update(jobsTable)
      .set({
        status: requestedStatus,
      })
      .where(and(eq(jobsTable.job_id, jobId), eq(jobsTable.status, currentStatus)))
      .returning();

    if (updatedJob.length === 0) {
      throw new NotFoundException(`Requested job not found with status ${currentStatus}`);
    }
    return updatedJob[0];
  }
}
