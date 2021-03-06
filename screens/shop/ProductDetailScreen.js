import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import colors from "../../constants/colors";
import * as cartActions from "../../store/actions/cart";
const ProductDetailScreen = props => {
  const productId = props.route.params.productId
    ? props.route.params.productId
    : null;

  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  );

  const dispatch = useDispatch();
  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: selectedProduct.title
    });
  }, [selectedProduct]);

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={colors.primaryColor}
          title="To Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "open-sans-bold"
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
    fontFamily: "open-sans"
  },
  actions: {
    marginVertical: 10,
    alignItems: "center"
  }
});

export const productDetailScreenOptions = navData => {
  return {
    headerTitle: navData.route.params.productTitle
  };
};
export default ProductDetailScreen;
