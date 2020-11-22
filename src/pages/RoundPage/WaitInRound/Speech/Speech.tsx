import React, { useState } from 'react';
import { useEffect } from 'react';

import styles from './Speech.module.sass';

const _SpeechRecognition = (window as any).webkitSpeechRecognition;
const _SpeechGrammarList = (window as any).webkitSpeechGrammarList;

const answers = ['pizza', 'elephant', 'spaceship', 'hackathon', 'weekend'];
const grammar = '#JSGF V1.0; grammar answers; public <answer> = ' + answers.join(' | ') + ' ;';

export const isSpeechAvailable = _SpeechRecognition && _SpeechGrammarList;

let recognition: any;
let speechRecognitionList: any;

if (isSpeechAvailable) {
  recognition = new _SpeechRecognition();
  speechRecognitionList = new _SpeechGrammarList();

  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}

export interface SpeechProps {
  answers: string[];
  onResult: (answer: string) => void;
}

export const Speech = (props: SpeechProps) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  useEffect(() => {
    if (recognition) {
      recognition.onresult = function (event: any) {
        const answer = event.results[0][0].transcript;
        console.log('Confidence: ' + event.results[0][0].confidence);
        props.onResult(answer);
        setIsRecording(false);
      };
    }
  }, []);

  const onStart = () => {
    if (recognition && !isRecording) {
      setIsRecording(true);
      recognition.start();
    } else if (recognition) {
      setIsRecording(false);
    }
  };

  if (!isSpeechAvailable) {
    return null;
  }

  return (
    <span onClick={onStart} className={styles.mic}>
      {isRecording ? `👂` : `🎙`}
    </span>
  );
};

export default Speech;
