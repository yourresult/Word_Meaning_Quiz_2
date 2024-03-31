import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { useTransition, useSpring, animated } from '@react-spring/native'

//? **__Libiries__**

import { gS } from '../../styles/globalStyles';
import {StarRating, Score} from '../index'

function ScoreResult() {

    return <>
        <Text style={{ width: "60%", height: "60%", borderTopLeftRadius: 150, borderTopRightRadius: 150, borderWidth: 7, borderColor: gS.primaryColor, borderBottomWidth: 0, marginTop: 30 }}></Text>
        <Score />
        <StarRating />
        {/* <Text style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: 20, color: "#8c8c8c" }}>Excelent</Text> */}
    </>
}

export default ScoreResult;