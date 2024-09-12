import Match from '../database/models/Match.model';
import Team from '../database/models/Team.model';

export default class MatchService {
  public static async getAllMatches(inProgress?: string): Promise<Match[]> {
    try {
      const whereCondition = inProgress !== undefined
        ? { inProgress: inProgress === 'true' }
        : {};
      const matches = await Match.findAll({
        where: whereCondition,
        include: [
          { model: Team, as: 'homeTeam', attributes: ['teamName'] }, // Inclui informações do time da casa
          { model: Team, as: 'awayTeam', attributes: ['teamName'] }, // Inclui informações do time visitante
        ],
      });
      return matches;
    } catch (error) {
      console.error('Could not fetch matches:', error);
      throw new Error('Internal error while fetching matches');
    }
  }

  // Método para finalizar uma partida
  public static async finishMatch(id: number): Promise<void> {
    const match = await Match.findByPk(id); // Busca a partida pelo ID
    if (!match) {
      throw new Error('Match not found');
    }
    match.inProgress = false; // Define a partida como finalizada
    await match.save();
  }

  // Método para atualizar os gols da partida
  public static async updateMatch(
    id: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<void> {
    const match = await Match.findByPk(id); // Busca a partida pelo ID

    if (!match) {
      throw new Error('Match not found');
    }

    match.homeTeamGoals = homeTeamGoals; // Atualiza gols do time da casa
    match.awayTeamGoals = awayTeamGoals; // Atualiza gols do time visitante

    await match.save();
  }

  // Método para criar uma nova partida
  public static async createMatch(
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<Match> {
    await MatchService.validateMatchCreation(homeTeamId, awayTeamId); // Valida se é possível criar a partida
    const newMatch = await Match.create({
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
      inProgress: true, // Define a partida como em andamento
    });

    return newMatch; // Retorna a nova partida criada
  }

  // Método privado para validar a criação da partida
  private static async validateMatchCreation(
    homeTeamId: number,
    awayTeamId: number,
  ): Promise<void> {
    if (homeTeamId === awayTeamId) {
      throw new Error('It is not possible to create a match with two equal teams'); // Erro se os times forem iguais
    }

    const homeTeam = await Team.findByPk(homeTeamId); // Busca o time da casa pelo ID
    const awayTeam = await Team.findByPk(awayTeamId); // Busca o time visitante pelo ID

    if (!homeTeam || !awayTeam) {
      throw new Error('There is no team with such id!'); // Erro se um dos times não for encontrado
    }
  }
}
