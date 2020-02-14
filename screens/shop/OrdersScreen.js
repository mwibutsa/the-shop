import React from "react";
import { useSelector } from "react-redux";
import { FlatList, Platform, Text } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";

const OrdersScreen = props => {
  const orders = useSelector(state => state.orders.orders);
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

OrdersScreen.navigationOptions = navData => ({
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

export default OrdersScreen;
