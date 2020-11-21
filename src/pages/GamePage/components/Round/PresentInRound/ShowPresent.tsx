import React, { useContext, useEffect, Fragment, useRef, useState } from 'react';
import { Round } from '../../../../../types/game';
import { Player } from '../../../../../types/player';
import { StreamContext } from '../../../../../App';

interface ShowPresentProps {
  //
  a?: null;
}

const constraints = {
  audio: false,
  video: {
    facingMode: {
      ideal: 'user',
    },
    width: {
      max: 300,
    },
    height: {
      max: 300,
    },
  },
};

export const ShowPresent = ({}: ShowPresentProps) => {
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
    videoRef.current.muted = true;
  }, [localStream]);

  return (
    <Fragment>
      <h1>Presenting</h1>
      Stream id: {localStream?.id}
      <video ref={videoRef} style={{ transform: 'scaleX(-1)' }} />
    </Fragment>
  );
};

export default ShowPresent;
