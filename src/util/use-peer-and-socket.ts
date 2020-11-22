import { useEffect, useState } from 'react';
import SimplePeer, { SignalData } from 'simple-peer';
import { GameInfo, GameState } from '../types/game';
import { GameSocket } from '../socket/gameSocket';
import _ from 'lodash';
import io from 'socket.io-client';

export const ENDPOINT = process.env.REACT_APP_ENDPOINT;

if (!ENDPOINT) {
  throw Error('Missing endpoint!');
}

export const socket = io(ENDPOINT);

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

export const usePeerAndSocket = (localStream: MediaStream | null) => {
  const [peers, setPeers] = useState<{ [key: string]: SimplePeer.Instance }>({});
  const [streams, setStreams] = useState<{ [key: string]: MediaStream }>({});
  const [game, setGame] = useState<GameState>();
  const [gameInfo, setGameInfo] = useState<GameState>();
  const [gameSocket, setGameSocket] = useState<GameSocket>();

  const addPeer = (socketId: string, isInitiator: boolean, socket: SocketIOClient.Socket) => {
    const newPeer = new SimplePeer({
      initiator: isInitiator,
      config: configuration,
    });

    if (localStream) {
      newPeer.addStream(localStream);
    }

    newPeer.on('signal', (data: SignalData) => {
      socket.emit('signal', {
        signal: data,
        socket_id: socketId,
      });
    });

    newPeer.on('stream', (stream) => {
      setStreams({ ...streams, [socketId]: stream });
    });

    setPeers({ ...peers, [socketId]: newPeer });
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
      socket.off('initReceive');
      socket.off('initSend');
      socket.off('removePeer');
      socket.off('disconnect');
    };
  }, [peers, addPeer, removePeer]);

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
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('signal', (data: any) => {
        if (!(data.socket_id in peers)) {
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
  }, [peers]);

  useEffect(() => {
    if (localStream) {
      for (const [key, peer] of Object.entries(peers)) {
        try {
          peer.addStream(localStream);
          console.log(`Added stream to peer ${key}`, peer);
        } catch (e) {
          console.error(`Error while adding stream to peer ${key}`, e);
        }
      }
    }
  }, [localStream, peers]);

  return { peers, streams, game, gameInfo, gameSocket, myId: socket.id };
};

export default usePeerAndSocket;
