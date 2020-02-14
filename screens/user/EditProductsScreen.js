import React, { useEffect, useCallback, useReducer, useState } from "react";
import Input from "../../components/UI/Input";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import * as productsActions from "../../store/actions/products";
import Colors from "../../constants/colors";

const FORM_INPUT_UPDATE = "UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };

    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };

    let updatedFormIsValid = true;

    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
      ...state,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
      formIsValid: updatedFormIsValid
    };
  }

  return state;
};

const EditProductScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const routeParams = props.route.params ? props.route.params : {};
  const prodId = routeParams.productId;

  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: ""
    },
    inputValidities: {
      title: !!editedProduct,
      imageUrl: !!editedProduct,
      description: !!editedProduct,
      price: !!editedProduct
    },
    formIsValid: !!editedProduct
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    const { title, price, description, imageUrl } = formState.inputValues;
    const { formIsValid } = formState;

    if (!formIsValid) {
      Alert.alert(
        "You must be kidding!",
        "Please check the erros in the form.",
        [
          {
            text: "Okay"
          }
        ]
      );
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      if (editedProduct) {
        await dispatch(
          productsActions.updateProduct(prodId, title, description, imageUrl)
        );
      } else {
        await dispatch(
          productsActions.createProduct(title, description, imageUrl, +price)
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, [dispatch, formState]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="save"
            iconName={
              Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
            }
            iconSize={23}
            onPress={submitHandler}
          ></Item>
        </HeaderButtons>
      )
    });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            keyboardType="default"
            errorText="Please enter a valid title"
            initialValue={editedProduct ? editedProduct.title : ""}
            initiallyValid={!!editedProduct}
            required
            onInputChange={inputChangeHandler}
          />

          <Input
            id="imageUrl"
            label="Image url"
            returnKeyType="next"
            keyboardType="default"
            errorText="Please enter a valid imageUrl"
            initialValue={editedProduct ? editedProduct.imageUrl : ""}
            initiallyValid={!!editedProduct}
            required
            onInputChange={inputChangeHandler}
          />

          {editedProduct ? null : (
            <Input
              id="price"
              label="Price"
              returnKeyType="next"
              keyboardType="decimal-pad"
              errorText="Please enter a valid price"
              required
              onInputChange={inputChangeHandler}
              min={0.1}
            />
          )}

          <Input
            id="description"
            label="Description"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            keyboardType="decimal-pad"
            errorText="Please enter a valid description"
            initialValue={editedProduct ? editedProduct.description : ""}
            onInputChange={inputChangeHandler}
            initiallyValid={!!editedProduct}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export const editProductScreenOptions = navData => {
  const routeParams = navData.route.params ? navData.route.params : {};

  return {
    headerTitle: routeParams.productId ? "Edit Product" : "Add Product"
  };
};

export default EditProductScreen;
