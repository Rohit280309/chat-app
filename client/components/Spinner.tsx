import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Spinner = ({ size = 15, color = '#ffffff' }) => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Spinner;
