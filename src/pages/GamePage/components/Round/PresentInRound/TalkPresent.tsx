import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Round } from '../../../../../types/game';
import { StreamContext } from '../../../../../App';
import WaveLength from '../WaveLength';

interface TalkPresentProps {}

const constraints = {
  audio: true,
  video: false,
};

export const TalkPresent = ({}: TalkPresentProps) => {
  const context = useContext(StreamContext);
  const videoRef = useRef<any>();
  const [localStream, setLocalStream] = useState<MediaStream | null>();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      context.setMyStream(stream);
      setLocalStream(stream);
    });
  }, []);

  useEffect(() => {
    if (!localStream) return;

    videoRef.current.srcObject = localStream;
    videoRef.current.playsinline = false;
    videoRef.current.autoplay = true;
    videoRef.current.className = 'vid';
    videoRef.current.muted = false;
  }, [localStream]);

  return (
    <Fragment>
      Stream id: {localStream?.id}
      <br />
      <audio ref={videoRef} style={{ transform: 'scaleX(-1)', display: 'none' }} />
      <WaveLength stream={localStream} />
    </Fragment>
  );
};

export default TalkPresent;
