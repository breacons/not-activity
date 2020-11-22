export const setVideo = (video: HTMLVideoElement | null, stream?: MediaStream | null) => {
  if (!stream || !video) return;

  video.srcObject = stream;
  video.autoplay = true;
  video.className = 'vid';
  video.muted = false;
  video.controls = false;

  return video;
};

export const setAudio = (audio: HTMLAudioElement | null, stream?: MediaStream | null) => {
  if (!stream || !audio) return;

  audio.srcObject = stream;
  audio.autoplay = true;
  audio.className = 'vid';
  audio.muted = false;
  audio.controls = false;

  return audio;
};
