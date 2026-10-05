# Instituto Mão Amiga
Um aplicativo mobile em React Native e Expo para o Instituto Mão Amiga, focado em digitalizar a logística e histórico de doações.

## 📱 Roteiro de Demonstração (Até 3 Minutos)

Para o roteiro completo detalhado, consulte também [ROTEIRO_DEMONSTRACAO.md](./ROTEIRO_DEMONSTRACAO.md).

1. **Registrar Doação (0:00 - 0:30):**
   - Na tela inicial ("Pontos de Coleta"), preencher tipo do item, quantidade e ponto de destino no formulário.
   - Pressionar "Registrar Doação" e confirmar a mensagem de sucesso e a atualização do ponto.
2. **Ver Histórico e Resumo (0:30 - 1:00):**
   - Acessar "Minhas Doações" pelo botão no cabeçalho ou após o formulário.
   - Observar o card de "Resumo por Tipo" com os totais ordenados por maior quantidade e a lista via `FlatList`.
3. **Filtrar Doações (1:00 - 1:30):**
   - Digitar no campo de busca para filtrar por tipo de item em tempo real (sem distinção de maiúsculas/minúsculas).
   - Testar busca sem resultados para conferir a mensagem informativa com o termo buscado e limpar a busca.
4. **Editar Doação (1:30 - 2:00):**
   - Tocar em um item do histórico para abrir a tela de Detalhes.
   - Tocar em "Editar Doação", alterar a quantidade no formulário reutilizado e salvar.
   - Conferir a atualização imediata no detalhe e no resumo.
5. **Excluir Doação (2:00 - 2:30):**
   - Na tela de Detalhes, tocar em "Excluir Doação".
   - Demonstrar o alerta de confirmação: "Cancelar" não apaga nada; "Excluir" remove do `AsyncStorage` e atualiza a lista.
6. **Fechar e Reabrir o App (2:30 - 2:45):**
   - Recarregar/reiniciar o app e verificar a persistência dos dados salvos no `AsyncStorage`.
7. **Defesa / Decisão Técnica (2:45 - 3:00):**
   - Explicar por que os totais são calculados em tempo de execução via `useMemo` (garantia de fonte única da verdade e eliminação de inconsistências) e por que o acesso ao armazenamento é isolado em `doacoesStorage.ts` (desacoplamento e facilidade de manutenção/testes).

---
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


