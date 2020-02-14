import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { FlatList, Button, Alert } from "react-native";
import ProductItem from "../../components/shop/ProductItem";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/colors";
import * as productsActions from "../../store/actions/products";

const UserProductsScreen = props => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  const editProductHandler = id => {
    props.navigation.navigate({
      routeName: "EditProduct",
      params: {
        productId: id
      }
    });
  };

  const deleteHandler = id => {
    Alert.alert("Are you sure", "Do you really want to delete this Item?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(productsActions.deleteProduct(id));
        }
      }
    ]);
  };

  return (
    <FlatList
      data={userProducts}
      renderItem={({ item }) => (
        <ProductItem
          image={item.imageUrl}
          title={item.title}
          price={item.price}
          onSelect={() => editProductHandler(item.id)}
        >
          <Button
            color={Colors.primaryColor}
            title="Edit"
            onPress={() => editProductHandler(item.id)}
          />
          <Button
            color={Colors.primaryColor}
            title="Delete"
            onPress={() => deleteHandler(item.id)}
          />
        </ProductItem>
      )}
      keyExtractor={(item, id) => item.id}
    />
  );
};

UserProductsScreen.navigationOptions = navData => ({
  headerTitle: "User Products",
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="Menu"
        iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
        iconSize={23}
        onPress={() => {
          navData.navigation.toggleDrawer();
        }}
      ></Item>
    </HeaderButtons>
  ),
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="Add Product"
        iconName={Platform.OS === "android" ? "md-add" : "ios-add"}
        iconSize={23}
        onPress={() => {
          navData.navigation.navigate("EditProduct");
        }}
      ></Item>
    </HeaderButtons>
  )
});

export default UserProductsScreen;
