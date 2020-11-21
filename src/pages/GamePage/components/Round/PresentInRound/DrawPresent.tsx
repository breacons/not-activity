import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Round } from '../../../../../types/game';
import { StreamContext } from '../../../../../App';

interface DrawPresentProps {
  round: Round;
  setStream: (stream: MediaStream) => void;
}

// captureStream is not official yet
interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}

// todo: disable scroll
export const DrawPresent = ({}: DrawPresentProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { round, setMyStream } = useContext(StreamContext);
  const [stream, setLocalStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<any>(null);
  const pos = { x: 0, y: 0 };

  useEffect(() => {
    if (canvas) {
      const current = canvas.current as CanvasElement;
      // console.log('offsetTop', current.offsetTop)
      const ctx = current.getContext('2d') as CanvasRenderingContext2D;
      const stream = current.captureStream(25);

      setLocalStream(stream);
      setMyStream(stream);

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 300, 500);

      const setPosition = (x: number, y: number) => {
        pos.x = x - current.offsetLeft;
        pos.y = y - current.offsetTop;
      };

      const setPositionEvent = (e: MouseEvent) => {
        pos.x = e.clientX - current.offsetLeft;
        pos.y = e.clientY - current.offsetTop;
      };

      // resize canvas
      const resize = () => {
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
      };

      const draw = (e: MouseEvent) => {
        // mouse left button must be pressed

        if (e.buttons !== 1) return;

        ctx.beginPath(); // begin

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'blue';

        ctx.moveTo(pos.x, pos.y); // from
        setPosition(e.clientX, e.clientY);
        ctx.lineTo(pos.x, pos.y); // to

        ctx.stroke(); // draw it!
      };

      current.addEventListener('mousemove', draw);
      current.addEventListener('mousedown', setPositionEvent);
      current.addEventListener('mouseenter', setPositionEvent);

      current.addEventListener('touchstart', (event) => {
        const newX = event.touches[0].clientX;
        const newY = event.touches[0].clientY;
        setPosition(newX, newY);
      });
      // current.addEventListener('touchend', () => console.log('touchend'));

      current.addEventListener('touchmove', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const newX = event.touches[0].clientX;
        const newY = event.touches[0].clientY;

        // line(lastx,lasty, newx,newy);

        ctx.beginPath(); // begin

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'blue';

        ctx.moveTo(pos.x, pos.y); // from
        setPosition(newX, newY);

        ctx.lineTo(pos.x, pos.y); // to

        ctx.stroke(); // draw it!
      });
    }
  }, [canvas]);

  useEffect(() => {
    if (videoRef && videoRef.current !== null) {
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
  }, [stream]);

  return (
    <Fragment>
      <h4>
        Draw this: <i>{round?.answer}</i>
        <br />
      </h4>
      <hr />
      Canvas stream id: {stream?.id}
      <br />
      <canvas
        ref={canvas}
        width={300}
        height={500}
        style={{ border: '5px red solid', position: 'absolute', marginBottom: 600 }}
      />
      <hr />
      Stream in video: {stream?.id}
      <video ref={videoRef} style={{ position: 'absolute', top: '1050px', zIndex: -10 }} />
    </Fragment>
  );
};

export default DrawPresent;
