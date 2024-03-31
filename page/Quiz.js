import React, { useState, useRef, useEffect, createContext } from 'react';
import { StyleSheet, StatusBar, Text, Image, View, TouchableOpacity, Vibration, Animated, Alert } from 'react-native';

import { gS } from '../styles/globalStyles';
import ScoreResult from '../component/quiz/ScoreResult';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

//? Variables
var countWrongAns = 0, // -23
    countCorrectAns = 0; // 95
// Number of Wrong Answer

//? Variables End

//? Context 

export const Score = createContext();

//? Context End

//? Custom Function 

const onPressNext = (navigation, data, id, title) => {
    countWrongAns = 0, // Reset Wrong Answer
        countCorrectAns = 0; // Reset Correct Answer
    if (title === "Next") {
        data[id] ? navigation.replace('Quiz', { data: data, id: id + 1 }) : ''
    } else {
        data[id] ? navigation.replace('Quiz', { data: data, id: id }) : ''
    }
}

const calCulateScore = (quesId) => {
    const score = {
        score: (countCorrectAns * 95) - (countWrongAns * 23),
        star: function () {
            let corrScore = countCorrectAns * 95;
            let totalScore = (countCorrectAns + countWrongAns) * 95;
            let perScore = (corrScore / totalScore) * 100; // Persent Score
            return perScore <= 50 && perScore > 0 ? 0 : perScore > 50 && perScore <= 70 ? 1 : perScore > 70 && perScore <= 90 ? 2 : perScore > 90 ? 3 : 0
        }
    }
    const getStoreScore = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('wordQuiz')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }

        console.log('GEt Done.')
    }

    const storeScore = async () => {
        let wordQuiz = await getStoreScore() || [];
        wordQuiz[quesId] = {score: (countCorrectAns * 95) - (countWrongAns * 23), star: score.star()};
        try {
            const jsonValue = JSON.stringify(wordQuiz)
            await AsyncStorage.setItem('wordQuiz', jsonValue)
        } catch (e) {
            // save error
        }

        console.log('Done.')
        console.log(await getStoreScore())
    }
    storeScore();
    return score;
}

//? Custom Function End

