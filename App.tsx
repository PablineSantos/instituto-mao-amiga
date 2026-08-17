import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaPontos from './TelaListaPontos';
import TelaDetalhePonto from './TelaDetalhePonto';
import { Stack } from 'expo-router';

const stack = createNativeStackNavigator();
export default function App(){
    return(
        <NavigationContainer>
            <stack.Navigator initialRouteName='Lista'>
                <stack.Screen
                name="Lista"
                component={TelaListaPontos}
                options={{ title: 'Pontos de Coleta'}}
                />
                <stack.Screen
                name="Detalhe"
                component={TelaDetalhePonto}
                options={{title: 'Detalhes do ponto'}}
                />
                </stack.Navigator>
                </NavigationContainer>
    )
}
