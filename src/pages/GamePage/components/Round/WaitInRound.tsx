import React, { Fragment, useContext, useEffect, useRef } from 'react';
import { Round, RoundType } from '../../../../types/game';
import { Player } from '../../../../types/player';
import { StreamContext } from '../../../../App';

import WaveLength from './WaveLength';

interface WaitInRoundProps {}

// TODO: component: video display
export const WaitInRound = ({}: WaitInRoundProps) => {
  const { round, streams } = useContext(StreamContext);
  const videoRef = useRef<any>();

  // TODO: update with socket
  const getDisplayedStream = (streams: any) => {
    if (Object.keys(streams).length === 0) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.entries(streams)[0][1];
  };

  useEffect(() => {
    // TODO update to show currently presenting player
    const stream = getDisplayedStream(streams);

    if (!stream) return;

    videoRef.current.srcObject = stream;
    videoRef.current.playsinline = false;
    videoRef.current.autoplay = true;
    videoRef.current.className = 'vid';
    videoRef.current.muted = true;
  }, [streams]);

  if (!round) {
    return <div>Waiting for round</div>;
  }

  const getPresentByType = () => {
    if (round.roundType === RoundType.draw) {
      return <video ref={videoRef} />;
    }

    if (round.roundType === RoundType.show) {
      return (
        <Fragment>
          <video ref={videoRef} style={{ transform: 'scaleX(-1)' }} />
          {/*<WaveLength stream={getDisplayedStream(streams)} />*/}
        </Fragment>
      );
    }

    if (round.roundType === RoundType.talk) {
      // return <WaveLength />;
      return null;
    }
  };

  return (
    <Fragment>
      <hr />
      <h1>Watching</h1>
      {getPresentByType()}
    </Fragment>
  );
};

export default WaitInRound;
