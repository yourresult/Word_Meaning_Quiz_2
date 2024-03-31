import React, { useState, useEffect } from 'react'
import { StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Text, View, Alert, StatusBar, Image, Dimensions } from 'react-native';
import { getData, storeData } from '../globalFunctions';
import { gS } from '../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
let respJson;

const LabelBox = ({ data, nav, id, navigation }) => {
    return (
        // <TouchableOpacity style={{...styles.box, ...styles.shadow}} onPress={() => onPressQuizBox(navigation, data, id)}>
        //     <View style={styles.textContainer}>
        //         <Text style={styles.box.index}>{`${data[id]['title']}  -`}</Text>
        //         <Text style={styles.box.span}>24/{data[id]['questionIds'].length}</Text>
        //     </View>
        // </TouchableOpacity>
        <TouchableOpacity style={{...styles.box, ...styles.shadow}} onPress={() => onPressQuizBox(navigation, data[id], id, nav)}>
        <View style={styles.textContainer}>
            <Text style={styles.box.index}>{`${data[id]['title']}   `}<Text style={styles.box.span}>24/{data[id]['questionIds'].length}</Text></Text>
            <Text style={{...styles.box.span, marginRight: 10}}><FontAwesome5 name={"arrow-right"} style={{ color: gS.primaryColor, fontSize: 15 }} /></Text>
        </View>
    </TouchableOpacity>
    )
}
const onPressQuizBox = (navigation, data, id, nav) => {
    
    navigation.navigate('ListQuiz2', { data: data, id: id, nav })
}
let getQuizList = async () => {
    // let resp = await fetch('https://raw.githubusercontent.com/yourresult/public/main/wordMeanings');

    if (!respJson) {
        let resp = await fetch('https://gitlab.com/funlife8409/public/-/raw/main/category.json');
        respJson = await resp.json();
    }
    // await getData("wordQuiz").then(d => {
    //     respJson = respJson.map((v, i) => {
    //         if (d) {
    //             if (d[i]) {
    //                 v['score'] = d[i]['score'] ? d[i]['score'] : null;
    //                 v['star'] = d[i]['star'] ? d[i]['star'] : null;
    //             } else {
    //                 v['score'] = null;
    //                 v['star'] = null;
    //             }
    //         } else {
    //             v['score'] = null;
    //             v['star'] = null;
    //         }
    //         return v;
    //     })
    // });
    return respJson;
}
export default function App({route, navigation }) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState();
    const { nav } = route.params;
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
                    {data ? data.map((v, i) => <LabelBox data={data} id={i} key={i} nav={nav} navigation={navigation} />) : ""}
                </View>
                :
                <ActivityIndicator size="large" color="#00ff00" />
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: '#ddd',
        alignItems: "center",
        paddingBottom: 10,
        // justifyContent: 'center',
        marginTop: 20
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    box: {
        width: "88%",
        height: "auto",
        marginTop: 7,
        // marginHorizontal: 3,
        backgroundColor: '#fff',
        elevation: 2,
        padding: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        span: {
            fontSize: 10,
            textAlign: "right",
            display: "flex",
            lineHeight: 24

        },
        index: {
            fontSize: 15 * Dimensions.get('window').width / 375,
            textAlign: "left",
            lineHeight: 24
        }
    },
});