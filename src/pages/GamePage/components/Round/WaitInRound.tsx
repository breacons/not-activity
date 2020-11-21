import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Round, RoundType } from '../../../../types/game';
import { Player } from '../../../../types/player';
import { StreamContext } from '../../../../App';

import WaveLength from './WaveLength';
import If from '../../../../components/If';
import { setAudio, setVideo } from '../../../../util/set-video';

interface WaitInRoundProps {}

export const WaitInRound = ({}: WaitInRoundProps) => {
  const { round, streams, gameSocket, me } = useContext(StreamContext);
  const [solution, setSolution] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const getDisplayedStream = (streams: { [key: string]: MediaStream }): MediaStream | null => {
    if (Object.keys(streams).length === 0) {
      return null;
    }

    if (!round?.activePlayer.id) {
      return null;
    }

    const activePlayer = round?.activePlayer.id;
    return streams[activePlayer];
  };

  useEffect(() => {
    if (videoRef && videoRef.current !== null) {
      const stream = getDisplayedStream(streams);
      setVideo(videoRef.current, stream);
    }
  }, [streams, videoRef]);

  useEffect(() => {
    if (audioRef && audioRef.current !== null) {
      const stream = getDisplayedStream(streams);
      setAudio(audioRef.current, stream);
    }
  }, [streams, audioRef]);

  if (!round) {
    return <div>Waiting for round</div>;
  }

  const getPresentByType = () => {
    if (round.roundType === RoundType.draw) {
      return <video ref={videoRef} style={{ position: 'absolute', left: '0px', zIndex: 10 }} />;
    }

    if (round.roundType === RoundType.show) {
      return (
        <Fragment>
          <video ref={videoRef} style={{ transform: 'scaleX(-1)' }} />
          {/*<WaveLength stream={getDisplayedStream(streams)} />;*/}
        </Fragment>
      );
    }

    if (round.roundType === RoundType.talk) {
      return (
        <Fragment>
          <audio ref={audioRef} />
          <WaveLength stream={getDisplayedStream(streams)} />
        </Fragment>
      );
    }
  };

  return (
    <Fragment>
      <h1>Watching</h1>
      {getPresentByType()}
      <If
        condition={me?.team === round?.activePlayer.team || round?.timeLeft <= 10}
        then={() => (
          <Fragment>
            <input type="text" onChange={(event) => setSolution(event.target.value)} />
            <button onClick={() => gameSocket?.submitSolution(solution)}>Submit solution</button>
          </Fragment>
        )}
        else={() => <div>Wait for your turn! You can steal from the other team in the last 10 seconds</div>}
      />
    </Fragment>
  );
};

export default WaitInRound;
