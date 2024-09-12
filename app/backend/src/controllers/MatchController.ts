import { Request, Response } from 'express';
import MatchService from '../Services/MatchServices';

export default class MatchController {
  // Método para obter todas as partidas com filtro opcional de status
  public static async getAllMatches(_req: Request, res: Response): Promise<Response> {
    try {
      const { inProgress } = _req.query;
      const matches = await MatchService.getAllMatches(inProgress as string); // Chama o serviço para obter partidas
      return res.status(200).json(matches); // Retorna as partidas com status 200
    } catch (error) {
      console.error('Could not fetch matches:', error);
      return res.status(500).json({ message: 'Internal error while fetching matches' }); // Erro genérico para falhas na busca
    }
  }

  // Método para finalizar uma partida
  public static async finishMatch(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await MatchService.finishMatch(Number(id)); // Chama o serviço para finalizar a partida
      return res.status(200).json({ message: 'Finished' }); // Retorna mensagem de sucesso
    } catch (error) {
      console.error('Error in the controller while ending the match.', error);
      return res.status(500).json({ message: 'Internal error while ending the match.' }); // Erro genérico para falhas ao finalizar
    }
  }

  // Método para atualizar os gols de uma partida
  public static async updateMatch(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { homeTeamGoals, awayTeamGoals } = req.body;

      await MatchService.updateMatch(Number(id), homeTeamGoals, awayTeamGoals); // Chama o serviço para atualizar a partida
      return res.status(200).json({ message: 'Match updated' }); // Retorna mensagem de sucesso
    } catch (error) {
      console.error('Error updating the match.', error);
      return res.status(500).json({ message: 'Internal error while updating the match.' }); // Erro genérico para falhas ao atualizar
    }
  }

  // Método para criar uma nova partida
  public static async createMatch(req: Request, res: Response): Promise<Response> {
    try {
      const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;

      const newMatch = await MatchService.createMatch(
        homeTeamId,
        awayTeamId,
        homeTeamGoals,
        awayTeamGoals,
      ); // Chama o serviço para criar uma nova partida

      return res.status(201).json(newMatch);
    } catch (error) {
      return MatchController.handleCreateMatchError(error, res);
    }
  }

  // Método para tratar erros específicos na criação de partidas
  private static handleCreateMatchError(error: unknown, res: Response): Response {
    console.error('Erro ao criar nova partida:', error);

    if (error instanceof Error) {
      if (error.message === 'It is not possible to create a match with two equal teams') {
        return res.status(422).json({ message: error.message });
      }
      if (error.message === 'There is no team with such id!') {
        return res.status(404).json({ message: error.message });
      }
    }

    return res.status(500).json({ message: 'Erro interno ao criar partida' });
  }
}
