import { GameInfo, GameState } from '../types/game';

export class GameSocket {
  interval: number | undefined = undefined;
  constructor(
    private socket: SocketIOClient.Socket,
    private callbacks: { onGameInfo: (info: GameState) => void; onGameState: (gameState: GameState) => void },
  ) {
    socket.on('gameInfo', (payload: GameState) => this.onGameInfo(payload));
    socket.on('gameState', (payload: GameState) => this.onGameState(payload));
  }

  createGame(playerName: string, webRtc: any, emoji: string) {
    this.socket.emit('createGame', { name: playerName, webRtc: webRtc, emoji });
  }

  joinGame(gameId: string, playerName: string, emoji: string) {
    this.socket.emit('joinGame', {
      player: { name: playerName, webRtc: {}, emoji },
      room: gameId,
    });
  }

  startGame() {
    this.socket.emit('startGame');
  }

  submitSolution(solution: string) {
    this.socket.emit('solution', { solution });
  }

  onGameInfo(gameInfo: GameState) {
    console.log(gameInfo);
    this.callbacks.onGameInfo(gameInfo);
  }

  onGameState(gameState: GameState) {
    // console.log(gameState);
    this.callbacks.onGameState(gameState);
    if (!this.interval) {
      this.interval = window.setInterval(() => {
        if (gameState?.rounds && gameState.rounds[gameState.round].activePlayer.id === this.socket.id) {
          this.socket.emit('tick');
          // console.log('Sending tick');
        }
      }, 1000);
    }
  }

  destroy() {
    this.socket.off('gameState');
    this.socket.off('gameInfo');
  }
}
