import { Request, Response, NextFunction } from 'express';

const cronAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['cronauth'];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'cronAuth header missing',
        });
    }

    const token = String(authHeader).replace('Bearer ', '');

    if (token !== process.env.API_AUTH_TOKEN) {
        return res.status(403).json({
            success: false,
            message: 'Invalid token',
        });
    }

    next();
};

export default cronAuth;