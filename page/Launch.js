import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Alert, StatusBar, Image } from 'react-native';
import { gS } from '../styles/globalStyles';
// import TestComponent from './TestComponent';

const onPressStart = (navigation) => {
    navigation.replace('HomePage')
}
export default function App({ navigation }) {
    return (
            // <TestComponent />
        <View style={styles.container}>
            <StatusBar backgroundColor={gS.primaryColor} />
            <View style={{ flex: 1 }}></View>
            <View style={styles.top}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../src/img/paper-aeroplane.png')} style={{ flexDirection: 'row', resizeMode: 'center', width: 20, height: 20, marginRight: 10 }} />
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#fff' }}>WORD MEANING QUIZ</Text>
                </View>
                <Text style={{ textAlign: 'center', fontSize: 12, marginTop: 25, color: '#fff' }}>Do you have a passion for memorizing word meanings.</Text>
            </View>
            <View style={styles.middle}>
                <Image source={require('../src/img/quiz.png')} style={{ width: "95%", marginHorizontal: "auto", resizeMode: 'center', alignSelf: 'center', alignItems: 'center' }} />
            </View>
            <View style={styles.bottom}>
                <Text onPress={() => onPressStart(navigation)} style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 20, width: '60%', backgroundColor: 'white', padding: 20, textAlign: 'center', elevation: 3 }} >START</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: gS.primaryColor
    },
    top: {
        flex: 1,
    },
    middle: {
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottom: {
        flex: 2,
    }
});