import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class NormalizeEmailMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && req.body.email) {
      req.body.email = req.body.email.toLowerCase().trim()
    }

    next()
  }
}
