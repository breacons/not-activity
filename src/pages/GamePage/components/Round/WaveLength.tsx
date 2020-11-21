import React, { useEffect, Fragment, useRef } from 'react';

interface WaveLengthProps {
  stream?: MediaStream | null;
}

let x = 100;

function createAudioMeter(audioContext: any, clipLevel = 0.98, averaging = 0.95, clipLag = 750) {
  const processor = audioContext.createScriptProcessor(512);
  processor.onaudioprocess = volumeAudioProcess;
  processor.clipping = false;
  processor.lastClip = 0;
  processor.volume = 0;
  processor.clipLevel = clipLevel || 0.98;
  processor.averaging = averaging || 0.95;
  processor.clipLag = clipLag || 750;

  // this will have no effect, since we don't copy the input to the output,
  // but works around a current Chrome bug.
  processor.connect(audioContext.destination);

  processor.checkClipping = function () {
    if (!this.clipping) return false;
    if (this.lastClip + this.clipLag < window.performance.now()) this.clipping = false;
    return this.clipping;
  };

  processor.shutdown = function () {
    this.disconnect();
    this.onaudioprocess = null;
  };

  return processor;
}

function volumeAudioProcess(this: any, event: any) {
  const buf = event.inputBuffer.getChannelData(0);
  const bufLength = buf.length;
  let sum = 0;
  let x: any;

  // Do a root-mean-square on the samples: sum up the squares...
  for (let i = 0; i < bufLength; i++) {
    x = buf[i];
    if (Math.abs(x) >= this.clipLevel) {
      this.clipping = true;
      this.lastClip = window.performance.now();
    }
    sum += x * x;
  }

  // ... then take the square root of the sum.
  const rms = Math.sqrt(sum / bufLength);

  // Now smooth this out with the averaging factor applied
  // to the previous sample - take the max here because we
  // want "fast attack, slow release."
  this.volume = Math.max(rms, this.volume * this.averaging);
}

const WIDTH = 300;
const HEIGHT = 300;
export const WaveLength = ({ stream }: WaveLengthProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) return;

    console.log('WaveLength', stream, stream.getAudioTracks());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    const meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    const current = canvasRef.current as HTMLCanvasElement;
    // console.log('offsetTop', current.offsetTop)
    const ctx = current.getContext('2d') as CanvasRenderingContext2D;

    const drawLoop = () => {
      // console.log('drawLoop', meter.volume)
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // check if we're currently clipping
      if (meter.checkClipping()) ctx.fillStyle = 'red';
      else ctx.fillStyle = 'green';

      // draw a bar based on the current volume
      ctx.fillRect(0, 0, meter.volume * WIDTH * 2, HEIGHT);

      requestAnimationFrame(drawLoop);
    };

    drawLoop();

    // animate(canvas, context);
  }, [stream, canvasRef]);

  return (
    <Fragment>
      Wavelength {stream?.id}
      <br />
      <canvas ref={canvasRef} style={{ width: 300, height: 300, backgroundColor: 'blue' }} />
    </Fragment>
  );
};

export default WaveLength;
