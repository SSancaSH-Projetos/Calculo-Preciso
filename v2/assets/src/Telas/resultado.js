// :D

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';

const ResultadoCalculoUsinagem = ({ route }) => {
  const [mostrarHistorico, setMostrarHistorico] = useState(false); // Variável para controlar a exibição do histórico
  const [historico, setHistorico] = useState([]); // Variável para armazenar os dados do histórico
  const [ultimoRegistro, setUltimoRegistro] = useState({});
  const [historicoNomesData, setHistoricoNome] = useState([]);

  const { resultado } = route.params;

  const carregarDados = async () => {
    try {
      // Faz as duas solicitações simultaneamente
      const [historicoResponse, historicoNomesResponse] = await Promise.all([
        fetch("http://10.110.12.39:8080/calculos/historico"),
        fetch("http://10.110.12.39:8080/pecas/historico/nomes")
      ]);

      // Verifica se ambas as solicitações foram bem-sucedidas
      if (!historicoResponse.ok || !historicoNomesResponse.ok) {
        throw new Error("Erro ao carregar os dados");
      }

      // Extrai os dados JSON das respostas
      const historicoData = await historicoResponse.json();
      const historicoNomesData = await historicoNomesResponse.json();

      // Define os estados correspondentes
      setHistorico(historicoData);
      setHistoricoNome(historicoNomesData);
    } catch (error) {
      console.error("Erro ao carregar os dados:", error.message);
    }
  };

  const carregarUltimoRegistro = async () => {
    try {
      const response = await fetch("http://10.110.12.39:8080/pecas/ultima");
      if (!response.ok) {
        throw new Error("Erro ao carregar o último registro");
      }
  
      const data = await response.json();
      setUltimoRegistro({
        nomePeca: data.nomePeca,
        codigoPeca: data.codigoPeca,
        nomeMaterial: data.nomeMaterial
      });
    } catch (error) {
      console.error("Erro ao carregar o último registro:", error.message);
    }
  };

  useEffect(() => {
    carregarDados();
    carregarUltimoRegistro();
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.resultContainer}>
        <Text style={styles.title}>Resultado do Cálculo de Usinagem</Text>
       
        <View style={styles.result}>
          <Text><Text style={styles.bold}>Nome: </Text>{ultimoRegistro.nomePeca}</Text>
        </View>
        <View style={styles.result}>
          <Text><Text style={styles.bold}>Código: </Text>{ultimoRegistro.codigoPeca}</Text>
        </View>
        <View style={styles.result}>
          <Text><Text style={styles.bold}>Material: </Text>{ultimoRegistro.nomeMaterial}</Text>
        </View>
        <View style={styles.result}>
          <Text><Text style={styles.bold}>Resultado: </Text>{resultado}</Text>
        </View>
        <TouchableOpacity style={styles.historyButton} onPress={() => setMostrarHistorico(true)}>
          <Text style={styles.link}>Ver histórico de cálculos</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={mostrarHistorico} animationType="slide">
        <View style={styles.historyModalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setMostrarHistorico(false)}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
          <Text style={styles.historyTitle}>Histórico:</Text>
          <FlatList
             data={historico}
             keyExtractor={(item) => item.id.toString()}
             renderItem={({item}) => (
               <Text style={styles.historyItem}>{`${console.log(item)}, ${item.nomePeca}, ${item.operacao}: ${item.numero1}, ${item.numero2} = ${item.resultado.toFixed(3)}`}</Text>
             )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#001F3F",
  },
  resultContainer: {
    maxWidth: 600,
    margin: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1.5,
    shadowRadius: 10,
    padding: 20,
    paddingLeft: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    color: "#333",
    marginBottom: 20,
    fontWeight: "bold",
  },
  result: {
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  bold: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 15,
  },
  historyButton: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
    fontWeight: "bold",
    fontSize: 15,
  },
  historyModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "#fff",
  },
  closeButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 10,
    backgroundColor: "black", // Cor de fundo preta
    color: "white", // Cor do texto branco
    borderRadius: 50, // Define o botão como redondo
  },
  closeButtonText: {
    fontSize: 18,
    color: "white",
  },
  historyTitle: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: "lightgray",
    fontSize: 16,
    marginBottom: 5,
    width: 600,
    borderRadius: 5,
    height: 105,
  },
});

export default ResultadoCalculoUsinagem;
