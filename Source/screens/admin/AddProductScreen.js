import {
  StyleSheet,
  Text,
  Image,
  StatusBar,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { colors, network } from "../../constants";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import * as ImagePicker from "expo-image-picker";
import ProgressDialog from "react-native-progress-dialog";
import { AntDesign } from "@expo/vector-icons";
import { useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";

const AddProductScreen = ({ navigation, route }) => {
  const { authUser } = route.params;
  const [isloading, setIsloading] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [user, setUser] = useState({});
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [statusDisable, setStatusDisable] = useState(false);
  const [items, setItems] = useState([
    { label: "Pending", value: "pending" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
  ]);
  var payload = [];

  const getToken = (obj) => {
    try {
      setUser(JSON.parse(obj));
    } catch (e) {
      setUser(obj);
      return obj.token;
    }
    return JSON.parse(obj).token;
  };

  const fetchCategories = () => {
    var myHeaders = new Headers();
    myHeaders.append("x-auth-token", getToken(authUser));

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    setIsloading(true);
    fetch(`${network.serverip}/categories`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setCategories(result.data);
          result.data.forEach((cat) => {
            let obj = {
              label: cat.title,
              value: cat._id,
            };
            payload.push(obj);
          });
          setItems(payload);
          setError("");
        } else {
          setError(result.message);
        }
        setIsloading(false);
      })
      .catch((error) => {
        setIsloading(false);
        setError(error.message);
        console.log("error", error);
      });
  };

  var myHeaders = new Headers();
  myHeaders.append("x-auth-token", authUser.token);
  myHeaders.append("Content-Type", "application/json");

  const upload = async () => {
    console.log("upload-F:", image);

    var formdata = new FormData();
    formdata.append('file', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'my-image'
    });
    console.log(formdata, 'formdata')
    var ImageRequestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    };

    fetch(
      network.serverip + "/upload",
      ImageRequestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };


  var form = JSON.stringify({
    title: title,
    sku: sku,
    price: price,
    image: image.uri,
    description: description,
    category: category,
    quantity: quantity,
  });


  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: form,
    redirect: "follow",
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.cancelled) {
      console.log(result);
      setImage(result);
    }
  };

  const addProductHandle = () => {
    console.log(image)
    console.log(form, 'form')
    // upload();
    setIsloading(true);
    if (title == "") {
      setError("Vui l??ng nh???p ti??u ????? s???n ph???m");
      setIsloading(false);
    } else if (price == 0) {
      setError("Vui l??ng nh???p gi?? c??? s???n ph???m");
      setIsloading(false);
    } else if (quantity <= 0) {
      setError("S??? l?????ng ph???i l???n h??n 1");
      setIsloading(false);
    } else if (image == null) {
      setError("Vui l??ng t???i l??n 1 b???c ???nh");
      setIsloading(false);
    } else {
      fetch(network.serverip + "/product", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.success == true) {
            setIsloading(false);
            setAlertType("success");
            setError(result.message);
          }
        })
        .catch((error) => {
          setIsloading(false);
          setError(error.message);
          setAlertType("error");
          console.log("error", error);
        });
    }
  };

  useEffect(() => {
    fetchCategories();
    console.log(categories);
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar></StatusBar>
      <ProgressDialog visible={isloading} label={"Adding ..."} />
      <View style={styles.TopBarContainer}>
        <TouchableOpacity
          onPress={() => {
            // navigation.replace("viewproduct", { authUser: authUser });
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
        <View>
          <Text style={styles.screenNameText}>Th??m S???n Ph???m</Text>
        </View>
        <View>
          <Text style={styles.screenNameParagraph}>Th??m chi ti???t s???n ph???m</Text>
        </View>
      </View>
      <CustomAlert message={error} type={alertType} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "100%" }}
      >
        <View style={styles.formContainer}>
          <View style={styles.imageContainer}>
            {image ? (
              <TouchableOpacity style={styles.imageHolder} onPress={pickImage}>
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: 200, height: 200 }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.imageHolder} onPress={pickImage}>
                <AntDesign name="pluscircle" size={50} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>

          <CustomInput
            value={sku}
            setValue={setSku}
            placeholder={"SKU"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={title}
            setValue={setTitle}
            placeholder={"Ti??u ?????"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={price}
            setValue={setPrice}
            placeholder={"Gi??"}
            keyboardType={"number-pad"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={quantity}
            setValue={setQuantity}
            placeholder={"S??? l?????ng"}
            keyboardType={"number-pad"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
          <CustomInput
            value={description}
            setValue={setDescription}
            placeholder={"M?? t???"}
            placeholderTextColor={colors.muted}
            radius={5}
          />
        </View>
        
      </ScrollView>
      <DropDownPicker
          placeholder={"Ch???n danh m???c s???n ph???m"}
          open={open}
          value={category}
          items={items}
          setOpen={setOpen}
          setValue={setCategory}
          setItems={setItems}
          disabled={statusDisable}
          disabledStyle={{
            backgroundColor: colors.light,
            borderColor: colors.white,
          }}
          labelStyle={{ color: colors.muted }}
          style={{ borderColor: "#fff", elevation: 5 }}
        />
      <View style={styles.buttomContainer}>
        <CustomButton text={"Th??m s???n ph???m"} onPress={addProductHandle} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    flexDirecion: "row",
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
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
  formContainer: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    width: "100%",
    flexDirecion: "row",
    padding: 5,
  },

  buttomContainer: {
    marginTop: 10,
    width: "100%",
  },
  bottomContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  screenNameContainer: {
    marginTop: 10,
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
  imageContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: 250,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  imageHolder: {
    height: 200,
    width: 200,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    borderRadius: 10,
    elevation: 5,
  },
});
