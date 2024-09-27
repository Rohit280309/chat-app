// components/Spinner.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import PropTypes from 'prop-types';

const Loader = ({ visible, size, color, overlay }: any) => {
  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={visible}
      onRequestClose={() => {}}>
      <View style={styles.container}>
        {overlay && <View style={styles.overlay} />}
        <View style={styles.spinner}>
          <ActivityIndicator size={size} color={color} />
        </View>
      </View>
    </Modal>
  );
};

Loader.propTypes = {
  visible: PropTypes.bool.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  color: PropTypes.string,
  overlay: PropTypes.bool
};

Loader.defaultProps = {
  size: 'large',
  color: '#0000ff',
  overlay: true
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1000
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  spinner: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // for Android
    shadowColor: '#000', // for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }
});

export default Loader;
