import React, { useState, useRef, useEffect, createContext, useMemo } from 'react';
import { StyleSheet, StatusBar, Text, Image, View, TouchableOpacity, ActivityIndicator, Vibration, Animated, Alert } from 'react-native';
import { Audio } from "expo-av";
import { gS } from '../styles/globalStyles';
import ScoreResult from '../component/quiz/ScoreResult';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import correctAud from "../src/audio/correct-answer.wav";
import wrongAud from "../src/audio/wrong-answer.mp3";

//? Variables
var countWrongAns = 0, // -23
    countCorrectAns = 0; // 95
    var otW = 0; // One time wrong
// Number of Wrong Answer

//? Variables End

//? Context 

export const Score = createContext();

//? Context End

//? Custom Function 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let getDatabase = async (ids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) => {
    let respJson;
    if (!respJson) {
        let resp = await fetch('https://gitlab.com/funlife8409/public/-/raw/main/database.json');
        respJson = await resp.json();
    }
    function convertIdToQuestion() {
        let questions = [];
        for (let i = 0; i < ids.length; i++) {
            const v = ids[i];
            for (let j = 0; j < respJson.questions.length; j++) {
                const element = respJson.questions[j];
                if (element.id === v) {
                    questions.push(element);
                    break;
                }
            }

        }
        return questions;
    }
    async function makeOption(NumOfOpt = 4, optLang = "hindi" || "english") {
        let questions = [];
        await convertIdToQuestion().map((v, i) => {
            for (let i = 0; i < v['options']['hindi'].length; i++) {  // Remove Hindi dublicates
                const element = v['options']['hindi'][i];
                if (element === v['hindi_word']) {
                    v['options']['hindi'].splice(i, 1)
                    v['options']['english'].splice(i, 1)
                }
            }
            for (let i = 0; i < v['options']['english'].length; i++) { // Remove English Dublicates
                const element = v['options']['english'][i];
                if (element === v['english_meaning']) {
                    v['options']['english'].splice(i, 1)
                    v['options']['hindi'].splice(i, 1)
                }
            }


            // set Spacific number of Options
            if (v['options']['english'].length > NumOfOpt - 1) {
                v['options']['english'] = v['options']['english'].slice(0, NumOfOpt - 1);
            }
            if (v['options']['hindi'].length > NumOfOpt - 1) {
                v['options']['hindi'] = v['options']['hindi'].slice(0, NumOfOpt - 1);
            }

            // Append hindi english answer
            v['options']['english'].push(v['english_meaning'])
            v['options']['hindi'].push(v['hindi_word'])

            // Convert random options
            v['options']['english'] = shuffleArray(v['options']['english'])
            v['options']['hindi'] = shuffleArray(v['options']['hindi'])
            questions.push(v);
        })
        return await questions;
    }
    return await makeOption(3, "english");
}

const onPressNext = (navigation, data, index, title, catId, nav) => {
    countWrongAns = 0, // Reset Wrong Answer
        countCorrectAns = 0; // Reset Correct Answer
    if (title === "Next") {
        data[index] ? navigation.replace('Quiz2', { data: data, index: index + 1, catId, nav }) : ''
    } else {
        data[index] ? navigation.replace('Quiz2', { data: data, index: index, catId, nav }) : ''
    }
}

const calCulateScore = (index, data, catId, nav) => {
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
            const jsonValue = await AsyncStorage.getItem('quizScore')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }

    }

    const storeScore = async () => {
        let wordQuiz = await getStoreScore() || { "1": { "hinToeng": [[null, null]], "engTohin": [[null, null]] } };
        if (wordQuiz[catId] && wordQuiz[catId][nav]) {
            wordQuiz[catId][nav][index] = [(countCorrectAns * 95) - (countWrongAns * 23), score.star()]
        } else {
            wordQuiz[catId] = { "hinToeng": [[null, null]], "engTohin": [[null, null]] };
            wordQuiz[catId][nav][index] = [(countCorrectAns * 95) - (countWrongAns * 23), score.star()]
        }
        try {
            const jsonValue = JSON.stringify(wordQuiz)
            await AsyncStorage.setItem('quizScore', jsonValue)
        } catch (e) {
            // save error
        }

    }
    storeScore();
    return score;
}

//? Custom Function End

const Button = React.memo(({ option, refrence, btnClick }) => {
    // console.log("btn rerendered", option, refrence, btnClick);
    return (
        <TouchableOpacity style={[styles.options.option]} ref={refrence} onPress={(e) => btnClick(option, e.currentTarget)}>
            <Text style={styles.options.option.text}>{option}</Text>
        </TouchableOpacity>
    )
})

// const Button = ({ option, refrence }) => {
//     return (
//         <TouchableOpacity style={[styles.options.option]} ref={refrence} onPress={(e) => btnClick(option, e.currentTarget)}>
//             <Text style={styles.options.option.text}>{option}</Text>
//         </TouchableOpacity>
//     )
// }

