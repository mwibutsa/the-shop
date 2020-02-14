import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  FlatList,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/colors";
import CartItem from "../../components/shop/CartItem";
import * as cartActions from "../../store/actions/cart";
import * as orderActions from "../../store/actions/orders";
import Card from "../../components/UI/Card";
const CartScreen = props => {
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const cartItems = useSelector(state => {
    const transformedCartItems = [];

    for (let key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        sum: state.cart.items[key].sum,
        quantity: state.cart.items[key].quantity
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productTitle > b.productTitle ? 1 : -1
    );
  });

  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(orderActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total: $
          <Text style={styles.amount}>
            {Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primaryColor} />
        ) : (
          <Button
            color={Colors.accentColor}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item, index) => item.productId}
        renderItem={({ item }) => (
          <CartItem
            deletable
            quantity={item.quantity}
            title={item.productTitle}
            amount={item.sum}
            price={item.productPrice}
            onRemove={() => {
              dispatch(cartActions.removeFromCart(item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "white"
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18
  },
  amount: {
    color: Colors.primaryColor
  }
});

CartScreen.navigationOptions = {
  headerTitle: "Your Cart"
};
export default CartScreen;
