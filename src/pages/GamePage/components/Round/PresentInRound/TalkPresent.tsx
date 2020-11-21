import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { StreamContext } from '../../../../../App';
import WaveLength from '../WaveLength';
import { setAudio } from '../../../../../util/set-video';

interface TalkPresentProps {}

const constraints = {
  audio: true,
  video: false,
};

export const TalkPresent = ({}: TalkPresentProps) => {
  const context = useContext(StreamContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      context.setMyStream(stream);
      setLocalStream(stream);
    });
  }, []);

  useEffect(() => {
    setAudio(audioRef.current, localStream);
  }, [localStream, audioRef]);

  return (
    <Fragment>
      <audio ref={audioRef} muted />
      <WaveLength stream={localStream} />
    </Fragment>
  );
};

export default TalkPresent;
