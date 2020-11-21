import React, { Fragment } from 'react';
// import { useParams } from 'react-router';
import { Player } from '../../types/player';
import { Game } from '../../types/game';
import RoundContainer from './components/Round/RoundContainer';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface GamePageProps {
  me: Player;
  game: Game;
  setStream: (stream: MediaStream) => void;
}

export const GamePage = ({ me, game, setStream }: GamePageProps) => {
  // const { gameId } = useParams<{ gameId: string }>();

  if (!game || !game.rounds || game.round === null || game.round === undefined) {
    return <span>Loading</span>;
  }

  const round = game.rounds[game.round];

  return (
    <Fragment>
      <h5>Welcome to the game {game.id}</h5>
      <RoundContainer round={round} me={me} setStream={setStream}/>
    </Fragment>
  );
};

export default GamePage;
