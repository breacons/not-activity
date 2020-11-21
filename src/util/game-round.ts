import { Game } from '../types/game';

export const getCurrentRound = (game: Game) => {
  if (!game || !game.rounds || game.round === null || game.round === undefined) {
    return null;
  }

  return game.rounds[game.round];
};
