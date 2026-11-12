import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform, Text, TouchableOpacity } from "react-native";
import TelaDetalheDoacao from "./TelaDetalheDoacao";
import TelaDetalhePonto from "./TelaDetalhePonto";
import TelaFormPonto from "./TelaFormPonto";
import TelaListaPontos from "./TelaListaPontos";
import TelaMinhasDoacoes from "./TelaMinhasDoacoes";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Lista"
        screenOptions={{
          contentStyle: { flex: 1, backgroundColor: "#F4F6F8" },
        }}
      >
        <Stack.Screen
          name="Lista"
          component={TelaListaPontos}
          options={({ navigation }: any) => ({
            title: "Pontos de Coleta",
            headerTitleAlign: "left",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("MinhasDoacoes")}
                style={{
                  marginRight: Platform.OS === "web" ? 16 : 0,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: "#2563EB",
                  borderRadius: 8,
                }}
                activeOpacity={0.8}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 13 }}>
                  Minhas Doações
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Detalhe"
          component={TelaDetalhePonto}
          options={{ title: "Detalhes do Ponto" }}
        />
        <Stack.Screen
          name="FormPonto"
          component={TelaFormPonto}
          options={({ route }: any) => ({
            title: route?.params?.ponto ? "Editar Ponto" : "Novo Ponto",
          })}
        />
        <Stack.Screen
          name="MinhasDoacoes"
          component={TelaMinhasDoacoes}
          options={{ title: "Minhas doações" }}
        />
        <Stack.Screen
          name="DetalheDoacao"
          component={TelaDetalheDoacao}
          options={{ title: "Detalhes da Doação" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
