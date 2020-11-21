import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import SimplePeer, { SignalData } from 'simple-peer';

import io from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { URL_LOBBY, URL_GAME, URL_START, URL_GAMES, URL_LOBBIES } from './url';
import StartPage from './pages/StartPage';
import LobbyPage, { defaultPlayers } from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import { RoundType } from './types/game';
const ENDPOINT = 'http://127.0.0.1:3012';
let socket: any;

const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
    // public turn server from https://gist.github.com/sagivo/3a4b2f2c7ac6e1b5267c2f1f59ac6c6b
    // set your own servers here
    {
      url: 'turn:192.158.29.39:3478?transport=udp',
      credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
      username: '28224511:1379330808',
    },
  ],
};

const constraints = {
  audio: true,
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

/////////////////////////////////////////////////////////

const usePeerAndSocket = (localStream: MediaStream | null) => {
  console.log('usePeerAndSocket', localStream);
  // console.log('usePeerAndSocket');
  // const [socket, setSocket] = useState<Socket | null>(null);
  const [peers, setPeers] = useState<{ [key: string]: SimplePeer.Instance }>({});
  const [streams, setStreams] = useState<{ [key: string]: MediaStream }>({});
  const [myId, setMyId] = useState('');
  // console.log('usePeerAndSocket', peers, streams);

  const addPeer = (socket_id: string, am_initiator: boolean, socket: any) => {
    const new_peer = new SimplePeer({
      initiator: am_initiator,
      config: configuration,
    });

    new_peer.on('signal', (data: SignalData) => {
      // console.log('peers[socket_id].on(signal)', data);
      (socket as any).emit('signal', {
        signal: data,
        socket_id: socket_id,
      });
    });

    new_peer.on('stream', (stream) => {
      console.log('stream', socket_id, stream);
      setStreams({ ...streams, [socket_id]: stream });
      // let newVid = document.createElement('video');
      // newVid.srcObject = stream;
      // newVid.id = socket_id;
      // newVid.playsinline = false;
      // newVid.autoplay = true;
      // newVid.className = 'vid';
      // newVid.onclick = () => openPictureMode(newVid);
      // newVid.ontouchstart = (e) => openPictureMode(newVid);
      // videos.appendChild(newVid);
    });

    setPeers({ ...peers, [socket_id]: new_peer });
  };

  const removePeer = (socket_id: string) => {
    // let videoEl = document.getElementById(socket_id);
    // if (videoEl) {
    //   const tracks = videoEl.srcObject.getTracks();
    //
    //   tracks.forEach(function (track) {
    //     track.stop();
    //   });
    //
    //   videoEl.srcObject = null;
    //   videoEl.parentNode.removeChild(videoEl);
    // }
    if (peers[socket_id]) peers[socket_id].destroy();

    const currentPeers = peers;
    delete currentPeers[socket_id];
    setPeers(currentPeers);
  };

  useEffect(() => {
    const setup = async () => {
      socket = await io(ENDPOINT);

      socket.on('initReceive', (socket_id: string) => {
        console.log('INIT RECEIVE ' + socket_id);
        addPeer(socket_id, false, socket);

        socket.emit('initSend', socket_id);
      });

      socket.on('initSend', (socket_id: string) => {
        console.log('INIT SEND ' + socket_id);
        addPeer(socket_id, true, socket);
      });

      socket.on('removePeer', (socket_id: string) => {
        console.log('removing peer ' + socket_id);
        removePeer(socket_id);
      });

      socket.on('sendId', (socket_id: string) => {
        setMyId(socket_id);
      });

      socket.on('disconnect', () => {
        console.log('GOT DISCONNECTED');
        for (const socket_id in peers) {
          removePeer(socket_id);
        }
      });
    };

    setup();

    return () => console.log('destroyed');
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('signal', (data: any) => {
        // console.log('SOCKET SIGNAL', data, peers);
        if (!(data.socket_id in peers)) {
          console.warn(`Signal for ${data.socket_id} not in peers!`);
        } else {
          peers[data.socket_id].signal(data.signal);
        }
      });
    }
  }, [peers, socket]);

  useEffect(() => {
    if (localStream) {
      for (const [key, peer] of Object.entries(peers)) {
        peer.addStream(localStream);

      }
    }
  }, [peers, socket]);

  return { peers, streams, myId };
};

