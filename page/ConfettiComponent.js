import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const ConfettiCannonComponent = ({star}, ref) => {
    // const [star, setStar] = useState(3);
    console.log("Rerendered")
    const cannonRef = useRef(null);
    const cannonRef2 = useRef(null);
    const cannonRef3 = useRef(null);
    let width = Dimensions.get("window").width;
    let height = Dimensions.get("window").height;
    let redColors = [ "#FF0000"];
    useImperativeHandle(ref, ()=> ({
        start,
        stop
    }))
    
    const start = (star) => {
        // console.log("start", star)
        // setStar(star)
        cannonRef.current.start();
        // cannonRef2.current.start();
        // cannonRef3.current.start();
        // setTimeout(() => {
        //     cannonRef.current.stop();
        //     cannonRef2.current.stop();
        //     cannonRef3.current.stop();
            
        // }, 1000);
    };
    const stop = () => {
        cannonRef.current.stop();
        cannonRef2.current.stop();
        // cannonRef3.current.start();
        // setTimeout(() => {
        //     cannonRef.current.stop();
        //     cannonRef2.current.stop();
        //     cannonRef3.current.stop();
            
        // }, 1000);
    };

    return (
        <View style={{...styles.container, display: star!==null ? "flex" : "none"}}>
            <ConfettiCannon ref={cannonRef} count={10} explosionSpeed={1200} fallSpeed={2000} origin={{ x: width/2, y: height/2 }} colors={star < 2 ? redColors : [ '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722' ]} fadeOut={true} autoStart={true} />
            {/* <ConfettiCannon ref={cannonRef2} count={10} explosionSpeed={1200} fallSpeed={2000} origin={{ x: -width, y: height/2 }} colors={star < 2 ? redColors : [ '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722' ]} fadeOut={true} autoStart={false} /> */}
            <ConfettiCannon ref={cannonRef3} count={10} explosionSpeed={2000} fallSpeed={2250} origin={{ x: width, y: height/2 }} colors={star < 2 ? redColors : [ '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722' ]} fadeOut={true} autoStart={true} />
            <ConfettiCannon ref={cannonRef3} count={10} explosionSpeed={2000} fallSpeed={2250} origin={{ x: -width, y: height/2 }} colors={star < 2 ? redColors : [ '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722' ]} fadeOut={true} autoStart={true} />

            {/* <TouchableOpacity
                style={styles.button}
                onPress={handleFireConfetti}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>Fire Confetti!</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#fff",
        display: "none"
    },
    button: {
        backgroundColor: '#e91e63',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default React.memo(forwardRef(ConfettiCannonComponent));