const Quiz = ({ data, nav, questions, index, catId, navigation }) => {
    let opt1 = useRef();
    let opt2 = useRef();
    let opt3 = useRef();
    let opt4 = useRef();
    const [switc, setSwitc] = useState(false);
    const [sound, setSound] = useState();
    const [curQuesId, setCurQuesId] = useState(1);
    // const [ques, setQues] = useState(questions[0].hindi_word);
    const [ques, setQues] = useState(questions[0][nav === "hinToeng" ? "hindi_word" : "english_meaning"]);
    const [ans, setAns] = useState(questions[0][nav === "hinToeng" ? "english_meaning" : "hindi_word"]);
    const [options, setOptions] = useState([...questions[0].options[nav === "hinToeng" ? "english" : "hindi"]]);


    // // Next Question
    function next() {
        COS();
        if (curQuesId < questions.length) {
            setCurQuesId(curQuesId + 1);
            setQues(questions[curQuesId][nav === "hinToeng" ? "hindi_word" : "english_meaning"])
            setAns(questions[curQuesId][nav === "hinToeng" ? "english_meaning" : "hindi_word"])
            setOptions([...questions[curQuesId].options[nav === "hinToeng" ? "english" : "hindi"]])
        }
    }


    // // Clear Option Styles
    function COS() {
        opt1.current.setNativeProps({
            ...styles.options.option.correct
        });
        return;
    }

    // const correctAnswerSound = useMemo(async (e) => {
    //     // console.log('Loading Sound');
    //     // `../src/audio/correct-answer.wav`
    //     const { sound } = await Audio.Sound.createAsync(e);
    //     setSound(sound);

    //     // console.log('Playing Sound');
    //     await sound.playAsync();
    //     // await sound.setRateAsync(2);
    //     await sound.setVolumeAsync(0.3);
    //     return;
    // }, [])
    async function correctAnswerSound(e) {
        // console.log('Loading Sound');
        // `../src/audio/correct-answer.wav`
        const { sound } = await Audio.Sound.createAsync(e);
        setSound(sound);

        // console.log('Playing Sound');
        await sound.playAsync();
        // await sound.setRateAsync(2);
        await sound.setVolumeAsync(0.3);
        return;
    }

    useEffect(() => {
        return sound
            ? () => {
                // console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound])

    
    let btnClick = async (option, e) => { // index, Answer
        if (option === ans) {
            otW === 0 ? countCorrectAns++ : "" // Count Correct Answer

            e.setNativeProps({
                ...styles.options.option.correct
            });
            if (curQuesId === questions.length) {
                setSwitc(true)
                //! Alert.alert("Complited")
            } else {
                next();
                // COS(e);
                otW = 0;
                Vibration.vibrate(50);
                await correctAnswerSound(correctAud);
            }
        } else {
            // await correctAnswerSound(wrongAud);
            console.log(otW);
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
            // COS();
            // return () => clearInterval(timeOut);
        }
    }

    // const Button = ({ option, refrence }) => {
    //     return (
    //         <TouchableOpacity style={[styles.options.option]} ref={refrence} onPress={(e) => btnClick(option, e.currentTarget)}>
    //             <Text style={styles.options.option.text}>{option}</Text>
    //         </TouchableOpacity>
    //     )
    // }
    const ActionButton = ({ title, icon, position, navigation, data, index }) => {
        return (
            <TouchableOpacity style={[styles.options.option, { elevation: 9 }]} onPress={() => onPressNext(navigation, data, index, title, catId, nav)}>
                <Text style={[styles.options.option.text, { color: gS.primaryColor }]}>{position === 'left' ? <FontAwesome5 name={icon} style={{ color: gS.primaryColor, fontSize: 15 }} /> : ""}  {title}  {position === 'right' ? <FontAwesome5 name={icon} style={{ color: gS.primaryColor, fontSize: 15 }} /> : ""}</Text>
            </TouchableOpacity>
        )
    }
    console.log("rerenderd")
    return (
        <View style={styles.background}>
            <><View style={[styles.questions, !switc ? { justifyContent: 'center' } : ""]}>
                {!switc
                    ? <Text style={{ fontSize: 30, padding: 15 }}>{ques}</Text>
                    : <>
                        <Score.Provider value={() => calCulateScore(index, data, catId, nav)}>
                            <ScoreResult />
                        </Score.Provider>

                    </>}
            </View><View style={[styles.options, { height: "65%" }]}>
                    {!switc
                        ? <>
                            {options.map((v, i) => <Button refrence={i === 0 ? opt1 : i === 1 ? opt2 : i === 2 ? opt3 : opt4} key={i} option={v} btnClick={btnClick}/>)}
                        </>
                        : <>
                            <ActionButton title='Next' icon='arrow-right' position='right' navigation={navigation} data={data} index={index} />
                            <ActionButton title='Repeat' icon='redo-alt' position='right' navigation={navigation} data={data} index={index} />
                        </>}
                </View></>
        </View>
    )
}
export default function App({ route, navigation }) {
    const [questions, setQuestions] = useState([{ id: null, hindi_word: "j", english_meaning: "", options: { english: [], hindi: [] }, meaning_sentence: { english: "", hindi: "" } }]);
    const [isLoading, setIsLoading] = useState(true);
    countWrongAns = 0, // Reset Wrong Answer
        countCorrectAns = 0; // Reset Correct Answer
    const { data, index, catId, nav } = route.params;
    useEffect(() => {
        async function ques() {
            await setQuestions(await getDatabase(data[index]));
            setIsLoading(false);
        }
        if (questions[0].id === null) {
            ques();
        }
    }, [])
    return (
        <View style={styles.container}>
            {!isLoading ?
                <><StatusBar backgroundColor={gS.primaryColor} /><Quiz data={data} nav={nav} questions={questions} index={index} catId={catId} navigation={navigation} /></>
                : <ActivityIndicator size="large" color="#00ff00" />}
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
