import { Request, Response } from 'express';
import Match from '../database/models/Match.model';
import Team from '../database/models/Team.model';

class MatchController {
  public static async getAllMatches(req: Request, res: Response): Promise<Response> {
    try {
      const inProgress = req.query.inProgress as string | undefined;

      console.log('Valor de inProgress:', inProgress);

      const matches = await MatchController.findMatches(inProgress);

      console.log('Partidas encontradas:', matches);

      if (matches.length === 0) {
        console.error('Nenhuma partida encontrada.');
      }

      return res.status(200).json(matches);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao buscar partidas:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
      }
      console.error('Erro desconhecido ao buscar partidas:', error);
      return res.status(500).json({ message: 'Internal server error', error: 'Unknown error' });
    }
  }

  private static async findMatches(inProgress: string | undefined) {
    const filter = inProgress !== undefined ? { inProgress: inProgress === 'true' } : {};

    try {
      return await Match.findAll({
        where: filter,
        include: [
          { model: Team, as: 'homeTeam', attributes: ['teamName'] },
          { model: Team, as: 'awayTeam', attributes: ['teamName'] },
        ],
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao executar a consulta no banco de dados:', error.message);
        throw error;
      } else {
        console.error('Erro desconhecido ao executar a consulta no banco de dados:', error);
        throw new Error('Unknown error occurred');
      }
    }
  }
}

export default MatchController;
