import {
  Model,
  DataTypes, InferAttributes, InferCreationAttributes, CreationOptional,
} from 'sequelize';
import sequelize from '.';
import Team from './Team.model';

class Matches extends Model<InferAttributes<Matches>,
InferCreationAttributes<Matches>> {
  declare id: CreationOptional<number>;
  declare homeTeamGoals: number;
  declare homeTeamId: number;
  declare awayTeamGoals: number;
  declare awayTeamId: number;
  declare inProgress: boolean;
}
Matches.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeamId: DataTypes.INTEGER,
  homeTeamGoals: DataTypes.INTEGER,
  awayTeamId: DataTypes.INTEGER,
  awayTeamGoals: DataTypes.INTEGER,
  inProgress: DataTypes.STRING,
}, {
  underscored: true,
  sequelize,
  modelName: 'Matches',
  timestamps: false,
  tableName: 'matches',
});

Team.hasMany(Matches, { foreignKey: 'homeTeamId', as: 'homeTeam' });
Team.hasMany(Matches, { foreignKey: 'awayTeamId', as: 'awayTeam' });
Matches.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'homeTeam' });
Matches.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'awayTeam' });

export default Matches;
