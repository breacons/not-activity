export const URL_START = '/start';

export const URL_LOBBIES = '/lobbies';
export const URL_LOBBY = `${URL_LOBBIES}/:gameId`;
export const getLobbyUrl = (gameId: string) => URL_LOBBY.replace(':gameId', gameId);

export const URL_GAMES = '/games';
export const URL_GAME = `${URL_GAMES}/:gameId`;
export const getGameUrl = (gameId: string) => URL_GAME.replace(':gameId', gameId);