function App2() {
  console.log('App');
  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => setMyStream(stream));
  }, []);

  const { peers, streams, myId } = usePeerAndSocket(myStream);
  const videoRef = useRef<any>();

  console.log('App peers', peers, streams);

  // Will run only on mount

  // useEffect(() => {
  //   console.log('useEffect');
  //   const { name, room } = { name: 'marci', room: 'default' };
  //
  //   socket = io(ENDPOINT);
  //
  //   // setRoom(room);
  //   // setName(name)
  //
  //   socket.emit('join', { name, room }, (error: any) => {
  //     if (error) {
  //       alert(error);
  //     }
  //   });
  //
  //   socket.on('initReceive', (socket_id: string) => {
  //       console.log('INIT RECEIVE ' + socket_id);
  //     });
  // }, [ENDPOINT]);
  useEffect(() => {
    const allStream = Object.values(streams);

    if (allStream.length === 0) return;
    const stream = allStream[0];

    console.log('VIDEO', videoRef, stream);

    videoRef.current.srcObject = stream;
    videoRef.current.id = Object.keys(streams)[0];
    videoRef.current.playsinline = false;
    videoRef.current.autoplay = true;
    videoRef.current.className = 'vid';
    videoRef.current.muted = true;

    // try {
    //   videoRef.current.srcObject = stream;
    // } catch (error) {
    //   videoRef.current.src = URL.createObjectURL(stream);
    // }
  }, [streams]);

  return (
    <div className="App">
      <h3>Me: {myId}</h3>
      <video ref={videoRef} style={{ '-webkit-transform': 'scaleX(-1)', transform: 'scaleX(-1)' }} />
      peer: {Object.keys(streams)}
    </div>
  );
}

const generateRound = () => ({
  roundNumber: 0,
  timeLeft: Math.floor(Math.random() * 59) + 1,
  activePlayer: defaultPlayers[0],
  roundType: RoundType.draw, // TODO: enum should be uppercase
  answer: 'car',
});

const defaultGame = {
  id: '56473892',
  round: 0, // TODO: start from  0 or 1?
  rounds: [generateRound()],
  players: defaultPlayers,
};

const App = () => {
  const [me, setMe] = useState(defaultPlayers[0]);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // navigator.mediaDevices.getUserMedia(constraints).then((stream) => setMyStream(stream));
  }, []);

  const { peers, streams, myId } = usePeerAndSocket(myStream);
  const videoRef = useRef<any>();

  console.log('App', streams);

  useEffect(() => {
    const allStream = Object.values(streams);

    if (allStream.length === 0) return;
    const stream = allStream[0];

    // console.log('VIDEO', videoRef, stream);

    videoRef.current.srcObject = stream;
    videoRef.current.id = Object.keys(streams)[0];
    videoRef.current.playsinline = false;
    videoRef.current.autoplay = true;
    videoRef.current.className = 'vid';
    videoRef.current.muted = true;

    // try {
    //   videoRef.current.srcObject = stream;
    // } catch (error) {
    //   videoRef.current.src = URL.createObjectURL(stream);
    // }
  }, [streams]);

  const getDisplayedStream = (streams: any) => {
    if (Object.keys(streams).length === 0) {
      return '-';
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.entries(streams)[0][1].id;
  };

  return (
    <Router>
      <span>Me: {myId}</span>
      <br />
      <span>Mystream: {myStream?.id}</span>
      <br />
      <hr />
      <div>Peers</div>
      <ul>
        {Object.entries(peers).map(([key, peer]) => (
          <li>{key}</li>
        ))}
      </ul>
      <hr />
      <div>Streams</div>
      <ul>
        {Object.entries(streams).map(([key, stream]) => (
          <li>
            {stream.id} ({key})
          </li>
        ))}
      </ul>
      <hr />
      Displayed here: {getDisplayedStream(streams)}
      <br />
      <video ref={videoRef} />
      <Switch>
        <Route exact path={URL_START}>
          <StartPage />
        </Route>

        <Route exact path={URL_LOBBY}>
          <LobbyPage />
        </Route>

        <Route exact path={URL_GAME}>
          <GamePage me={me} game={defaultGame} setStream={setMyStream} />
        </Route>

        <Redirect exact from={URL_GAMES} to={URL_START} />
        <Redirect exact from={URL_LOBBIES} to={URL_START} />
        <Redirect exact from="/" to={URL_START} />
      </Switch>
    </Router>
  );
};

export default App;
