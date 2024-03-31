const fs = require('fs')
let rawCategory = require("./category.json");
let rawDatabase = require("./database.json");

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

function chunkArray(array, size) {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
        const chunk = array.slice(i, i + size);
        chunkedArray.push(chunk);
    }
    return chunkedArray;
}

// for (let i = 0; i < rawCategory.length; i++) {
//     const element = rawCategory[i];
//     element.questionIds = chunkArray(element.questionIds, 10);
// }
// createFile(rawCategory)
// console.log(rawCategory[1])

function convertIdToQuestion(ids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    let questions = [];
    for (let i = 0; i < ids.length; i++) {
        const v = ids[i];
        for (let j = 0; j < rawDatabase.questions.length; j++) {
            const element = rawDatabase.questions[j];
            if (element.id === v) {
                questions.push(element);
                break;
            }
        }
    }
    return questions;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function makeOption(NumOfOpt = 3, optLang = "hindi" || "english") {
    let questions = [];
    await convertIdToQuestion().map((v, i) => {
        // v['options'][optLang]
        // if (optLang == "english") {
        if (v['options']['hindi'].indexOf(v['hindi_word']) > -1 || v['options']['english'].indexOf(v['english_meaning']) > -1) {
            console.log(v['options']['hindi'].indexOf(v['hindi_word']))
            console.log(v['options']['hindi'].indexOf(v['hindi_word']))
        }
        // }
        for (let i = 0; i < v['options']['hindi'].length; i++) {  // Remove Hindi dublicates
            const element = v['options']['hindi'][i];
            if (element === v['hindi_word']) {
                v['options']['hindi'].splice(i, 1)
                v['options']['english'].splice(i, 1)
            }
            // console.log(v['options']);
        }
        for (let i = 0; i < v['options']['english'].length; i++) { // Remove English Dublicates
            const element = v['options']['english'][i];
            if (element === v['english_meaning']) {
                v['options']['english'].splice(i, 1)
                v['options']['hindi'].splice(i, 1)
            }
        }


        // set Spacific number of Options
        if (v['options']['english'].length > NumOfOpt-1) {
            v['options']['english'] = v['options']['english'].slice(0, NumOfOpt-1);
            console.log("Hyes")
        }
        if (v['options']['hindi'].length > NumOfOpt-1) {
            v['options']['hindi'] = v['options']['hindi'].slice(0, NumOfOpt-1);
            console.log("NYes")
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
// console.log(makeOption(3, "english"));
makeOption(3, "english").then((d) => {
    console.log(d[0].options)
})