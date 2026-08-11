import { View, Text } from "react-native";
type Ponto = {
  id: number;
  nome: string;
  quantidadeAlimentos: number;
};
const pontosMock: Ponto[] = [
  {
    id: 1,
    nome: "Alfa",
    quantidadeAlimentos: 1000,
  },
  {
    id: 2,
    nome: "Beta",
    quantidadeAlimentos: 980,
  },
  {
    id: 3,
    nome: "sigma",
    quantidadeAlimentos: 190,
  },
];
function PontoItem({ ponto }: { ponto: Ponto }) {
  return (
    <View>
      <Text>{ponto.id}</Text>
      <Text>{ponto.nome}</Text>
      <Text>{ponto.quantidadeAlimentos}</Text>
    </View>
  );
}
export default function TelaListaPontos() {
  return (
    <View>
      {pontosMock.map((ponto) => (
        <PontoItem key={ponto.id} ponto={ponto} />
      ))}
    </View>
  );
}
