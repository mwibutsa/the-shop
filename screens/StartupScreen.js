import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import Colors from "../constants/colors";

const StartupScreen = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (!userData) {
          dispatch(authActions.setDidTryAL());
          return;
        }
        const transformedData = JSON.parse(userData);
        const { token, userId, expiryDate } = transformedData;

        const expirationDate = new Date(expiryDate);

        if (expirationDate <= new Date() || !token || !userId) {
          dispatch(authActions.setDidTryAL());
          return;
        }

        const expirationTime = expirationDate.getTime() - new Date().getTime();

        dispatch(authActions.authenticate(userId, token, +expirationDate));
      } catch (err) {
        throw err;
      }
    };
    tryLogin();
  }, [dispatch]);
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primaryColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
export default StartupScreen;
