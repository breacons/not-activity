export enum TEAM {
  BLUE = 'BLUE',
  RED = 'RED',
}


export interface Player {
  id?: string;
  name: string;
  emoji: string;
  team?: TEAM;
}

