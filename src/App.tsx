import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import SimplePeer, { SignalData } from 'simple-peer';
import _ from 'lodash';

import io from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { URL_LOBBY, URL_GAME, URL_START, URL_GAMES, URL_LOBBIES } from './url';
import StartPage from './pages/StartPage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import { Game, GameInfo, GameState, Round, RoundType } from './types/game';
import { Player } from './types/player';
import { GameSocket } from './socket/gameSocket';

const ENDPOINT = 'http://127.0.0.1:3001';
const socket = io(ENDPOINT);
// const gameSocket = Gam

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
  const [game, setGame] = useState<GameState>();
  const [gameInfo, setGameInfo] = useState<GameInfo>();
  const [gameSocket, setGameSocket] = useState<GameSocket>();

  // console.log('Peers', peers)

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
    socket.on('initReceive', (socket_id: string) => {
      console.log('INIT RECEIVE ' + socket_id);
      addPeer(socket_id, false, socket);

      socket.emit('initSend', { init_socket_id: socket_id });
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
    const gameSocket = new GameSocket(socket, {
      onGameInfo: (gameInfo) => {
        setGameInfo(gameInfo);
      },
      onGameState: (gameState) => {
        setGame(gameState);
      },
    });

    setGameSocket(gameSocket);
    return () => {
      gameSocket.destroy();
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on('signal', (data: any) => {
        console.log('SOCKET SIGNAL', data, peers);
        if (!(data.socket_id in peers)) {
          console.warn(`Signal for ${data.socket_id} not in peers!`);
        } else {
          if (!peers[data.socket_id].destroyed) {
            peers[data.socket_id].signal(data.signal);
          }
        }
      });
    }

    return () => {
      socket.off('signal');
    };
  }, [peers, socket]);

  useEffect(() => {
    if (localStream) {
      console.log('Adding localStream', Object.entries(peers), localStream.getTracks());
      for (const [key, peer] of Object.entries(peers)) {
        try {
          peer.addStream(localStream);
          console.log(`Added stream to peer ${key}`, peer);
        } catch (e) {
          console.error(`Error while adding stream to peer ${key}`, e);
        }
      }
    }
  }, [localStream]);

  return { peers, streams, game, gameInfo, gameSocket };
};

export const StreamContext = React.createContext({
  game: {} as GameState | undefined,
  gameInfo: {} as GameInfo | undefined,
  me: {} as Player | undefined,
  streams: {},
  setMyStream: (stream: MediaStream) => {
    return;
  },
  round: {} as Round | undefined,
  gameSocket: {} as GameSocket | undefined,
});

const App = () => {
  const history = useHistory();
  const [me, setMe] = useState<Player>();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  const { peers, streams, game, gameInfo, gameSocket } = usePeerAndSocket(myStream);

  const myId = socket.id;

  useEffect(() => {
    if (gameInfo) {
      setMe(gameInfo.players.find((p) => p.id === myId));
    }
  }, [gameInfo]);

  useEffect(() => {
    if (game) {
      setMe(game.players.find((p) => p.id === myId));
    }
  }, [game]);

  return (
    <StreamContext.Provider
      value={{
        me: me,
        game: game,
        gameInfo: gameInfo,
        streams: streams,
        setMyStream: setMyStream,
        round: game?.rounds[game.round],
        gameSocket: gameSocket,
      }}
    >
      <Router>
        <a href="/start">Start</a>
        <br />
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
            <li key={stream.id}>
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
            {game && me && <GamePage me={me} game={game} setStream={setMyStream} />}
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
