import React, { useEffect, Fragment, useRef, useContext } from 'react';

import styles from './WaveLength.module.sass';
import { Team } from '../../../types/player';
import { StreamContext } from '../../../App';
import If from "../../../components/If";

interface WaveLengthProps {
  stream?: MediaStream | null;
}

function createAudioMeter(audioContext: any, clipLevel = 0.95, averaging = 0.95, clipLag = 750) {
  const processor = audioContext.createScriptProcessor(512);
  processor.onaudioprocess = volumeAudioProcess;
  processor.clipping = false;
  processor.lastClip = 0;
  processor.volume = 0;
  processor.clipLevel = clipLevel || 0.98;
  processor.averaging = averaging || 0.95;
  processor.clipLag = clipLag || 750;

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

  for (let i = 0; i < bufLength; i++) {
    x = buf[i];
    if (Math.abs(x) >= this.clipLevel) {
      this.clipping = true;
      this.lastClip = window.performance.now();
    }
    sum += x * x;
  }

  const rms = Math.sqrt(sum / bufLength);
  this.volume = Math.max(rms, this.volume * this.averaging);
}

const WIDTH = 120;
const HEIGHT = 300;
const fps = 24;

export const WaveLength = ({ stream }: WaveLengthProps) => {
  const { round, me } = useContext(StreamContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);

    const meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    const current = canvasRef.current as HTMLCanvasElement;
    const ctx = current.getContext('2d') as CanvasRenderingContext2D;

    const drawLoop = () => {
      ctx.clearRect(0, 0, WIDTH * 3, HEIGHT);

      // ctx.fillStyle = 'green';
      ctx.fillStyle = round?.activePlayer.team === Team.RED ? '#F66689' : '#5E6EC4';
      // if (meter.checkClipping()) ctx.fillStyle = 'red';

      console.log(meter.checkClipping(), HEIGHT - HEIGHT * meter.volume * 2);

      ctx.fillRect(0, HEIGHT - HEIGHT * meter.volume * 5, WIDTH * 3, HEIGHT * meter.volume * 5);

      setTimeout(() => {
        requestAnimationFrame(drawLoop);
      }, 1000 / fps);
    };

    drawLoop();
  }, [stream, canvasRef]);

  if (!round) return null;
  const activePlayer = round.activePlayer;

  return (
    <Fragment>
      <div className={styles.container}>
        <canvas ref={canvasRef} style={{ width: WIDTH, height: HEIGHT }} className={styles.canvas} />
        <div className={styles.activePlayer}>
        <If condition={me?.id !== activePlayer.id} then={() => `${activePlayer.name} 🎤`}/>
        </div>
      </div>
    </Fragment>
  );
};

export default WaveLength;
