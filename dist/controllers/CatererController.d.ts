import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class CatererController {
    getCaterers(req: AuthenticatedRequest, res: Response): Promise<void>;
    getCatererById(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createCaterer(req: AuthenticatedRequest, res: Response): Promise<void>;
    updateCaterer(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteCaterer(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=CatererController.d.ts.map