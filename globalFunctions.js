import AsyncStorage from '@react-native-async-storage/async-storage';
// store item
export const storeData = async (key, val) => {
    let value = JSON.stringify(val);
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        return e;
        // saving error
    }
}
// get item
export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return JSON.parse(value);
        }else if (value === null) {
            return {};
        }
    } catch (e) {
        // error reading value
    }
}
