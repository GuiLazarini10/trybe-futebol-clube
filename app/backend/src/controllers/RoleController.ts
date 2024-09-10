import { Request, Response } from 'express';

class RoleController {
  public static getUserRole(req: Request, res: Response): Response {
    const { user } = req.body;
    return res.status(200).json({ role: user.role });
  }
}

export default RoleController;
