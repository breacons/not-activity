import React, { useContext, useEffect, Fragment, useRef, useState } from 'react';
import { StreamContext } from '../../../App';
import { setVideo } from '../../../util/set-video';

interface ShowPresentProps {}

const constraints = {
  audio: false, // TODO: set to false
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
  const videoRef = useRef<HTMLVideoElement>(null);
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
    setVideo(videoRef.current, localStream);
  }, [localStream, videoRef]);

  return (
    <Fragment>
      <video ref={videoRef} style={{ transform: 'scaleX(-1)' }} />
    </Fragment>
  );
};

export default ShowPresent;
