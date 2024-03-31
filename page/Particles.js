import React from 'react';
import { StyleSheet, StatusBar, Dimensions, Text, Image, View, TouchableOpacity, ActivityIndicator, Vibration, Animated, Alert } from 'react-native';
import Confetti from 'react-confetti';

const Particles = () => {
  return (
    <div>
      {/* Other components and content */}
      <Confetti
        width={800} // Specify the width of the confetti container
        height={600} // Specify the height of the confetti container
      />
    </div>
  );
};

export default Particles;
