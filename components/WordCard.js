import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { wordsLearningActions } from "../store/wordsLearningSlice";
import { playSound } from "../services/soundHandler";

function WordCard({ wordInfo, setNext }) {
  const [showFullInfo, setShowFullInfo] = useState(false);
  const colors = useSelector((state) => state.theme.colors);
  const styles = useMemo(() => getStyles(colors), [colors]);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.wordContainer}
        onPress={() => setShowFullInfo(true)}
      >
        {showFullInfo && wordInfo.image && (
          <Image source={{ uri: wordInfo.image }} style={styles.image} />
        )}
        <Text style={styles.word}>{wordInfo.word}</Text>
        {showFullInfo && (
          <View style={{marginTop: 20, gap: 10, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={styles.phonetics}>{wordInfo.phonetics}</Text>
            <Pressable
              style={styles.playPressable}
              onPress={() => playSound(wordInfo.audio)}
            >
              <Ionicons
                name="volume-medium-outline"
                size={28}
                color={colors.primary900}
              />
            </Pressable>
            <Text style={styles.meaning}>{wordInfo.meaning}</Text>
          </View>
        )}
      </Pressable>
      {showFullInfo && (
        <View style={styles.buttonsContainer}>
          <Pressable
            onPress={() => {
              setNext();
              setShowFullInfo(false);
            }}
            style={({ pressed }) => [
              styles.remember,
              {
                backgroundColor: colors.secondary800,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={styles.rememberText}>Didn't know it</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              dispatch(wordsLearningActions.updateWordLearnInfo(wordInfo.word));
              setShowFullInfo(false);
            }}
            style={({ pressed }) => [
              styles.remember,
              {
                backgroundColor: colors.primary900,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={styles.rememberText}>Knew it</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    wordContainer: {
      flex: 4,
      borderColor: colors.primary200,
      margin: 10,
      borderWidth: 1,
      borderRadius: 4,
      alignItems: "center",
      paddingVertical: 140,
      justifyContent: "space-evenly",
    },
    word: {
      fontSize: 28,
      color: colors.fontMain,
      fontWeight: "800",
      paddingVertical: 15,
    },
    phonetics: {
      fontSize: 18,
      color: colors.fontMain,
    },
    meaning: {
      fontSize: 18,
      color: colors.fontMain,
      textAlign: 'center'
    },
    remember: {
      flex: 1,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
      margin: 10,
    },
    rememberText: {
      fontSize: 20,
      color: colors.fontInverse,
    },
    buttonsContainer: {
      flex: 1,
      flexDirection: "row",
      marginBottom: 10,
    },
    image: {
      width: 150,
      aspectRatio: 1,
      bottom: 40,
    },
  });
}

export default WordCard;