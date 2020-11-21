import React, { Fragment, useContext, useEffect, useRef } from 'react';
import { Round, RoundType } from '../../../../types/game';
import { Player } from '../../../../types/player';
import { StreamContext } from '../../../../App';

interface WaitInRoundProps {
  a?: null;
}

export const WaitInRound = ({}: WaitInRoundProps) => {
  const context = useContext(StreamContext);
  const videoRef = useRef<any>();

  console.log('Context', context);

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
    const stream = getDisplayedStream(context.streams);

    if (!stream) return;

    console.log('setting', stream);
    videoRef.current.srcObject = stream;
    videoRef.current.playsinline = false;
    videoRef.current.autoplay = true;
    videoRef.current.className = 'vid';
    videoRef.current.muted = true;
  }, [context.streams]);

  return (
    <Fragment>
      <hr />
      <video
        ref={videoRef}
        style={
          context.round?.roundType === RoundType.show
            ? { '-webkit-transform': 'scaleX(-1)', transform: 'scaleX(-1)' }
            : {}
        }
      />
    </Fragment>
  );
};

export default WaitInRound;
