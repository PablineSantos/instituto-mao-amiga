import {  Text, TouchableOpacity, StyleSheet, View } from "react-native";

export type Ponto = {
  id: number;
  nome: string;
  quantidadeAlimentos: number;
};

export const pontosMock: Ponto[] = [
  { id: 1, nome: "Alfa", quantidadeAlimentos: 1000 },
  { id: 2, nome: "Beta", quantidadeAlimentos: 980 },
  { id: 3, nome: "sigma", quantidadeAlimentos: 190 },
];

export default function TelaListaPontos ({navigation}:any){
    return(
        <View style={styles.container}>
            {pontosMock.map((ponto)=>(
                <TouchableOpacity 
                key={ponto.id}
                style={styles.item}
                onPress={()=> navigation.navigate('Detalhe', {id:ponto.id})}>
                    <Text style={styles.titulo}>{ponto.nome}</Text>
                    <Text> Id:{ponto.id}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#CCC',
    marginBottom: 8 
  },
  titulo: { fontSize: 18, fontWeight: 'bold' },
});