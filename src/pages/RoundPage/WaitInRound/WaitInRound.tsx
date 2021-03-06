import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Round, RoundType } from '../../../types/game';
import { StreamContext } from '../../../App';

import WaveLength from '../WaveLength/WaveLength';
import If from '../../../components/If';
import { setAudio, setVideo } from '../../../util/set-video';

import styles from './WaitInRound.module.sass';
import { Speech } from './Speech';
import { STEAL_AFTER } from '../../../config';
import { Team } from '../../../types/player';

// HTML5 Video cannot be styled from sass
export const fullScreenDrawingStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  zIndex: -1000,
  width: '100%',
  height: '100vh',
} as React.CSSProperties;

export const fullScreenVideoStyle = {
  ...fullScreenDrawingStyle,
  transform: 'scaleX(-1)',
} as React.CSSProperties;

export const WaitInRound = () => {
  const { round, streams, gameSocket, me, game, solutions } = useContext(StreamContext);
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

  useEffect(() => {
    setSolution('');
  }, [round?.roundNumber]);

  if (!round) {
    return <div></div>;
  }

  const getPresentByType = () => {
    if (round.roundType === RoundType.draw) {
      return <video ref={videoRef} style={fullScreenDrawingStyle} />;
    }

    if (round.roundType === RoundType.show) {
      return (
        <Fragment>
          <video ref={videoRef} style={fullScreenVideoStyle} />
        </Fragment>
      );
    }

    if (round.roundType === RoundType.talk) {
      return (
        <Fragment>
          <audio ref={audioRef} muted={false} style={{ display: 'none' }} />
          <WaveLength stream={getDisplayedStream(streams)} />
        </Fragment>
      );
    }
  };

  return (
    <Fragment>
      <If
        condition={me?.team === round?.activePlayer.team || round?.timeLeft <= STEAL_AFTER}
        then={() => (
          <Fragment>
            <input
              type="text"
              onChange={(event) => setSolution(event.target.value)}
              className={styles.solutionInput}
              autoFocus={true}
              style={{ color: round?.activePlayer.team === Team.RED ? '#F66689' : '#5E6EC4' }}
              value={solution}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  ev.preventDefault();
                  if (gameSocket) {
                    gameSocket.submitSolution(solution.toLowerCase());
                  }
                }
              }}
            />
            <Speech
              answers={[]}
              onResult={(answer) => {
                setSolution(answer);
                setTimeout(() => {
                  if (gameSocket) {
                    gameSocket.submitSolution(answer.toLowerCase());
                  }
                }, 1000);
              }}
            />

            {/*<button onClick={() => gameSocket?.submitSolution(solution)}>Submit solution</button>*/}
          </Fragment>
        )}
      />
      {getPresentByType()}
    </Fragment>
  );
};

export default WaitInRound;
