import { useEffect, useReducer, useState } from 'react';
import { EmojiSearchStatus } from '../models/Emoji';
import { gameReducer, initialGameState } from './gameReducer';

// View model hook: wraps the game reducer, runs the countdown, and exposes actions for the views.
export function useGameViewModel() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const [tensorLoaded, setTensorLoaded] = useState(false);

  // Countdown: only tick while we're actively searching *and* the ML model
  // has finished loading (no fair burning the clock while MobileNet is still
  // spinning up).
  useEffect(() => {
    if (!tensorLoaded) return;
    if (state.emojiStatus !== EmojiSearchStatus.Searching) return;
    const id = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(id);
  }, [tensorLoaded, state.emojiStatus]);

  return {
    ...state,
    tensorLoaded,
    setTensorLoaded,
    // Tells the game the camera found the target emoji.
    foundEmoji: () => dispatch({ type: 'foundEmoji' }),
    // Moves on to the next emoji (or game over after the last one).
    startNext: () => dispatch({ type: 'nextEmoji' }),
    // Starts the game again from the first emoji.
    restart: () => dispatch({ type: 'restart' }),
  };
}
