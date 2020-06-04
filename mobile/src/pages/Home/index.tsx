import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { ImageBackground, View, StyleSheet, Text,  Image, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import { Roboto_900Black } from '@expo-google-fonts/roboto';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}


const Home: React.FC = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);

      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      const citiesName = response.data.map(city => city.nome);

      setCities(citiesName);
    });
  }, [selectedUf]);

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    if(selectedUf === '0' || selectedCity === '0'){
      return Alert.alert("Preencha todos os campo", "Por favor, selecione uma UF e uma cidade.")
    }

    navigation.navigate('Points', {
      selectedUf,
      selectedCity,
    });
  }

  return (
    
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta eficientes.</Text>
          </View>
        </View>

        <View style={styles.footer}>

          <RNPickerSelect
            onValueChange={(value) => setSelectedUf(value)}
            items={
              ufs.map(uf => (
                {
                  label: uf,
                  value: uf,
                  key: uf,
                }
              ))
            }
            placeholder={{ 
              label: "Selecione uma UF",
              value: null,
              color: '#000',
            }}
            style={styles}
          />

          <RNPickerSelect
            onValueChange={(value) => setSelectedCity(value)}
            items={
              cities.map(cities => (
                {
                  label: cities,
                  value: cities,
                  key: cities,

                }
              ))
            }
            disabled={selectedUf === '0' ? true : false}

            placeholder={{
              label: "Selecione uma Cidade",
              value: null,
            }}

            style={styles}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text >
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>
      </ImageBackground>

  );
}

export default Home;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  inputAndroid: {
    color: 'black',
    marginBottom: 8,
  },

  inputIOS:{
    color: 'black',
    marginBottom: 8,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});