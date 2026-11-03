import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { EmojiSearchStatus, emojiObjects } from '../models/Emoji';
import { useGameViewModel } from '../viewModels/useGameViewModel';
import CustomCamera from './CustomCamera';

// Main game screen: shows the camera, the NEXT screen, or the GAME OVER screen, plus the info bar.
export default function GameView() {
  const vm = useGameViewModel();
  const currentEmoji = emojiObjects[vm.currentLevel];

  return (
    <View style={styles.container}>
      {vm.emojiStatus === EmojiSearchStatus.GameOver ? (
        <Pressable style={[styles.fullscreenButton, styles.gameOver]} onPress={vm.restart}>
          <Text style={styles.gameOverText}>GAME OVER{'\n'}Tap to restart</Text>
        </Pressable>
      ) : vm.showNext ? (
        <Pressable style={[styles.fullscreenButton, styles.next]} onPress={vm.startNext}>
          <Text style={styles.nextText}>NEXT</Text>
        </Pressable>
      ) : (
        <CustomCamera
          emojiNames={currentEmoji.emojiNames}
          onEmojiFound={vm.foundEmoji}
          onTensorLoaded={vm.setTensorLoaded}
        />
      )}

      {vm.emojiStatus !== EmojiSearchStatus.GameOver && (
        <View style={styles.info}>
          {vm.emojiStatus === EmojiSearchStatus.Searching && (
            <Text style={styles.timer}>Time Remaining: {vm.timeRemaining}</Text>
          )}
          <Text style={styles.emojiText}>{emojiResultText(vm.emojiStatus, currentEmoji.emoji)}</Text>
        </View>
      )}
    </View>
  );
}

// Builds the text under the timer: just the emoji, or "FOUND!" / "NOT FOUND" after the round.
function emojiResultText(status: EmojiSearchStatus, emoji: string): string {
  switch (status) {
    case EmojiSearchStatus.Found: return `${emoji} FOUND!`;
    case EmojiSearchStatus.NotFound: return `${emoji} NOT FOUND`;
    default: return emoji;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  fullscreenButton: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  next: { backgroundColor: '#34C759' },
  gameOver: { backgroundColor: '#FF3B30' },
  nextText: { color: '#fff', fontSize: 60, fontWeight: 'bold' },
  gameOverText: { color: '#fff', fontSize: 40, fontWeight: 'bold', textAlign: 'center' },
  info: {
    position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 12,
  },
  timer: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  emojiText: { color: '#fff', fontSize: 40, fontWeight: 'bold', marginTop: 4 },
});
