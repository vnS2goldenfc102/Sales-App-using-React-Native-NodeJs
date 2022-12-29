import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  StatusBar,
  Text,
  FlatList,
  RefreshControl,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";
import cartIcon from "../../assets/icons/cart_beg.png";
import emptyBox from "../../assets/image/emptybox.png";
import { colors, network } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import ProductCard from "../../components/ProductCard/ProductCard";
import CustomInput from "../../components/CustomInput";

const CategoriesScreen = ({ navigation, route }) => {
  const { categoryID } = route.params;

  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [label, setLabel] = useState("Loading...");
  const [error, setError] = useState("");
  const [foundItems, setFoundItems] = useState([]);
  const [filterItem, setFilterItem] = useState("");

  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const windowHeight = Dimensions.get("window").height;

  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { addCartItem } = bindActionCreators(actionCreaters, dispatch);
  const handleProductPress = (product) => {
    navigation.navigate("productdetail", { product: product });
  };

  const handleAddToCat = (product) => {
    addCartItem(product);
  };

  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchProduct();
    setRefreshing(false);
  };

  const category = [
    {
      _id: "62fe244f58f7aa8230817f89",
      title: "Nhẫn",
      image: require("../../assets/icons/ring-removebg-preview.png"),
    },
    {
      _id: "62fe243858f7aa8230817f86",
      title: "Bông tai",
      image: require("../../assets/icons/earning-removebg-preview.png"),
    },
    {
      _id: "63a27aa596f7b743b0ebbe2b",
      title: "Lắc - Vòng",
      image: require("../../assets/icons/bangless-removebg-preview.png"),
    },
    {
      _id: "62fe246858f7aa8230817f8c",
      title: "Dây chuyền",
      image: require("../../assets/icons/necklace-removebg-preview.png"),
    },
  ];
  const [selectedTab, setSelectedTab] = useState(category[0]);

  const fetchProduct = () => {
    var headerOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`${network.serverip}/products`, headerOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setProducts(result.data);
          setFoundItems(result.data);
          setError("");
        } else {
          setError(result.message);
        }
      })
      .catch((error) => {
        setError(error.message);
        console.log("error", error);
      });
  };

  navigation.addListener("focus", () => {
    if (categoryID) {
      setSelectedTab(categoryID);
    }
  });

  const filter = () => {
    const keyword = filterItem;
    if (keyword !== "") {
      const results = products.filter((product) => {
        return product?.title.toLowerCase().includes(keyword.toLowerCase());
      });

      setFoundItems(results);
    } else {
      setFoundItems(products);
    }
  };

  useEffect(() => {
    filter();
  }, [filterItem]);

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.topBarContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.jumpTo("home");
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={30}
            color={colors.muted}
          />
        </TouchableOpacity>

        <View></View>
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate("cart")}
        >
          {cartproduct?.length > 0 ? (
            <View style={styles.cartItemCountContainer}>
              <Text style={styles.cartItemCountText}>{cartproduct.length}</Text>
            </View>
          ) : (
            <></>
          )}
          <Image source={cartIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View style={{ padding: 0, paddingLeft: 20, paddingRight: 20 }}>
          <CustomInput
            radius={5}
            placeholder={"Tìm kiếm..."}
            value={filterItem}
            setValue={setFilterItem}
          />
        </View>
        <FlatList
          data={category}
          keyExtractor={(index, item) => `${index}-${item}`}
          horizontal
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ padding: 10 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: tab }) => (
            <CustomIconButton
              key={tab}
              text={tab.title}
              image={tab.image}
              active={selectedTab?.title === tab.title ? true : false}
              onPress={() => {
                setSelectedTab(tab);
              }}
            />
          )}
        />

        {foundItems.filter(
          (product) => product?.category === selectedTab?._id
        ).length === 0 ? (
          <View style={styles.noItemContainer}>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.white,
                height: 150,
                width: 150,
                borderRadius: 10,
              }}
            >
              <Image
                source={emptyBox}
                style={{ height: 80, width: 80, resizeMode: "contain" }}
              />
              <Text style={styles.emptyBoxText}>
                Không có sản phẩm nào trong danh mục này
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={foundItems.filter(
              (product) => product?.category === selectedTab?._id
            )}
            refreshControl={
              <RefreshControl
                refreshing={refeshing}
                onRefresh={handleOnRefresh}
              />
            }
            keyExtractor={(index, item) => `${index}-${item}`}
            contentContainerStyle={{ margin: 10 }}
            numColumns={2}
            renderItem={({ item: product }) => (
              <View
                style={[
                  styles.productCartContainer,
                  { width: (windowWidth - windowWidth * 0.1) / 2 },
                ]}
              >
                <ProductCard
                  cardSize={"large"}
                  name={product.title}
                  image={product.image}
                  price={product.price}
                  quantity={product.quantity}
                  onPress={() => handleProductPress(product)}
                  onPressSecondary={() => handleAddToCat(product)}
                />
                <View style={styles.emptyView}></View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default CategoriesScreen;

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
  bodyContainer: {
    flex: 1,
    width: "100%",
    flexDirecion: "row",
    backgroundColor: colors.light,

    justifyContent: "flex-start",
    flex: 1,
  },
  cartIconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cartItemCountContainer: {
    position: "absolute",
    zIndex: 10,
    top: -10,
    left: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 22,
    width: 22,
    backgroundColor: colors.danger,
    borderRadius: 11,
  },
  cartItemCountText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 10,
  },
  productCartContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
    padding: 5,
    paddingBottom: 0,
    paddingTop: 0,
    marginBottom: 0,
  },
  noItemContainer: {
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  emptyBoxText: {
    fontSize: 11,
    color: colors.muted,
    textAlign: "center",
  },
  emptyView: {
    height: 20,
  },
});
