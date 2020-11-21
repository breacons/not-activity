import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { StreamContext } from '../../../App';

interface DrawPresentProps {}

// captureStream is not official yet
interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}

export const DrawPresent = ({}: DrawPresentProps) => {
  const { setMyStream } = useContext(StreamContext);
  const [size, setSize] = useState({ width: 300, height: 500 });

  const canvas = useRef<HTMLCanvasElement>(null);
  const position = { x: 0, y: 0 };

  useEffect(() => {
    if (canvas) {
      const current = canvas.current as CanvasElement;
      const ctx = current.getContext('2d') as CanvasRenderingContext2D;
      const stream = current.captureStream(25);

      setMyStream(stream);

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size.width, size.height);

      const setPosition = (x: number, y: number) => {
        position.x = x - current.offsetLeft;
        position.y = y - current.offsetTop;
      };

      const setPositionEvent = (e: MouseEvent) => {
        position.x = e.clientX - current.offsetLeft;
        position.y = e.clientY - current.offsetTop;
      };

      // resize canvas
      // const resize = () => {
      //   ctx.canvas.width = window.innerWidth;
      //   ctx.canvas.height = window.innerHeight;
      // };

      const drawLine = (x: number, y: number) => {
        ctx.beginPath();

        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';

        ctx.moveTo(position.x, position.y);
        setPosition(x, y);
        ctx.lineTo(position.x, position.y);

        ctx.stroke();
      };

      current.addEventListener('mousemove', (e: MouseEvent) => {
        if (e.buttons !== 1) return;

        drawLine(e.clientX, e.clientY);
      });
      current.addEventListener('mousedown', setPositionEvent);
      current.addEventListener('mouseenter', setPositionEvent);

      current.addEventListener('touchstart', (event) => {
        const newX = event.touches[0].clientX;
        const newY = event.touches[0].clientY;
        setPosition(newX, newY);
      });

      current.addEventListener('touchmove', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const newX = event.touches[0].clientX;
        const newY = event.touches[0].clientY;

        drawLine(newX, newY);
      });
    }
  }, [canvas]);

  // useEffect(() => {
  //   setVideo(videoRef.current, stream);
  // }, [stream, videoRef]);

  return (
    <Fragment>
      <div style={{ height: size.height, display: 'block' }}>
        <canvas
          ref={canvas}
          width={size.width}
          height={size.height}
          style={{ border: '5px red solid', position: 'fixed' }}
        />
      </div>
    </Fragment>
  );
};

export default DrawPresent;
