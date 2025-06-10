# Aplicativo de Monitoramento de Sensores - Digital Twin

## Aplicativo Mobile para Monitoramento de Sensores Industriais

**Disciplina:** Advanced Programming And Mobile Dev

## Descrição do Projeto

Este aplicativo mobile foi desenvolvido com **React Native** utilizando **Expo**, como parte da Entrega 1 de um projeto de Digital Twin. Seu objetivo é simular o monitoramento de sensores de um sistema industrial, permitindo visualizar uma lista de sensores com seus valores e status, consultar detalhes e exibir um gráfico de histórico simulado. Ele também permite configurar a URL de um backend local (mock via `json-server`).

### Funcionalidades Principais

- **Visualização de Sensores Industriais**: Lista com nome, valor atual e status (ok, aviso, alerta).
- **Detalhes do Sensor**: Tela com botão de atualização de valor e gráfico com histórico simulado.
- **Histórico em Gráfico**: Apresentação visual das últimas leituras com `react-native-chart-kit`.
- **Configuração de API**: Tela onde o usuário pode salvar e testar a URL da API local.
- **Persistência Local**: A URL da API fica salva mesmo após reiniciar o app via AsyncStorage.

## Estrutura do Aplicativo

O aplicativo é composto por 5 telas principais:

1. **Tela de Login**:
2. **Lista de Sensores**: FlatList com sensores, nome, valor e status.
3. **Detalhes do Sensor**: Exibe dados do sensor e botão para atualizar valor simulado.
4. **Histórico do Sensor**: Gráfico com 7 valores aleatórios simulando um histórico.
5. **Configurações**: Campo para definir URL da API e botão para testar conexão.

## Tecnologias Utilizadas

- **React Native** (Expo)
- **React Navigation** (`@react-navigation/native`, stack)
- **Axios** para requisições HTTP
- **AsyncStorage** para armazenamento local
- **react-native-chart-kit** para exibição de gráficos
- **json-server** para simular o backend com dados mock

## Arquitetura do Projeto

- **mock/**: Contém `sensors.json` com os dados simulados.
- **navigation/**: `AppNavigator.tsx` com a configuração das rotas.
- **screens/**: Telas do app (`SensorListScreen`, `SensorDetailScreen`, `SensorHistoryScreen`, `ConfigScreen`, `LoginScreen`).
- **App.tsx**: Arquivo principal do app.
- **package.json**: Dependências e scripts do projeto.

## Instalação e Execução

1. Clone o repositório:
   ```
   git clone https://github.com/totagoma/Aplicativo-Frontend-em-React-Native.git
   ```

2. Acesse a pasta:
   ```
   cd Aplicativo-Frontend-em-React-Native
   ```

3. Instale as dependências:
   ```
   npm install
   ```

4. Inicie o mock da API:
   ```
   npm install -g json-server
   json-server --watch mock/sensors.json --port 3000
   ```

5. Execute o aplicativo:
   ```
   npm start
   ```

6. Abra o app Expo Go no celular e escaneie o QR Code exibido no terminal/navegador.

7. Na tela de configurações do app, insira a URL da API:
   ```
   http://SEU_IP_LOCAL:3000
   ```
   Exemplo: `http://192.168.15.17:3000`

8. Clique em **Testar Conexão** para verificar se a API está ativa.

## Dados Mock (mock/sensors.json)

```json
{
  "sensores": [
    {
      "id": "1",
      "nome": "Reed Switch",
      "status": "ok",
      "valor": 34.5
    },
    {
      "id": "2",
      "nome": "Pressão Absoluta",
      "status": "alerta",
      "valor": 78.1
    }
    // ... outros sensores
  ]
}
```

## Integrantes do Grupo

- Pedro Lopes Domingues RM: 99628  
- Mateus Fairbanks RM: 98202  
- Felipe Pereira de Assis RM: 98187
- Enzo Shoji Teixeira Konishi RM:99828 
- Bruno Miziara Fittipaldi Morade RM:99911

## Licença
Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
