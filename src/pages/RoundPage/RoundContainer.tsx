import React, { useContext, Fragment } from 'react';
import { StreamContext } from '../../App';
import PresentInRound from './PresentInRound';
import WaitInRound from './WaitInRound';
import StatusOverlay from './StatusOverlay';

import If from '../../components/If';
import { GameOver } from './GameOver';

export const RoundContainer = () => {
  const { round, me, game } = useContext(StreamContext);

  if (!round) {
    return <span>Loading...</span>;
  }

  const activePlayer = round.activePlayer;

  if (game?.isOver) {
    return <GameOver />;
  }

  return (
    <Fragment>
      <StatusOverlay />
      <If condition={me?.id === activePlayer.id} then={() => <PresentInRound />} else={() => <WaitInRound />} />
    </Fragment>
  );
};

export default RoundContainer;
