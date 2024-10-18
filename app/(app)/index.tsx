import { Image } from "expo-image";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pb from "@/utils/pb";
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
function Index() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [alreadyName, setAlreadyName] = useState(false);

  useEffect(() => {
    async function sam() {
      const res = await AsyncStorage.getItem("name");
      if (res) {
        setAlreadyName(true);
      }

      setInitialized(true);
    }
    sam();
  }, []);
  async function enterApp() {
    setLoading(true);
    if (name) {
      await AsyncStorage.setItem("name", name);
      const created = await pb
        .collection("photos")
        .create({ name, photos: [] });

      await AsyncStorage.setItem("id", created.id);
      router.push("/home");
    }
    setLoading(false);
  }
  if (!initialized) {
    return null;
  }
  if (initialized && alreadyName) {
    return <Redirect href="/home" />;
  }
  return (
    <Pressable
      className="flex-1 max-w-96 w-full mx-auto"
      onPress={() => {
        if (Platform.OS !== "web") Keyboard.dismiss();
      }}
    >
      <SafeAreaView className="bg-orange-50 flex-1 ">
        <KeyboardAvoidingView className="p-4 flex-1" behavior="padding">
          <View className="flex flex-col items-center justify-center">
            {Platform.OS === "web" ? (
              <img
                src="https://brianykari.guardalafecha.app/logo.png"
                className="w-full h-40 object-contain"
                alt="logo"
              />
            ) : (
              <Image
                source="https://brianykari.guardalafecha.app/logo.png"
                placeholder={{ blurhash }}
                contentFit="contain"
                className="w-full h-40"
                transition={1000}
              />
            )}
          </View>
          <View className="flex-1 justify-center items-center px-8 ">
            <Text className="text-sm text-gray-800 text-left w-full mb-4">
              Dinos tu nombre para empezar a tomar fotos!
            </Text>
            <TextInput
              className="bg-white border-gray-300 border-2 rounded-lg p-4 text-left w-full text-left"
              placeholder="Nombre"
              onChangeText={setName}
              value={name}
            />

            <Pressable
              className={
                !name || loading
                  ? "bg-orange-400 px-4 py-2 mt-4 text-center w-full  rounded-md opacity-20 "
                  : "bg-orange-400 px-4 py-2 mt-4 text-center w-full  rounded-md "
              }
              onPress={enterApp}
              disabled={!name || loading}
            >
              <Text
                className={"text-white font-medium text-lg text-center w-full"}
              >
                Empezar
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Pressable>
  );
}

export default Index;
