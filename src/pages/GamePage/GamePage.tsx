import React, { Fragment, useContext } from 'react';
import RoundContainer from './components/Round/RoundContainer';
import { StreamContext } from '../../App';

interface GamePageProps {}

export const GamePage = ({}: GamePageProps) => {
  const { game } = useContext(StreamContext);

  if (!game || !game.rounds || game.round === null || game.round === undefined) {
    return <span>Loading</span>;
  }

  return (
    <Fragment>
      <RoundContainer />
    </Fragment>
  );
};

export default GamePage;
