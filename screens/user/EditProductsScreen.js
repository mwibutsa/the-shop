import React, { useEffect, useCallback, useReducer } from "react";
import Input from "../../components/UI/Input";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView
} from "react-native";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import * as productsActions from "../../store/actions/products";

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
  const prodId = props.navigation.getParam("productId");

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

  const submitHandler = useCallback(() => {
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
    if (editedProduct) {
      dispatch(
        productsActions.updateProduct(prodId, title, description, imageUrl)
      );
    } else {
      dispatch(
        productsActions.createProduct(title, description, imageUrl, +price)
      );
    }

    props.navigation.goBack();
  }, [dispatch, formState]);

  useEffect(() => {
    props.navigation.setParams({
      submit: submitHandler
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
  }
});

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",

    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          iconSize={23}
          onPress={submitFn}
        ></Item>
      </HeaderButtons>
    )
  };
};

export default EditProductScreen;
