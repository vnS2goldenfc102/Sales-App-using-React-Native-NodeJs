import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import UserProfileCard from "../../components/UserProfileCard/UserProfileCard";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import OptionList from "../../components/OptionList/OptionList";
import { network } from "../../constants";

const MyAccountScreen = ({ navigation, route }) => {
  const [showBox, setShowBox] = useState(true);
  const { user } = route.params;
  const userID = user["_id"];
  console.log(userID);

  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Bạn có chắc không?",
      "Bạn có chắc chắn muốn xóa tài khoản của mình không?",
      [
        {
          text: "Yes",
          onPress: () => {
            setShowBox(false);
            DeleteAccontHandle(id);
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  const [error, setError] = useState("");
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const DeleteAccontHandle = (userID) => {
    let fetchURL = network.serverip + "/delete-user?id=" + String(userID);
    console.log(fetchURL);
    fetch(fetchURL, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success == true) {
          console.log(result.data);
          navigation.navigate('login');
        } else {
          setError(result.message);
        }
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>
      <View style={styles.TopBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <Text style={styles.screenNameText}>Tài khoản của tôi</Text>
      </View>
      <View style={styles.UserProfileCardContianer}>
        <UserProfileCard
          Icon={Ionicons}
          name={user["name"]}
          email={user["email"]}
        />
      </View>
      <View style={styles.OptionsContainer}>
        <OptionList
          text={"Đổi mật khẩu"}
          Icon={Ionicons}
          iconName={"key-sharp"}
          onPress={() =>
            navigation.navigate("updatepassword", {
              userID: userID,
            })
          }
        />
        <OptionList
          text={"Xoá tài khoản"}
          Icon={MaterialIcons}
          iconName={"delete"}
          type={"danger"}
          // onPress={() => DeleteAccontHandle(userID)}
          onPress={() => showConfirmDialog(userID)}
        />
      </View>
    </View>
  );
};

export default MyAccountScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    flex: 1,
  },
  TopBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  UserProfileCardContianer: {
    width: "100%",
    height: "25%",
  },
  screenNameContainer: {
    marginTop: 10,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  OptionsContainer: {
    width: "100%",
  },
});
