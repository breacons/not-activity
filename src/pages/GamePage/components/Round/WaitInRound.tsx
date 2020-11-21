import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Round, RoundType } from '../../../../types/game';
import { Player } from '../../../../types/player';
import { StreamContext } from '../../../../App';

import WaveLength from './WaveLength';

interface WaitInRoundProps {}

// TODO: component: video display
export const WaitInRound = ({}: WaitInRoundProps) => {
  const { round, streams, gameSocket } = useContext(StreamContext);
  const [solution, setSolution] = useState<string>('');
  const videoRef = useRef<any>();

  // TODO: update with socket
  const getDisplayedStream = (streams: any): MediaStream | null => {
    if (Object.keys(streams).length === 0) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.entries(streams)[0][1];
  };

  // useEffect(() => {
  //   // TODO update to show currently presenting player
  //   const stream = getDisplayedStream(streams);
  //
  //   if (!stream) return;
  //
  //   console.log('Stream', stream, stream.getTracks());
  //
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   videoRef.current.srcObject = stream;
  //   videoRef.current.playsinline = false;
  //   videoRef.current.autoplay = true;
  //   videoRef.current.className = 'vid';
  //   videoRef.current.muted = false;
  // }, [streams, videoRef]);

  useEffect(() => {
    if (videoRef && videoRef.current !== null) {
      const stream = getDisplayedStream(streams);

      if (!stream) return;
      videoRef.current.srcObject = stream;
      // videoRef.current.id = Object.keys(streams)[0];
      videoRef.current.playsinline = false;
      videoRef.current.autoplay = true;
      videoRef.current.className = 'vid';
      videoRef.current.muted = true;
    }

    // try {
    //   videoRef.current.srcObject = stream;
    // } catch (error) {
    //   videoRef.current.src = URL.createObjectURL(stream);
    // }
  }, [streams, videoRef]);

  if (!round) {
    return <div>Waiting for round</div>;
  }

  const getPresentByType = () => {
    if (round.roundType === RoundType.draw) {
      return <video ref={videoRef} style={{ left: '0px', zIndex: 10 }} />;
    }

    if (round.roundType === RoundType.show) {
      return (
        <Fragment>
          <video ref={videoRef} style={{ transform: 'scaleX(-1)' }} />
          <WaveLength stream={getDisplayedStream(streams)} />;
        </Fragment>
      );
    }

    if (round.roundType === RoundType.talk) {
      return (
        <Fragment>
          <video ref={videoRef} style={{ transform: 'scaleX(-1)', display: 'none' }} controls={true} />
          <WaveLength stream={getDisplayedStream(streams)} />;
        </Fragment>
      );
    }
  };

  return (
    <Fragment>
      <hr />
      <h1>Watching</h1>
      <h4>Left: {round?.timeLeft} seconds</h4>
      <h5>Incoming: {getDisplayedStream(streams)?.id}</h5>
      {getPresentByType()}
      <input type="text" onChange={(event) => setSolution(event.target.value)} />
      <button onClick={() => gameSocket?.submitSolution(solution)}>Submit solution</button>
      {/*<video ref={videoRef} style={{ transform: 'scaleX(-1)' }} />*/}
    </Fragment>
  );
};

export default WaitInRound;
