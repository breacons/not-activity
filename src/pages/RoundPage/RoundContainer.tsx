import React, { useContext, Fragment } from 'react';
import { StreamContext } from '../../App';
import PresentInRound from './PresentInRound';
import WaitInRound from './WaitInRound';
import StatusOverlay from './StatusOverlay';

import If from '../../components/If';


export const RoundContainer = () => {
  const { round, me } = useContext(StreamContext);

  if (!round) {
    return <span>Loading...</span>;
  }

  const activePlayer = round.activePlayer;

  return (
    <Fragment>
      <StatusOverlay />
      <If condition={me?.id === activePlayer.id} then={() => <PresentInRound />} else={() => <WaitInRound />} />
    </Fragment>
  );
};

export default RoundContainer;
