import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { gS } from './styles/globalStyles';

// TODO: Your Page Components here
import Launch from './page/Launch';
import ListQuiz from './page/ListQuiz';
import ListQuiz2 from './page/ListQuiz2';
import HomePage from './page/HomePage';
import Quiz from './page/Quiz';
import Quiz2 from './page/Quiz3';
import CategoryList from './page/CategoryList';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Launch' options={{headerShown: false}} component={Launch}/>
        <Stack.Screen name='HomePage' options={{headerShown: true}} component={HomePage}/>
        <Stack.Screen name='ListQuiz' options={{headerShown: true}} component={ListQuiz}/>
        <Stack.Screen name='ListQuiz2' options={{headerShown: true}} component={ListQuiz2}/>
        <Stack.Screen name='CategoryList' component={CategoryList} options={{title: 'Quiz List', headerStyle: {backgroundColor: gS.primaryColor}, headerTitleStyle: {color: '#fff'}, headerTintColor: '#fff'}}/>
        <Stack.Screen name='Quiz' component={Quiz} options={{title: 'Quiz', headerStyle: {backgroundColor: gS.primaryColor}, headerTitleStyle: {color: '#fff'}, headerTintColor: '#fff'}}/>
        <Stack.Screen name='Quiz2' component={Quiz2} options={{title: 'Quiz2', headerStyle: {backgroundColor: gS.primaryColor}, headerTitleStyle: {color: '#fff'}, headerTintColor: '#fff'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}