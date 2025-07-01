import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class VenueController {
    getVenues(req: AuthenticatedRequest, res: Response): Promise<void>;
    getVenueById(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createVenue(req: AuthenticatedRequest, res: Response): Promise<void>;
    updateVenue(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteVenue(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getVenueAvailability(req: Request, res: Response): Promise<void>;
    uploadImages(req: AuthenticatedRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=VenueController.d.ts.map