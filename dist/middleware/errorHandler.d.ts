import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare const errorHandler: (err: AppError | Prisma.PrismaClientKnownRequestError, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map