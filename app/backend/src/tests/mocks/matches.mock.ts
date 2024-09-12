// matches.mock.ts
export const matchMock = {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 2,
    awayTeam: 8,
    awayTeamGoals: 2,
    inProgress: true,
  };
  
  export const matchesMock = [
    matchMock,
    {
      id: 2,
      homeTeam: 9,
      homeTeamGoals: 1,
      awayTeam: 14,
      awayTeamGoals: 1,
      inProgress: false,
    },
  ];
  
  export const newMatch = {
    homeTeam: 4,
    awayTeam: 11,
    homeTeamGoals: 3,
    awayTeamGoals: 1,
    inProgress: true,
  };
  
  export const createdMatch = {
    id: 3,
    ...newMatch,
  };
  
  export const updateMatch = {
    homeTeamGoals: 4,
    awayTeamGoals: 2,
  };
  