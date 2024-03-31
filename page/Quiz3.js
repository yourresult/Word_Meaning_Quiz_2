import React, { useState, useRef, useEffect, createContext, useMemo } from 'react';
import { StyleSheet, StatusBar, Dimensions, Text, Image, View, TouchableOpacity, ActivityIndicator, Vibration, Animated, Alert } from 'react-native';
import { Audio } from "expo-av";
import { gS } from '../styles/globalStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ScoreResult from '../component/quiz/ScoreResult';
import ConfettiCannonComponent from './ConfettiComponent';

// Audios
import audioFiles from "./audioSrc";
// import correctAud from "../src/audio/correct-answer.wav";
// import wrongAud from "../src/audio/wrong-answer.mp3";

//? Context 

export const Score = createContext();

//? Context End


// Custom functions

let randNumbers = (to = 10, from = 0) => {
    return Math.floor(Math.random() * to) + from;
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
    if (title === "Next") {
        data[index] ? navigation.replace('Quiz2', { data: data, index: index + 1, catId, nav }) : ''
    } else {
        data[index] ? navigation.replace('Quiz2', { data: data, index: index, catId, nav }) : ''
    }
}

const calCulateScore = ({ countCorrectAns, countWrongAns }, index, data, catId, nav) => {
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Custom Components
const Quiz = React.memo(({ data, nav, questions, index, catId, navigation }) => {
    const [switc, setSwitc] = useState(false);
    const [curQuesId, setCurQuesId] = useState(1);
    const [corrAns, setCorrAns] = useState([]);
    const [worngAns, setWrongAns] = useState([]);
    const ConfettiCannonComponentRef = useRef();

    const [sound, setSound] = useState();
    const [conflii, setConflii] = useState(false);
    // const [ques, setQues] = useState(questions[0].hindi_word);
    const [ques, setQues] = useState(questions[0][nav === "hinToeng" ? "hindi_word" : "english_meaning"]);
    const [ans, setAns] = useState(questions[0][nav === "hinToeng" ? "english_meaning" : "hindi_word"]);
    const [options, setOptions] = useState([...questions[0].options[nav === "hinToeng" ? "english" : "hindi"]]);


    let score = {
        countCorrectAns: corrAns.length,
        countWrongAns: worngAns.length
    }
    let calculatedScore = calCulateScore(score, index, data, catId, nav);

    const correctAns = (numb) => {
        if (corrAns.indexOf(curQuesId) < 0 && worngAns.indexOf(curQuesId) < 0) {
            setCorrAns([...corrAns, curQuesId]);
            // conflii ? setConflii(false) : setConflii(true);
            // ConfettiCannonComponentRef.current.stop();

        }

        if (curQuesId < questions.length) {
            setCurQuesId(curQuesId + 1);
            setQues(questions[curQuesId][nav === "hinToeng" ? "hindi_word" : "english_meaning"])
            setAns(questions[curQuesId][nav === "hinToeng" ? "english_meaning" : "hindi_word"])
            setOptions([...questions[curQuesId].options[nav === "hinToeng" ? "english" : "hindi"]])
        } else {
            setSwitc(true)
            resultSound(calculatedScore, setSound);
            // ConfettiCannonComponentRef.current.start(calculatedScore.star());
        }
    }

    const wrongAns = () => {
        console.log(curQuesId)
        if (worngAns.indexOf(curQuesId) < 0) {
            setWrongAns([...worngAns, curQuesId])
        }
    }


    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound])

    return (
        <>
            <View style={styles.background}>
                <><View style={[styles.questions, !switc ? { justifyContent: 'center' } : ""]}>
                    {!switc
                        ? <Text style={{ fontSize: 30, padding: 15 }}>{ques}</Text>
                        : <>
                            <Score.Provider value={() => calculatedScore}>
                                <ScoreResult />
                            </Score.Provider>

                        </>}
                </View><View style={[styles.options, { height: "65%" }]}>
                        {!switc
                            ? <>
                                {options.map((v, i) => <Button key={i} option={v} ans={ans} correctAns={correctAns} wrongAns={wrongAns} setSound={setSound} />)}
                            </>
                            : <>
                                <ActionButton title='Next' icon='arrow-right' position='right' navigation={navigation} catId={catId} nav={nav} data={data} index={index} />
                                <ActionButton title='Repeat' icon='redo-alt' position='right' navigation={navigation} catId={catId} nav={nav} data={data} index={index} />
                            </>}
                    </View></>
            </View>
            { switc ?  <ConfettiCannonComponent ref={ConfettiCannonComponentRef} star={calculatedScore.star()}/> : "" }
        </>
    )
})

// Custom Functions

async function makeSound(e, setSound) {
    const { sound } = await Audio.Sound.createAsync(e);
    setSound(sound);

    await sound.playAsync();
    // await sound.setRateAsync(2);
    // await sound.setVolumeAsync(0.3);
    return;
}

function resultSound({ score, star }, setSound) {
    let st = star();
    if (st === 0 || st === 1) {
        makeSound(audioFiles.bad[randNumbers(audioFiles.bad.length - 1)], setSound);
    } else if (st === 2) {
        makeSound(audioFiles.good[randNumbers(audioFiles.good.length - 1)], setSound);
    } else if (st > 2) {
        makeSound(audioFiles.veryGood[randNumbers(audioFiles.veryGood.length - 1)], setSound);
    }
}

function optionClick(e, { option, ans, correctAns, wrongAns, setSound }) {

    if (option === ans) {
        correctAns(e);
        makeSound(audioFiles.correctAns, setSound);
        e.setNativeProps({
            ...styles.options.option.correct
        });
    } else {
        makeSound(audioFiles.wrongAns, setSound);
        wrongAns(-1);
        e.setNativeProps({
            ...styles.options.option.wrong
        });
    }
}

const ActionButton = React.memo(({ title, icon, position, catId, nav, navigation, data, index }) => {
    return (
        <TouchableOpacity style={[styles.options.option, { elevation: 9 }]} onPress={() => onPressNext(navigation, data, index, title, catId, nav)}>
            <Text style={[styles.options.option.text, { color: gS.primaryColor }]}>{position === 'left' ? <FontAwesome5 name={icon} style={{ color: gS.primaryColor, fontSize: 15 }} /> : ""}  {title}  {position === 'right' ? <FontAwesome5 name={icon} style={{ color: gS.primaryColor, fontSize: 15 }} /> : ""}</Text>
        </TouchableOpacity>
    )
})

const Button = React.memo(({ option, correctAns, wrongAns, setSound, ans, sty }) => {
    const btn = useRef();
    useEffect(() => {
        btn.current.setNativeProps({
            ...styles.options.option.default
        });

    }, [ans])
    return (
        <TouchableOpacity style={[styles.options.option]} ref={btn} onPress={(e) => optionClick(btn.current, { option, ans, correctAns, wrongAns, setSound })}>
            <Text style={styles.options.option.text}>{option}</Text>
        </TouchableOpacity>
    )
})



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