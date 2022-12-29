import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { colors, network } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import ProgressDialog from "react-native-progress-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WishList from "../../components/WishList/WishList";

const MyWishlistScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [isloading, setIsloading] = useState(false);
  const [label, setLabel] = useState("Please wait...");
  const [refeshing, setRefreshing] = useState(false);
  const [alertType, setAlertType] = useState("error");
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [onWishlist, setOnWishlist] = useState(true);

  const handleView = (product) => {
    navigation.navigate("productdetail", { product: product });
  };

  const logout = async () => {
    await AsyncStorage.removeItem("authUser");
    navigation.replace("login");
  };

  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchWishlist();
    setRefreshing(false);
  };

  const fetchWishlist = async () => {
    const value = await AsyncStorage.getItem("authUser");
    let user = JSON.parse(value);
    var myHeaders = new Headers();
    myHeaders.append("x-auth-token", user.token);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    setIsloading(true);
    fetch(`${network.serverip}/wishlist/${user._id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.err === "jwt expired") {
          logout();
        }
        if (result.success) {
          setWishlist(result.data.wishlist);
          setError("");
        }
        console.log('first', result)
        setIsloading(false);
      })
      .catch((error) => {
        setIsloading(false);
        setError(error.message);
        console.log("error", error);
      });
  };

  const handleRemoveFromWishlist = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("x-auth-token", user.token);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`${network.serverip}/remove-from-wishlist/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setError(result.message);
          setAlertType("success");
        } else {
          setError(result.message);
          setAlertType("error");
        }
        setOnWishlist(!onWishlist);
      })
      .catch((error) => {
        setError(result.message);
        setAlertType("error");
        console.log("error", error);
      });
  };

  useEffect(() => {
    setError("");
    fetchWishlist();
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [onWishlist]);

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <ProgressDialog visible={isloading} label={label} />
      <View style={styles.topBarContainer}>
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
        <View></View>
        <TouchableOpacity onPress={() => handleOnRefresh()}>
          <Ionicons name="heart-outline" size={30} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.screenNameContainer}>
        <View>
          <Text style={styles.screenNameText}>Sản phẩm yêu thích</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>
            Xem, thêm hoặc xóa sản phẩm khỏi danh sách yêu thích để mua sau
          </Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      {wishlist.length == 0 ? (
        <View style={styles.ListContiainerEmpty}>
          <Text style={styles.secondaryTextSmItalic}>
            "Chưa có sản phẩm nào trong danh sách yêu thích."
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, width: "100%", padding: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refeshing}
              onRefresh={handleOnRefresh}
            />
          }
        >
          {wishlist.map((list, index) => {
            return (
              <WishList
                image={list?.productId?.image}
                title={list?.productId?.title}
                description={list?.productId?.description}
                key={index}
                onPressView={() => handleView(list?.productId)}
                onPressRemove={() =>
                  handleRemoveFromWishlist(list?.productId?._id)
                }
              />
            );
          })}
          <View style={styles.emptyView}></View>
        </ScrollView>
      )}
    </View>
  );
};

export default MyWishlistScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  screenNameContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  screenNameText: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.muted,
  },
  screenNameParagraph: {
    marginTop: 5,
    fontSize: 15,
  },
  bodyContainer: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
  emptyView: {
    height: 20,
  },
  ListContiainerEmpty: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  secondaryTextSmItalic: {
    fontStyle: "italic",
    fontSize: 15,
    color: colors.muted,
  },
});
