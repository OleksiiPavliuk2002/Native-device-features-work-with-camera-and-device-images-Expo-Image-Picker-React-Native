import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { wordsLearningActions } from "../../store/wordsLearningSlice";

import { getWordInfo } from "../../services/wordsHandler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { playSound } from "../../services/soundHandler";
import * as ImagePicker from "expo-image-picker";

function AddWord({ navigation }) {
  const [text, setText] = useState();
  const [wordData, setWordData] = useState();
  const [image, setImage] = useState(null);
  const colors = useSelector((state) => state.theme.colors);
  const styles = useMemo(() => getStyles(colors), [colors]);
  const dispatch = useDispatch();

  function onChangeText(text) {
    setWordData(undefined);
    setText(text);
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (text) {
        const wordDataReceived = await getWordInfo(text);
        setWordData(wordDataReceived);
        setImage(wordDataReceived?.image ?? null);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [text]);

  useEffect(() => {
    navigation.setOptions({
      title: wordData?.word ? `Adding word "${wordData.word}"` : `Adding word`,
    });
  }, [navigation, wordData]);

  function onAdd() {
    dispatch(wordsLearningActions.addWord(wordData));
    navigation.navigate("AllWords");
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Media library permissions rejected");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      setWordData((prev) => (prev ? { ...prev, image: uri } : prev));
    }
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <Pressable onPress={pickImage} style={styles.previewContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.previewPlaceholder}>
                <Text style={{ color: colors.grey600 }}>No image taken yet.</Text>
              </View>
            )}
          </Pressable>
        <Text style={styles.label}>Your word to search:</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="type here.."
          placeholderTextColor={colors.grey600}
        />
      </View>
      {wordData && (
        <View style={styles.receivedInfoContainer}>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={styles.word}>{wordData.word}</Text>
            {wordData.audio && (
              <Pressable
                style={styles.playPressable}
                onPress={() => playSound(wordData.audio)}
              >
                <Ionicons
                  name="volume-medium-outline"
                  size={28}
                  color={colors.primary900}
                />
              </Pressable>
            )}
            <Text style={styles.phonetics}>{wordData.phonetics}</Text>
          </View>
          <Text style={styles.partOfSpeech}>{wordData.partOfSpeech}</Text>
          <Text style={styles.meaning}>{wordData.meaning}</Text>
          {wordData.word && (
            <Pressable style={styles.buttonContainer} onPress={onAdd}>
              <Text style={{ fontSize: 24, color: colors.fontInverse }}>
                Add
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    input: {
      height: 40,
      fontSize: 18,
      borderColor: colors.primary200,
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      color: colors.fontMain,
    },
    label: {
      fontSize: 12,
      color: colors.grey600,
      marginBottom: 4,
    },
    inputContainer: {
      marginHorizontal: 12,
    },
    previewContainer: {
      alignItems: "center",
      marginBottom: 12,
    },
    previewImage: {
      width: 200,
      height: 200,
      borderRadius: 8,
    },
    previewPlaceholder: {
      width: 200,
      height: 200,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary200,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.fontInverse,
    },
    receivedInfoContainer: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 10,
      fontSize: 32,
    },
    word: {
      fontSize: 32,
      paddingHorizontal: 10,
      color: colors.fontMain,
    },
    phonetics: {
      fontSize: 20,
      paddingHorizontal: 10,
      color: colors.fontMain,
    },
    partOfSpeech: {
      fontSize: 20,
      paddingHorizontal: 10,
      color: colors.fontMain,
    },
    meaning: {
      fontSize: 16,
      padding: 13,
      color: colors.fontMain,
    },
    buttonContainer: {
      borderRadius: 4,
      backgroundColor: colors.primary900,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    backPressable: {
      position: "absolute",
      width: 60,
      borderRadius: 30,
      aspectRatio: 1,
      top: "2%",
      left: "2%",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },
    playPressable: {
      marginHorizontal: 20,
    },
  });
}

export default AddWord;
