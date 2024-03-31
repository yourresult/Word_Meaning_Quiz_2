import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Text, View, Alert, StatusBar, Image, Dimensions } from 'react-native';
import { getData, storeData } from '../globalFunctions';
import { useNavigation } from '@react-navigation/native';
import category from "../category.json";
let respJson;

const LabelBox = ({ data, id, nav, navigation }) => {
    return (
        <TouchableOpacity style={styles.box} onPress={() => onPressQuizBox(navigation, data, id, data.nav)}>
            <Image source={require('../src/img/quizBoy.png')} style={{ flexDirection: 'row', resizeMode: 'center', width: "50%", height: "50%" }} />
            <Text style={styles.box.index}>{data.title}</Text>
        </TouchableOpacity>
    )
}
const onPressQuizBox = (navigation, data, id, nav) => {
    navigation.navigate('CategoryList', { data: data, id: id, nav: nav })
}
let getQuizList = async () => {
    // let resp = await fetch('https://raw.githubusercontent.com/yourresult/public/main/wordMeanings');

    if (!respJson) {
        let resp = await fetch('https://gitlab.com/funlife8409/public/-/raw/main/wordMeaning');
        respJson = await resp.json();
    }
    await getData("wordQuiz").then(d => {
        respJson = respJson.map((v, i) => {
            if (d) {
                if (d[i]) {
                    v['score'] = d[i]['score'] ? d[i]['score'] : null;
                    v['star'] = d[i]['star'] ? d[i]['star'] : null;
                } else {
                    v['score'] = null;
                    v['star'] = null;
                }
            } else {
                v['score'] = null;
                v['star'] = null;
            }
            return v;
        })
    });
    return respJson;
}
export default function App({ navigation }) {
    return (
        <ScrollView style={{ backgroundColor: '#ddd' }}>
                <View style={styles.container} >
                    <StatusBar backgroundColor='#ddd' />
                    <LabelBox navigation={navigation} data={{title: "Hindi - English", category, nav: "hinToeng"}}/>
                    <LabelBox navigation={navigation} data={{title: "English - Hindi", category, nav: "engTohin"}}/>
                    <LabelBox navigation={navigation} data={{title: "English - Hindi Learning", category}}/>
                    <LabelBox navigation={navigation} data={{title: "English - Hindi Learning", category}}/>
                </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#ddd',
        justifyContent: 'center',
        marginTop: 40
    },
    box: {
        width: 140 * Dimensions.get('window').width / 375,
        height: 140 * Dimensions.get('window').width / 375,
        marginTop: 7,
        marginHorizontal: 5,
        marginVertical: 5,
        backgroundColor: '#fff',
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        paddingBottom: 2,
        borderRadius: 5,
        index: {
            fontSize: 15 * Dimensions.get('window').width / 375,
            textAlign: "center",
            marginTop: 15,
            marginBottom: 15
        }
    },
});