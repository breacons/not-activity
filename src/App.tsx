import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import StartPage from './pages/StartPage';
import LobbyPage from './pages/LobbyPage';
import RoundContainer from './pages/RoundPage';

import { GameInfo, GameState, Round, Solution } from './types/game';
import { Player, Team } from './types/player';

import { GameSocket } from './socket/gameSocket';
import If from './components/If';

import { usePeerAndSocket } from './util/use-peer-and-socket';
import { getTeamScore } from './util/get-team-score';

import { URL_GAME, URL_GAMES, URL_LOBBIES, URL_LOBBY, URL_START } from './url';
import './App.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

export const StreamContext = React.createContext({
  game: {} as GameState | undefined,
  gameInfo: {} as GameState | undefined,
  me: {} as Player | undefined,
  streams: {},
  setMyStream: (_: MediaStream) => {
    return;
  },
  round: {} as Round | undefined,
  gameSocket: {} as GameSocket | undefined,
  solutions: [] as Solution[],
});

const Debug = ({ me, game, myStream, peers, streams }: any) => {
  return (
    <div style={{ position: 'absolute' }}>
      <a href="/start">Start</a>
      <br />
      <hr />
      <h3>Me</h3>
      <div>
        Name: {me?.name} {me?.emoji}
      </div>
      <div>
        Team:{' '}
        <span style={{ color: me?.team === Team.RED ? 'red' : 'blue' }}>
          <strong>{me?.team}</strong>
        </span>
      </div>
      <div>
        ID: <strong>{me?.id}</strong>
      </div>
      <div>Stream: {myStream?.id}</div>
      <hr />
      <h3>Game</h3>
      <div>
        Game: <strong>{game?.id}</strong>
      </div>
      <div>
        My score: <strong>{me?.score}</strong>
      </div>
      <div>
        Round: <strong>{game?.round}</strong>
      </div>
      <div>
        Time: <strong>{game?.rounds[game.round].timeLeft}</strong>
      </div>
      <div>
        Active player: <strong>{game?.rounds[game.round].activePlayer.name}</strong>
      </div>
      <div>
        Round type: <strong>{game?.rounds[game.round].roundType}</strong>
      </div>
      <div>
        Answer: <strong>{game?.rounds[game.round].answer}</strong>
      </div>
      <div>
        <span style={{ color: 'red' }}>RED: {getTeamScore(Team.RED, game)}</span>{' '}
        <span style={{ color: 'blue' }}>BLUE: {getTeamScore(Team.BLUE, game)}</span>
      </div>
      <hr />
      <h3>Peers</h3>
      <ul>
        {Object.entries(peers).map(([key, peer]) => (
          <li key={key}>{key}</li>
        ))}
      </ul>
      <hr />
      <h3>Streams</h3>
      <ul>
        {Object.entries(streams).map(([key, stream]: [string, any]) => (
          <li key={stream.id}>
            {stream.id} ({key})
          </li>
        ))}
      </ul>
    </div>
  );
};

const StatusOverLay = {};

const App = () => {
  const [me, setMe] = useState<Player>();
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [showServiceWorkerUpdate, setShowServiceWorkerUpdate] = useState<boolean>(false);
  const [showServiceWorkerInstalled, setShowServiceWorkerInstalled] = useState<boolean>(false);

  const { peers, streams, game, gameInfo, gameSocket, myId, solutions } = usePeerAndSocket(myStream);

  useEffect(() => {
    serviceWorkerRegistration.register({
      onSuccess: () => {
        setShowServiceWorkerInstalled(true);
      },
      onUpdate: () => {
        setShowServiceWorkerUpdate(true);
      },
    });
  }, []);

  useEffect(() => {
    if (gameInfo) {
      setMe(gameInfo.players.find((p) => p.id === myId));
    }
  }, [gameInfo, myId]);

  useEffect(() => {
    if (game) {
      setMe(game.players.find((p) => p.id === myId));
    }
  }, [game, myId]);

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
        solutions,
      }}
    >
      <Router basename={process.env.PUBLIC_URL.split('/').pop()}>
        <Switch>
          <Route exact path={URL_START}>
            <StartPage />
          </Route>

          <Route exact path={URL_LOBBY}>
            <LobbyPage />
          </Route>

          <Route exact path={URL_GAME}>
            <If
              condition={game && me}
              then={() => (
                <Fragment>
                  {/*<Debug myStream={myStream} me={me} game={game} peers={peers} streams={streams} />*/}
                  <RoundContainer />
                </Fragment>
              )}
            />
          </Route>

          <Redirect exact from={URL_GAMES} to={URL_START} />
          <Redirect exact from={URL_LOBBIES} to={URL_START} />
          <Redirect exact to={URL_START} />
        </Switch>
      </Router>
      <If
        condition={showServiceWorkerUpdate}
        then={() => (
          <div className="notification" onClick={() => setShowServiceWorkerUpdate(false)}>
            We have an update! Please close this tab and open it again to see new features! ♻️
          </div>
        )}
      />
      <If
        condition={showServiceWorkerInstalled}
        then={() => (
          <div className="notification" onClick={() => setShowServiceWorkerInstalled(false)}>
            Woohoo! The app has been installed offline and will run super fast! 🚀
          </div>
        )}
      />
    </StreamContext.Provider>
  );
};

export default App;
