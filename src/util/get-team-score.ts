import { TEAM } from '../types/player';
import { Game } from '../types/game';

export const getTeamScore = (team: TEAM, game?: Game) => {
  if (!game) return 0;
  return game.players.filter((player) => player.team === team).reduce((sum, player) => sum + player.score, 0);
};
