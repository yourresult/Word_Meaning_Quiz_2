import { LogBox } from 'react-native';
import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { useTransition, useSpring, animated } from '@react-spring/native'
import { Score } from '../../page/Quiz3';
LogBox.ignoreLogs(['Require cycle:']);

//? **__Libiries__**

import { gS } from '../../styles/globalStyles';

function TotalScore() {
    const [flip, set] = useState(false)
    let scoreVal = useContext(Score);
    console.log(scoreVal, "vivekscoreBal")
    const { number } = useSpring({
        reset: true,
        reverse: flip,
        from: { number: 0 },
        number: scoreVal().score,
        delay: 200,
        config: { mass: 1, tension: 280, friction: 120 },
        // onRest: () => set(!flip),
    })
    const AnimatedText = animated(Text)
    return <AnimatedText style={{ position: "absolute", fontWeight: "bold", fontSize: 25, marginTop: 65, color: gS.primaryColor }}>{number.to(n => n.toFixed(0))}</AnimatedText>
}

export default TotalScore;