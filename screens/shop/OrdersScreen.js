import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  Text
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import * as orderActions from "../../store/actions/orders";
import OrderItem from "../../components/shop/OrderItem";
import Colors from "../../constants/colors";

const OrdersScreen = props => {
  const orders = useSelector(state => state.orders.orders);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      await dispatch(orderActions.fetchOrders());
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [dispatch]);
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Orders found for you! Maybe start adding some!</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={orders}
      keyExtractor={(item, index) => item.id}
      renderItem={({ item }) => (
        <OrderItem
          amount={item.totalAmount}
          date={item.readabledate}
          items={item.items}
        />
      )}
    />
  );
};

export const orderScreenOptions = navData => ({
  headerTitle: "Your Orders",
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
  )
});

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
export default OrdersScreen;
