import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidateStatusMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const availStatus = ['pending', 'running', 'completed', 'failed'];
    const availTransitions = ['pendingTOrunning', 'runningTOcompleted', 'runningTOfailed'];
    const { currentStatus, requestedStatus } = req.body;
    const requestedTransition = `${currentStatus}TO${requestedStatus}`;

    if(!availStatus.includes(currentStatus)){
      throw new BadRequestException('Invalid current status');
    }

    if (!availStatus.includes(requestedStatus)){
      throw new BadRequestException('Invalid Requested status');
    }

    if (!availTransitions.includes(requestedTransition)){
      throw new BadRequestException(`The action ${currentStatus} to ${requestedStatus} cannot be performed`)
    }
    next();
  }
}