const Quiz = ({ data, id, navigation }) => {
    const { words } = data[id];
    let opt1 = useRef();
    let opt2 = useRef();
    let opt3 = useRef();
    let opt4 = useRef();

    const [switc, setSwitc] = useState(false);
    const [curQuesId, setCurQuesId] = useState(1);
    const [ques, setQues] = useState(words[0][0]);
    const [ans, setAns] = useState(words[0][1]);
    const [options, setOptions] = useState([words[0][2], words[0][3], words[0][4], words[0][5]]);

    // Next Question
    function next() {
        COS();
        if (curQuesId < words.length) {
            setCurQuesId(curQuesId + 1);
            setQues(words[curQuesId][0])
            setAns(words[curQuesId][1])
            setOptions([words[curQuesId][2], words[curQuesId][3], words[curQuesId][4], words[curQuesId][5]])
        }
    }


    // Clear Option Styles

    function COS() {
        opt1.current.setNativeProps({
            ...styles.options.option.default
        });
        opt2.current.setNativeProps({
            ...styles.options.option.default
        });
        opt3.current.setNativeProps({
            ...styles.options.option.default
        });
        opt4.current.setNativeProps({
            ...styles.options.option.default
        });
    }

    var otW = 0; // One time wrong
    let btnClick = (option, e) => { // index, Answer
        if (option === ans) {

            otW === 0 ? countCorrectAns++ : "" // Count Correct Answer

            e.setNativeProps({
                ...styles.options.option.correct
            });
            if (curQuesId === words.length) {
                setSwitc(true)
                //! Alert.alert("Complited")
            } else {
                next();
                COS();
                otW = 0;
                Vibration.vibrate(50);
            }
        } else {
            if (otW === 0) {
                e.setNativeProps({
                    ...styles.options.option.wrong
                });
                otW = otW + 1;
                countWrongAns++;
            }
            if (options.indexOf(ans) === 0) {
                opt1.current.setNativeProps({
                    ...styles.options.option.correct
                });
            }
            else if (options.indexOf(ans) === 1) {
                opt2.current.setNativeProps({
                    ...styles.options.option.correct
                });
            }
            else if (options.indexOf(ans) === 2) {
                opt3.current.setNativeProps({
                    ...styles.options.option.correct
                });
            }
            else if (options.indexOf(ans) === 3) {
                opt4.current.setNativeProps({
                    ...styles.options.option.correct
                });
            }
            return () => clearInterval(timeOut);
        }
    }

    const Button = ({ option, refrence }) => {
        return (
            <TouchableOpacity style={[styles.options.option]} ref={refrence} onPress={(e) => btnClick(option, e.currentTarget)}>
                <Text style={styles.options.option.text}>{option}</Text>
            </TouchableOpacity>
        )
    }
    const ActionButton = ({ title, icon, position, navigation, data, id }) => {
        return (
            <TouchableOpacity style={[styles.options.option, { elevation: 9 }]} onPress={() => onPressNext(navigation, data, id, title)}>
                <Text style={[styles.options.option.text, { color: gS.primaryColor }]}>{position === 'left' ? <FontAwesome5 name={icon} style={{ color: gS.primaryColor, fontSize: 15 }} /> : ""}  {title}  {position === 'right' ? <FontAwesome5 name={icon} style={{ color: gS.primaryColor, fontSize: 15 }} /> : ""}</Text>
            </TouchableOpacity>
        )
    }
    
    return (
        <View style={styles.background}>
            <View style={[styles.questions, !switc ? { justifyContent: 'center' } : ""]} >
                {!switc
                    ? <Text style={{ fontSize: 30, padding: 15 }}>{ques}</Text>
                    : <>
                        <Score.Provider value={() => calCulateScore(id)}>
                            <ScoreResult />
                        </Score.Provider>

                    </>
                }
            </View>
            <View style={[styles.options, { height: "65%" }]}>
                {!switc
                    ? <>
                        <Button refrence={opt1} option={options[0]} />
                        <Button refrence={opt2} option={options[1]} />
                        <Button refrence={opt3} option={options[2]} />
                        <Button refrence={opt4} option={options[3]} />
                    </>
                    : <>
                        <ActionButton title='Next' icon='arrow-right' position='right' navigation={navigation} data={data} id={id} />
                        <ActionButton title='Repeat' icon='redo-alt' position='right' navigation={navigation} data={data} id={id} />
                    </>
                }


            </View>
        </View>
    )
}
export default function App({ route, navigation }) {
    countWrongAns = 0, // Reset Wrong Answer
        countCorrectAns = 0; // Reset Correct Answer
    const { data, id } = route.params;
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={gS.primaryColor} />
            <Quiz data={data} id={id} navigation={navigation} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        backgroundColor: gS.primaryColor,
        alignItems: 'center',
        width: "100%",
        height: "100%",
    },
    questions: {
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: "#fff",
        width: "80%",
        elevation: 3,
        margin: 20,
        marginTop: 25,
        height: "26%",
        borderRadius: 20
    },
    options: {
        borderTopRightRadius: 120,
        borderTopLeftRadius: 120,
        justifyContent: "center",
        backgroundColor: "#fff",
        position: "absolute",
        alignItems: "center",
        width: "100%",
        elevation: 9,
        bottom: 0,
        option: {
            justifyContent: 'center',
            backgroundColor: '#fff',
            alignItems: 'center',
            marginTop: "5%",
            height: '13%',
            shadowColor: gS.primaryColor,
            elevation: 5,
            width: '60%',
            padding: 10,
            text: {
                fontSize: 18
            },
            correct: {
                borderWidth: 1,
                shadowColor: '#25a233',
                borderColor: '#25a233',
            },
            default: {
                borderWidth: 0,
                shadowColor: gS.primaryColor,
                borderColor: 'none'
            },
            wrong: {
                borderWidth: 1,
                shadowColor: '#f4516c',
                borderColor: '#f4516c',
            }
        }
    }
});
