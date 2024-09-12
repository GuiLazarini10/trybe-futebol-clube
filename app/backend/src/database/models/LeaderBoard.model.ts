import { Leaderboard } from '../../Interfaces/LeaderBoard';
import SequelizeMatch from './Match.model';
import SequelizeTeam from './Team.model';
import MatchWithTeams from '../../Interfaces/TeamMatch';
import { leaderBoardSup } from '../../Interfaces/leaderBoardSup';

// Função para criar o template de um time no leaderboard
const createLeaderboardEntry = (teamName: string): Leaderboard => ({
  name: teamName,
  totalPoints: 0,
  totalGames: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  efficiency: 0,
});

// Função para ordenar o leaderboard com base nos critérios especificados
const sortLeaderboard = (leaderboard: Leaderboard[]): Leaderboard[] =>
  leaderboard.slice().sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.totalVictories !== a.totalVictories) return b.totalVictories - a.totalVictories;
    if (b.goalsBalance !== a.goalsBalance) return b.goalsBalance - a.goalsBalance;
    return b.goalsFavor - a.goalsFavor;
  });

// Função para calcular a eficiência de um time
const calculateEfficiency = (points: number, games: number): number => (games === 0 ? 0
  : parseFloat(((points / (games * 3)) * 100).toFixed(2)));

// Função para atualizar as estatísticas de um time no leaderboard sem modificar diretamente o parâmetro
const updateTeamStats = (teamStats
: Leaderboard, homeGoals: number, awayGoals: number): Leaderboard => {
  const updatedStats = { ...teamStats };

  updatedStats.totalGames += 1;
  updatedStats.goalsFavor += homeGoals;
  updatedStats.goalsOwn += awayGoals;
  updatedStats.goalsBalance = updatedStats.goalsFavor - updatedStats.goalsOwn;

  if (homeGoals === awayGoals) {
    updatedStats.totalPoints += 1;
    updatedStats.totalDraws += 1;
  } else if (homeGoals > awayGoals) {
    updatedStats.totalPoints += 3;
    updatedStats.totalVictories += 1;
  } else {
    updatedStats.totalLosses += 1;
  }

  updatedStats.efficiency = calculateEfficiency(updatedStats.totalPoints, updatedStats.totalGames);

  return updatedStats;
};

export default class LeaderboardModel implements leaderBoardSup {
  private matchModel = SequelizeMatch;

  // Método para buscar as partidas finalizadas
  async getFinishedMatches(): Promise<MatchWithTeams[]> {
    const matches = await this.matchModel.findAll({
      where: { inProgress: false },
      include: [
        { model: SequelizeTeam, as: 'homeTeam', attributes: ['teamName'] },
        { model: SequelizeTeam, as: 'awayTeam', attributes: ['teamName'] },
      ],
    }) as unknown as MatchWithTeams[];
    return matches;
  }

  // Método para obter as estatísticas dos times que jogaram em casa
  async getHomeTeamStats(): Promise<Leaderboard[]> {
    const matches = await this.getFinishedMatches();

    const leaderboard = matches.reduce((acc: { [key: string]: Leaderboard }, match) => {
      const { homeTeam: { teamName: homeTeamName }, homeTeamGoals, awayTeamGoals } = match;

      if (!acc[homeTeamName]) acc[homeTeamName] = createLeaderboardEntry(homeTeamName);

      // Usa a função updateTeamStats para retornar um novo objeto atualizado
      acc[homeTeamName] = updateTeamStats(acc[homeTeamName], homeTeamGoals, awayTeamGoals);

      return acc;
    }, {});

    return sortLeaderboard(Object.values(leaderboard));
  }
}
