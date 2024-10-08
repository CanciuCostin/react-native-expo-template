import { StyleSheet, View, Image } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { router, SplashScreen } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import {
  setProductsAsync,
  setCategoriesAsync,
  setTagsAsync,
} from '@state/productsDataSlice';
import { AppDispatch } from '@state/store';
import { useFonts } from 'expo-font';
import { useDispatch } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import {
  fetchCategories,
  fetchProducts,
  fetchTags,
} from '@service/productService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: '30%',
    alignItems: 'center',
    alignContent: 'space-between',
  },
  lottieImage: {
    width: '40%',
    height: '40%',
    top: '25%',
  },
  appIcon: {
    bottom: '10%',
    width: '100%',
  },
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function SplashAnimation() {
  const [fontsLoaded, fontsError] = useFonts({
    RobotoRegular: require('@assets/fonts/Roboto-Regular.ttf'),
    RobotoBold: require('@assets/fonts/Roboto-Bold.ttf'),
    ...FontAwesome.font,
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const lottieAnimationRef = useRef<LottieView>(null);
  const { colors } = useTheme();

  useEffect(() => {
    // Perform some sort of async data or asset fetching
    if (process.env.EXPO_PUBLIC_BACKEND_URL === undefined) {
      throw new Error('Backend URL is not defined');
    }
    if (process.env.EXPO_PUBLIC_PRODUCTS_ENDPOINT === undefined) {
      throw new Error('Products endpoint is not defined');
    }
    if (process.env.EXPO_PUBLIC_CATEGORIES_ENDPOINT === undefined) {
      throw new Error('Categories endpoint is not defined');
    }
    if (process.env.EXPO_PUBLIC_TAGS_ENDPOINT === undefined) {
      throw new Error('Tags endpoint is not defined');
    }
    setTimeout(() => {
      Promise.all([
        fetchProducts().then((response) =>
          dispatch(setProductsAsync(response)).catch((error) => {
            //Uncomment the line below to see the error in the console
            //console.error('Error fetching products:', error);
            throw new Error(error);
          }),
        ),
        fetchCategories().then((response) =>
          dispatch(setCategoriesAsync(response)),
        ),
        fetchTags().then((response) => dispatch(setTagsAsync(response))),
      ]).then(() => {
        setDataLoaded(true);
      });
    }, 5000);
    // eslint-disable-next-  react-hooks/exhaustive-deps
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);

  useEffect(() => {
    if (fontsLoaded && dataLoaded) {
      SplashScreen.hideAsync()
        .then(() => lottieAnimationRef.current?.play())
        .then(() => {
          setTimeout(() => router.navigate('(tabs)'), 5000);
        });
    }
  }, [fontsLoaded, dataLoaded]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.splashScreenBackground },
      ]}
    >
      <LottieView
        resizeMode="contain"
        ref={lottieAnimationRef}
        style={styles.lottieImage}
        source={require('@assets/animations/splash.json')}
      />
      <Image
        resizeMode="contain"
        source={require('@assets/images/splash.png')}
        style={styles.appIcon}
      />
    </View>
  );
}
