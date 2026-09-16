import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { JobsService } from './jobs.service.js';

@Controller('jobs')
export class JobsController {
    constructor(private readonly JobsService: JobsService){}
    @Post()
    createJob(@Body() body: any){
        return this.JobsService.createJob(body.data);
    }

    @Get()
    getJobs(){
        return this.JobsService.getJobs();
    }

    @Patch(':id/status')
    updateJob(@Param('id') id: string, @Body() body: any){
        return this.JobsService.updateStatus(id, body)
    }

    @Delete(':id')
    deleteJob(@Param('id') id: string){
        return this.JobsService.deleteJob(id)
    }

}


