import { Request, Response } from 'express';
import Team from '../database/models/Team.model';

class TeamController {
  public static async getAllTeams(req: Request, res: Response): Promise<Response> {
    try {
      const teams = await Team.findAll();
      return res.status(200).json(teams);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar times' });
    }
  }

  public static async getTeamById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const team = await Team.findByPk(id); // Busca o time pelo ID

      if (!team) {
        return res.status(404).json({ message: 'Time não encontrado' });
      }

      return res.status(200).json(team);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar o time' });
    }
  }
}

export default TeamController;
