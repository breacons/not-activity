import React, { useContext, useEffect, Fragment, useRef, useState } from 'react';
import { StreamContext } from '../../../../../App';
import WaveLength from '../WaveLength';

interface ShowPresentProps {}

const constraints = {
  audio: true, // TODO: set to false
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
      for (const index in stream.getAudioTracks()) {
        stream.getAudioTracks()[index].enabled = true;
      }

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
      <p>
        Present this: <i>{context.round?.answer}</i>
      </p>
      <video ref={videoRef} style={{ transform: 'scaleX(-1)' }} />
      <WaveLength stream={localStream} />
    </Fragment>
  );
};

export default ShowPresent;
