import { axiosInstance } from './types';
import API from '../config/endpoints.json';

interface TTSResponse {
  original_text: string;
  target_language: string;
  speaker: string;
  model: string;
  llm_res: {
    req_id: string;
    audio: string[];
  };
}

// Reusable audio instance
let audioInstance: HTMLAudioElement | null = null;

// Create or get audio element
const getAudioElement = (): HTMLAudioElement => {
  if (!audioInstance) {
    audioInstance = new Audio();
  }
  return audioInstance;
};

// Convert Base64 to WAV Blob
const base64ToBlob = (base64: string): Blob => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: 'audio/wav' });
};

// Get cached audio from sessionStorage or fetch from API
export const getTTSAudio = async (word: string): Promise<string> => {
  // Check sessionStorage cache first
  const cached = sessionStorage.getItem(word);
  if (cached) {
    return cached;
  }

  // Fetch from API if not cached
  try {
    const response = await axiosInstance.post<TTSResponse>(API.TEXT2SPEECH, {
      text: word,
    });

    if (response.data?.llm_res?.audio?.[0]) {
      const base64Audio = response.data.llm_res.audio[0];
      // Cache the Base64 audio
      sessionStorage.setItem(word, base64Audio);
      return base64Audio;
    }

    throw new Error('No audio data in response');
  } catch (error) {
    console.error('TTS API Error:', error);
    throw error;
  }
};

// Play audio from Base64
export const playTTSAudio = async (
  base64Audio: string,
  onPlayStart?: () => void,
  onPlayEnd?: () => void
): Promise<void> => {
  const audio = getAudioElement();

  // Stop current playback if any
  audio.pause();
  audio.currentTime = 0;

  // Convert Base64 to Blob and create Object URL
  const blob = base64ToBlob(base64Audio);
  const objectUrl = URL.createObjectURL(blob);

  audio.src = objectUrl;

  // Setup listeners
  const handlePlayStart = () => {
    onPlayStart?.();
  };

  const handlePlayEnd = () => {
    URL.revokeObjectURL(objectUrl);
    audio.removeEventListener('play', handlePlayStart);
    audio.removeEventListener('ended', handlePlayEnd);
    audio.removeEventListener('pause', handlePlayEnd);
    onPlayEnd?.();
  };

  audio.addEventListener('play', handlePlayStart, { once: true });
  audio.addEventListener('ended', handlePlayEnd, { once: true });
  audio.addEventListener('pause', handlePlayEnd, { once: true });

  // Play audio
  try {
    await audio.play();
  } catch (error) {
    console.error('Audio playback error:', error);
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
};

// Stop audio playback
export const stopTTSAudio = (): void => {
  if (audioInstance) {
    audioInstance.pause();
    audioInstance.currentTime = 0;
  }
};

// Fetch and play audio
export const fetchAndPlayTTS = async (
  word: string,
  onPlayStart?: () => void,
  onPlayEnd?: () => void
): Promise<void> => {
  const base64Audio = await getTTSAudio(word);
  await playTTSAudio(base64Audio, onPlayStart, onPlayEnd);
};
