import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Text, View, Alert, StatusBar, Image } from 'react-native';
import { getData, storeData } from '../globalFunctions';
import { useNavigation } from '@react-navigation/native';
let respJson;

const LabelBox = ({ data, nav, scoreVal, prevScore, catId, index, navigation }) => {
    
    const [score, starVal] = scoreVal?.[nav][index] || [null, null];
    
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
        <TouchableOpacity style={styles.box} onPress={() => onPressQuizBox(navigation, score || prevScore ? true : false, data, index, catId, nav)}>
            <Text style={styles.box.index}>-{index + 1}-</Text>
            {score ? lockEle : prevScore ? lockEle : unlockEle}
        </TouchableOpacity>
    )
}
const onPressQuizBox = (navigation, navigate = true || false, data, index, catId, nav) => {
    navigate ? navigation.navigate('Quiz2', { data: data, index: index, catId, nav }) : ''
}

export default function App({ route, navigation }) {
    const [isLoading, setIsLoading] = useState(true);
    const [score, setScore] = useState({"engTohin": [[]], "hinToeng": [[]]});
    const { data, nav } = route.params;
    
    useEffect(() => {
        async function getScore() {
            await getData("quizScore").then(async d => {
                if (typeof(d?.[data.id]) === "undefined") {
                    console.log("test1", d)
                    d[data.id] = {"engTohin": [[null, null]], "hinToeng": [[null, null]]};
                    console.log("test2", d)
                    await storeData("quizScore", d);
                    await setScore(d?.[data.id])
                }else {
                    await setScore(d?.[data.id])
                }
            })
            return;
        }

        const unsubscribe = navigation.addListener('focus', () => {
            getScore().then(d => {
                setIsLoading(false);
            });
        });
        return unsubscribe;
    }, [])
    
    function prevScore(index) {
        if (index === 0) {
            return true;
        }else {
            if (index === 1 && score?.[nav][index-1][0] === null) {
                return false;
            }else if (score?.[nav][index-1]) {
                return true;
            }else {
                return false;
            }
        }
    }
    return (
        <ScrollView style={{ backgroundColor: '#ddd' }}>
            {!isLoading ?
                <View style={styles.container} >
                    <StatusBar backgroundColor='#ddd' />
                    {data.questionIds ? data.questionIds.map((v, i) => <LabelBox data={data.questionIds} nav={nav} prevScore={prevScore(i)} scoreVal={score} catId={data.id} index={i} key={i} navigation={navigation} />) : ""}
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