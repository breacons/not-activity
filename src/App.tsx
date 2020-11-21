import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import SimplePeer, { SignalData } from 'simple-peer';
import _ from 'lodash';

import io from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { URL_LOBBY, URL_GAME, URL_START, URL_GAMES, URL_LOBBIES } from './url';
import StartPage from './pages/StartPage';
import LobbyPage, { defaultPlayers } from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import { Game, Round, RoundType } from './types/game';
import { Player } from './types/player';
import { getCurrentRound } from './util/game-round';

const ENDPOINT = 'http://127.0.0.1:3012';
const socket = io(ENDPOINT);

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


const usePeerAndSocket = (localStream: MediaStream | null) => {
  const [peers, setPeers] = useState<{ [key: string]: SimplePeer.Instance }>({});
  const [streams, setStreams] = useState<{ [key: string]: MediaStream }>({});
  const [game, setGame] = useState(defaultGame);

  const addPeer = (socket_id: string, am_initiator: boolean, socket: any) => {
    const newPeer = new SimplePeer({
      initiator: am_initiator,
      config: configuration,
    });

    if (localStream) {
      newPeer.addStream(localStream);
    }

    newPeer.on('signal', (data: SignalData) => {
      // console.log('peers[socket_id].on(signal)', data);
      (socket as any).emit('signal', {
        signal: data,
        socket_id: socket_id,
      });
    });

    newPeer.on('stream', (stream) => {
      console.log('stream', socket_id, stream);
      setStreams({ ...streams, [socket_id]: stream });
    });

    setPeers({ ...peers, [socket_id]: newPeer });
  };

  const removePeer = (socket_id: string) => {
    if (peers[socket_id]) peers[socket_id].destroy();

    setPeers(_.omit(peers, socket_id));
  };

  useEffect(() => {
    console.log('useEffect');

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

    socket.on('disconnect', () => {
      console.log('GOT DISCONNECTED');
      for (const socket_id in peers) {
        removePeer(socket_id);
      }
    });
    return () => {
      console.log('Destroying');
      socket.off('initReceive');
      socket.off('initSend');
      socket.off('removePeer');
      socket.off('disconnect');
    };
  }, [peers]);

  useEffect(() => {
    if (socket) {
      socket.on('signal', (data: any) => {
        // console.log('SOCKET SIGNAL', data, peers);
        if (!(data.socket_id in peers)) {
          console.warn(`Signal for ${data.socket_id} not in peers!`);
        } else {
          if (!peers[data.socket_id].destroyed) {
            peers[data.socket_id].signal(data.signal);
          }
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
  }, [localStream]);

  return { peers, streams, game };
};

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

export const StreamContext = React.createContext({
  game: {} as Game,
  me: {} as Player,
  streams: {},
  setMyStream: (stream: MediaStream) => {
    return;
  },
  round: {} as Round | null,
});

const App = () => {
  const [me, setMe] = useState(defaultPlayers[0]);
  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  const { peers, streams, game } = usePeerAndSocket(myStream);
  const myId = socket.id;

  return (
    <StreamContext.Provider
      value={{
        me: me,
        game: defaultGame,
        streams: streams,
        setMyStream: setMyStream,
        round: getCurrentRound(game),
      }}
    >
      <Router>
        <span>Me: {myId}</span>
        <br />
        <span>Mystream: {myStream?.id}</span>
        <br />
        <hr />
        <div>Peers</div>
        <ul>
          {Object.entries(peers).map(([key, peer]) => (
            <li key={key}>{key}</li>
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
          <Redirect exact to={URL_START} />
        </Switch>
      </Router>
    </StreamContext.Provider>
  );
};

export default App;
