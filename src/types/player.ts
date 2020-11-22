export enum Team {
  BLUE = 'BLUE',
  RED = 'RED',
}

export interface Player {
  id?: string;
  name: string;
  emoji: string;
  team?: Team;
  score: number;
}
