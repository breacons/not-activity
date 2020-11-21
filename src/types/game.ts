import { Player } from './player';

export enum RoundType {
  draw = 'draw',
  talk = 'talk',
  show = 'show',
}
// const roundTypeOrder = [RoundType.draw, RoundType.show, RoundType.talk];

export type Round = {
  roundNumber: number;
  timeLeft: number;
  activePlayer: Player;
  roundType: RoundType;
  answer: string;
  winner?: string;
};

export type Game = {
  id: string;
  round?: number;
  rounds?: Round[];
  players?: Player[];
};
