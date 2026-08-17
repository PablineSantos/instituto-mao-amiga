import { View,StyleSheet,Text} from "react-native";
import { Ponto,pontosMock } from "./TelaListaPontos";

function DetalheDoPonto({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{ponto.nome}</Text>
      <Text style={styles.texto}>ID de Registros: {ponto.id}</Text>
      <Text style={styles.texto}>Total de Alimentos: {ponto.quantidadeAlimentos}</Text>
    </View>
  );
}

export default function TelaDetalhePontos({route}:any){
    const{id}= route.params;
    const pontoEncontrado = pontosMock.find((p) => p.id === id)
    if(!pontoEncontrado){
        return(
            <View style={styles.container}>
            <Text>Ponto de coleta não encontrado.</Text>
            </View>
        );
    }
    return <DetalheDoPonto ponto={pontoEncontrado}/>
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  texto: { fontSize: 16, marginTop: 8 },
});