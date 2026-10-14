/**
 * Native Web Speech API integration for natural English pronunciation.
 * Supports speed adjustment (0.8x for slow clear practice, 1.0x normal, 1.2x fast)
 */

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export const speakWord = (
  text: string,
  rate: number = 1.0,
  lang: string = 'en-US'
): Promise<void> => {
  return new Promise((resolve) => {
    if (!synth) {
      resolve();
      return;
    }

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick English voice if available
    const voices = synth.getVoices();
    const enVoice = voices.find(
      (v) => (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) && !v.name.includes('Google')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = () => {
      resolve();
    };

    synth.speak(utterance);
  });
};

export const stopSpeech = () => {
  if (synth) {
    synth.cancel();
  }
};
