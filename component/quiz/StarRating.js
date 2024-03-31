import React, { useState, useRef, useEffect, useContext } from 'react';
import { StyleSheet, Image, Text, View, Animated, Alert } from 'react-native';
import { gS } from '../../styles/globalStyles';
import { Score } from '../../page/Quiz3';

const StarRating = ({ data }) => {
    console.log("vivekkkkk")
    // States
    const [size] = useState(new Animated.Value(5))
    const [fadeAnim] = useState(new Animated.Value(0));
    const [star, setStar] = useState([]);
    let scoreVal = useContext(Score);
    let starVal = scoreVal().star();

    // let star = [];
    useEffect(() => {
        for (let i = 1; i <= 3; i++) {
            let margin = 6;
            let delay = i === 1 ? 0 : i === 2 ? 300 : 400;
            if (i > starVal) {
                setTimeout(() => {
                    setStar((preStar) => [...preStar, <Animated.Image source={require('../../src/img/blankStarYello.png')} key={i} style={{ opacity: fadeAnim, resizeMode: 'center', width: size, height: size, marginRight: 5, marginBottom: i === 1 || i === 3 ? margin : 0 }} />])
                }, delay);
            } else {
                setTimeout(() => {
                    setStar((preStar) => [...preStar, <Animated.Image source={require('../../src/img/fullStarYello.png')} key={i} style={{ opacity: fadeAnim, resizeMode: 'center', width: size, height: size, marginRight: 5, marginBottom: i === 1 || i === 3 ? margin : 0 }} />])
                }, delay);
            }
        }
    }, [])

    useEffect(() => {
        const timing = Animated.timing;
        Animated.sequence([
            timing(
                fadeAnim,
                {
                    toValue: 1,
                    useNativeDriver: false,
                    duration: 500,
                }
            ),
            timing(
                size,
                {
                    toValue: 45,
                    useNativeDriver: false,
                    duration: 500
                },
            ),
            timing(
                size,
                {
                    toValue: 30,
                    useNativeDriver: false,
                    duration: 500
                },
            )
        ]).start()
    }, [])
    let margin = 6;
    return (
        <>
            <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: 45 }}>
                {star}
            </View>
            <Text style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: 20, color: "#8c8c8c" }}>{starVal === 3 ? "Exelent" : starVal === 2 ? "Good" : "Bad!"}</Text>
        </>
    );
}

const styles = StyleSheet.create({

});

export default StarRating;