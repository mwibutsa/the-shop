import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import CartItem from "./CartItem";
import Colors from "../../constants/colors";
import Card from "../UI/Card";

const OrderItem = props => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.amount}>${props.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>

      <Button
        color={Colors.primaryColor}
        title={showDetails ? "Hide Details" : "Show Details"}
        onPress={() => setShowDetails(prevState => !prevState)}
      />

      {showDetails && (
        <View style={styles.detailItems}>
          {props.items.map(cartItem => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              amount={cartItem.sum}
              title={cartItem.productTitle}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    backgroundColor: "white",
    margin: 20,
    padding: 10,
    alignItems: "center"
  },

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15
  },
  amount: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
    color: "#888"
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: "#888"
  },
  detailItems: {
    width: "100%"
  }
});

export default OrderItem;