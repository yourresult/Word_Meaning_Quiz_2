import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Text, View, Alert, StatusBar, Image } from 'react-native';
import { getData, storeData } from '../globalFunctions';
import { useNavigation } from '@react-navigation/native';
let respJson;

const LabelBox = ({ data, id, navigation }) => {
    let starVal = id < data.length ? data[id]['star'] : "";
    let score = id < data.length ? data[id]['score'] : "";
    let prevScore;
    if (!score) {
        if (id === 0) {
            prevScore = true;
        }else {
            let prScore = id-1 < data.length ? data[id-1]['score'] : "";
            prevScore = prScore ? true : false;
            starVal = 0
            score = 0;
        }
    }
    console.log(prevScore, "prevScore")
    let star = [];
    for (let i = 1; i <= 3; i++) {
        let margin = 6;
        if (i > starVal) {
            star.push(<Image source={require('../src/img/blankStar.png')} key={i} style={{ resizeMode: 'center', width: 20, height: 20, marginRight: 5, marginBottom: i === 1 || i === 3 ? margin : 0 }} />)
        } else {
            star.push(<Image source={require('../src/img/fullStar.png')} key={i} style={{ resizeMode: 'center', width: 20, height: 20, marginRight: 5, marginBottom: i === 1 || i === 3 ? margin : 0 }} />)
        }
    }
    let lockEle = <>
        <Text style={styles.box.score}>{score ? score < 0 ? 0 : score : 0}</Text>
        <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: 9 }}>
            {star}
        </View>
    </>
    let unlockEle = <>
        <View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: 'auto', marginBottom: 9 }}>
            <Image source={require('../src/img/padlock.png')} style={{ resizeMode: 'center', width: 25, height: 25, marginRight: 5, marginBottom: 5 }} />
        </View>
    </>
    return (
        <TouchableOpacity style={styles.box} onPress={() => onPressQuizBox(navigation, score || prevScore ? true : false, data, id)}>
            <Text style={styles.box.index}>-{id + 1}-</Text>
            {score ? lockEle : prevScore ? lockEle : unlockEle}
        </TouchableOpacity>
    )
}
const onPressQuizBox = (navigation, navigate = true || false, data, id) => {
    navigate ? navigation.navigate('Quiz', { data: data, id: id }) : ''
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
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();
    const nav = useNavigation();
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getQuizList().then(d => {
                setData(d);
                setIsLoading(false);
            });
        });
        return unsubscribe;
    }, [])
    return (
        <ScrollView style={{ backgroundColor: '#ddd' }}>
            {!isLoading ?
                <View style={styles.container} >
                    <StatusBar backgroundColor='#ddd' />
                    {data ? data.map((v, i) => <LabelBox data={data} id={i} key={i} navigation={navigation} />) : ""}
                </View>
                : <ActivityIndicator size="large" color="#00ff00" />}
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
        marginTop: 20
    },
    box: {
        width: "30%",
        height: 130,
        marginTop: 7,
        marginHorizontal: 3,
        backgroundColor: '#fff',
        elevation: 2,
        alignItems: 'center',
        padding: 8,
        paddingBottom: 2,
        borderRadius: 5,
        index: {
            fontSize: 20
        },
        score: {
            fontSize: 22,
            marginTop: 10
        }
    },
});