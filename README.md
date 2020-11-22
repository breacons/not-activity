# Getting Started with Not Activity
## Building and running
This is a `React` frontend for our awesome Activity game. To run it, please `npm install` and `npm run start` to serve the frontend locally. Make sure you have a `.env` file set up with:
```
REACT_APP_ENDPOINT=127.0.0.1:8080
```

The backend is available in [this](https://github.com/breacons/not-activity-backend) repository. You need a running local backend to play this game locally. If you wish to play with the deployed version, you can do so [here](https://storage.googleapis.com/hacktivity-296321.appspot.com/start).

## Deployment
Make sure your `gcloud` CLI is logged in and you have selected the project. Run `./deploy.sh` to deploy the app to Cloud Storage.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Gameplay

> Important! We have tested this game on Chrome on desktop browsers and Android phones. This is will give you the best experience.

In order to play the game, you need to: 
* Input your name and create a new Game
* Ask your friends to join the same Game room (or join with 3 other browser tabs for testing)
* Once all 4 of you are present in the Lobby, click Start Game
* Teams will take turns either drawing, presenting or describing a topic. The game engine will automatically switch rounds after 30 seconds. Your team members have 15 seconds to guess, after that the other team can also guess and earn points. 
* You can guess the answer by typing in the answer field or using the microphone button. 
* The game has 5 rounds and the team with the most points wins! Enjoy!

## Implementation

Activity is not an easy game to implement online. It requires multiple types of games: drawing, presenting and describing. Lucky for us, we drew 3 APIs that fit very well for this purpose: 
* WebRTC API
* Canvas API
* WebWorker API

## Technology deep dive

Let’s take a closer look at the technologies we used this weekend (3 + 7 APIs):
* WebSocket API

Our game server communicates with players via sockets. This allows for a real-time game with good performance. Our backend was implemented in Node.js and it’s hosted on App Engine.

* WebRTC API

The players initiate connections with each other via the WebSocket and then directly engage in peer-to-peer video chat via WebRTC. The chat is high-quality and does not require expensive infrastructure to maintain.

* Canvas API

We implemented a drawing layer and interacted directly with the Canvas API. The drawing is streamed live via WebRTC to other players.

* WebWorker API

Thanks to the workers, the game behaves like a native app on smartphones. A common annoyance with Web Workers is how they cache your page and serve an older version. Worry not, you’ll get a notification if a new version of the game is available!

* Clipboard API

We spent a lot of time selecting and copy-pasting game rooms during development. To make our lives easier, we added a “Copy” button that puts the ID on the clipboard!

* Navigator.share()

Activity is meant to be played with friends, so if you open the game on your phone, you’ll be able to share a direct link to your game so your friends can join instantly.

* ReadableStream

The game requires streams in multiple places: audio from your microphone, video from your webcam, and Canvas data. The Readable Stream helps us deliver this data via WebRTC.

* Web Animations

Although not a huge part of the gameplay, when you correctly answer a question, the game rewards you with a handful of confetti thrown on the screen. It looks and feels awesome!

* Web Audio API

When someone is in the ‘describe’ stage, you don’t see their faces on the game. It would be quite boring to just hear them speak, so we implemented a little visualization that shows how their audio stream’s volume is changing.

* Web Speech API

There is very limited space on a smartphone and if you have to type in your guess in Activity, you’ll lose half of the screen. Therefore, if you click on the little microphone, you’ll be able to dictate your guess. If it matches, you win the round!

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
