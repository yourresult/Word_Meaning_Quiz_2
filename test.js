const fs = require('fs')
let rawWordMeaning = require("./database.json");
let rawCategory = require("./category.json");
let count = 0;

// Split Word Meanings into 10/100

let questions = [];
function splitWordMeanings(arr) {
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];

        if (count <= 9) {
            if (count === 0 || count === -1) {
                questions.push([element]);
            } else {
                questions[questions.length - 1].push(element);
                if (count === 9) {
                    count = -1;
                }
            }
            count++;
        }
    }
    // console.log("start",questions, "end");
    return questions;
}
// console.log(splitWordMeanings(rawCategory[0].questionIds))
// List of all word meanings

function listOfWordMeanings() {
    let words = [];
    for (let i = 0; i < rawWordMeaning.questions.length; i++) {
        const element = rawWordMeaning.questions[i];
        if (words.indexOf(element.english_meaning) === -1) {
            words.push(element.english_meaning);
        }
    }
    return words;
    // console.log(words.length)
}

function fetchUniqueWords(arr = []) {
    let uniqueArr = [];
    arr.map((v, i) => {
        if (listOfWordMeanings().indexOf(v) === -1) {
            // if (i > 49) {
            uniqueArr.push(v);
            // }
        }
    })
    return uniqueArr;
}
// let match = ["Free","Dear","Basic","Treatment","Severely","Plant","Less","Foreign","Damage","Bad","Unfairly","Signature","Powder","Low","Gain","Demand","Below","Them","Rubber","Oven","Investigation","Extent","Considerably","Anxious","Tomato","Seal","Per","Knee","Fill","Cover","Asleep","Together","Screw","People","Kiss","Fight","Court","Aside","Unhappy","Silly","Praise","Lunch","Garden","Departure","Bet","Wage","Sore","Property","Message","Guide"]
// console.log(match.length);
// console.log(fetchUniqueWords(match));
// // splitWordMeanings()
// console.log(listOfWordMeanings().length)


function createFile(json) {
    const data = {
        name: 'John Doe',
        age: 30,
        email: 'johndoe@example.com',
    };

    const jsonData = JSON.stringify(json, null, 2); // Convert JavaScript object to JSON string with indentation

    fs.writeFile('testdata.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
        } else {
            console.log('JSON file created successfully.');
        }
    });
}
// createFile()


function filterData() {
    let words = [];
    // rawWordMeaning.questions.length
    let wordMeanings = rawWordMeaning;
    for (let i = 0; i < rawWordMeaning.questions.length; i++) {
        // const element = rawWordMeaning.questions[i];
        rawWordMeaning.questions[i].id = i;
    }
    return rawWordMeaning;
}
// createFile(filterData())


function getData(){
    return [{"score": 262, "star": 2}, {"score": 2450, "star": 2}, {"score": 285, "star": 3}];
}

async function meargeScoreCategory(){
    // let resp = await fetch('https://raw.githubusercontent.com/yourresult/public/main/wordMeanings');
    let respJson;
    if (!respJson) {
        // let resp = await fetch('https://gitlab.com/funlife8409/public/-/raw/main/wordMeaning');
        // let resp = await rawWordMeaning;
        respJson = await rawWordMeaning;
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

// meargeScoreCategory().then(d => {
//     console.log(d)
// })






function filterCategory() {
    let ar = [];
    for (let i = 0; i < rawCategory.length; i++) {
        const element = rawCategory[i];
        element['questionIds'] = splitWordMeanings(element.questionIds);
        ar.push(splitWordMeanings(element.questionIds))
    }
    console.log(ar)
    return ar;
}
filterCategory()