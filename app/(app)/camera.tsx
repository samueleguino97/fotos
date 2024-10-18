import React, { useEffect, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import {
  ActivityIndicator,
  Button,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import CameraIcon from "@/components/CameraIcon";
import { router } from "expo-router";
import pb from "@/utils/pb";
import AsyncStorage from "@react-native-async-storage/async-storage";

function dataURLtoFile(dataurl: string, filename: string) {
  if (Platform.OS === "web") {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  return null;
}

function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = React.useRef<CameraView>(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  useEffect(() => {
    async function sam() {
      const res = await AsyncStorage.getItem("id");
      if (res) {
        setId(res);
      }
    }
    sam();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted && Platform.OS !== "web") {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePhoto() {
    setLoading(true);
    try {
      const photoResult = await cameraRef.current?.takePictureAsync();

      const imageUri = photoResult?.uri;

      const data = new FormData();
      if (imageUri) {
        data.append("photos", {
          uri: imageUri || "",
          type: `image/*`,
          name: imageUri?.split("/").pop(),
        } as any);

        if (Platform.OS !== "web") {
          const res = await pb.collection("photos").update(id, data);
        } else {
          const file = dataURLtoFile(
            photoResult.base64 || "",
            imageUri?.split("/").pop() || "",
          );
          const res = await pb.collection("photos").update(id, {
            photos: file,
          });
        }
      }

      setLoading(false);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/home");
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  return (
    <CameraView
      className="flex-1 mx-auto w-full"
      facing={facing}
      ref={cameraRef}
      type={facing}
    >
      {loading && (
        <View className="flex-1 absolute top-0 left-0 bottom-0 right-0 w-full h-full bg-slate-800 opacity-90 z-10 items-center justify-center">
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <SafeAreaView className="flex-1 items-center justify-end ">
        <Pressable
          onPress={() => {
            takePhoto();
          }}
          className="rounded-full bg-white relative mb-8 borded-2 border-black"
        >
          <CameraIcon className="w-24   aspect-square mx-auto " />
        </Pressable>
        <Pressable
          className={"bg-orange-400 px-4 py-2 rounded-md "}
          onPress={toggleCameraFacing}
        >
          <Text className="text-white text-sm">
            {facing === "back" ? "Usar camara frontal" : "Usar camara trasera"}
          </Text>
        </Pressable>
      </SafeAreaView>
    </CameraView>
  );
}

export default Camera;
