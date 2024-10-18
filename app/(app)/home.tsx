import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import CameraIcon from "@/components/CameraIcon";
import { Link, Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pb from "@/utils/pb";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";
function Index() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const name = await AsyncStorage.getItem("name");
        const id = await AsyncStorage.getItem("id");
        setName(name || "");
        if (!name) return;
        const photos = await pb.collection("photos").getOne(id || "");
        setPhotos(
          photos.photos
            ?.map(
              (ph: string) =>
                `https://api.studiospulse.com/api/files/photos/${id}/${ph}`,
            )
            .reverse() || [],
        );
        if (id) {
          pb.collection("photos").subscribe(id, function (e) {
            if (e.action === "update") {
              setPhotos(
                e.record.photos
                  ?.map(
                    (ph: string) =>
                      `https://api.studiospulse.com/api/files/photos/${id}/${ph}`,
                  )
                  .reverse() || [],
              );
            }
          });
        }
      } catch (e) {
        console.log(e);
      }

      setLoading(false);
    })();
  }, []);
  if (loading) {
    return null;
  }
  if (!loading && !name) {
    return <Redirect href="/" />;
  }
  return (
    <SafeAreaView className="bg-orange-50 flex-1   mx-auto">
      <View className="p-4 flex-1 max-w-96 w-full">
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

          <Text className="text-2xl font-medium text-slate-500">
            Bienvenido {name}
          </Text>
        </View>
        <View className="flex-1 p-4 flex flex-col items-center justify-center ">
          {photos.length === 0 && (
            <Text className="text-gray-400 text-center mb-2">
              No tienes fotos aún, empieza a tomar!
            </Text>
          )}
          {photos.length > 0 && (
            <Text className="text-gray-600 text-center mb-2">
              Espectaculares las fotos que tomaste hasta ahora, no te detengas!!
            </Text>
          )}
          <ScrollView
            horizontal
            className="w-full"
            contentContainerClassName="w-full"
          >
            <View className="flex h-full  items-center flex-row gap-4 w-full">
              {photos.length > 0 &&
                photos.map((ph: string) =>
                  Platform.OS === "web" ? (
                    <img
                      key={ph}
                      src={ph}
                      className="aspect-square w-64 rounded-2xl object-cover"
                    />
                  ) : (
                    <Image
                      key={ph}
                      source={ph}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                      className="aspect-square w-64 rounded-2xl "
                      transition={1000}
                    />
                  ),
                )}
            </View>
          </ScrollView>
        </View>
        <Link href="/camera" className="mx-auto">
          <View className="p-3">
            <CameraIcon className="w-24 aspect-square mx-auto" />
          </View>
        </Link>
      </View>
    </SafeAreaView>
  );
}

export default Index;
