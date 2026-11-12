# Instituto MÃ£o Amiga

App React Native/Expo que consome uma API Spring Boot (pasta [`api/`](./api), endpoints em [`api/README.md`](./api/README.md)).

## Como rodar

**API** (Java 17+; testada no JDK 25, Maven 3.9):

```bash
cd api
mvn spring-boot:run
```

Swagger: http://localhost:8080/swagger-ui.html

**App:**

```bash
npm install
npx expo start
```

**Onde trocar o IP:** a URL da API vem da variÃ¡vel `EXPO_PUBLIC_API_URL` (arquivo `.env`, ex.: `EXPO_PUBLIC_API_URL=http://192.168.0.10:8080`). Sem ela, usa `http://localhost:8080` (serve para o navegador). No celular use o IP do computador na rede local.

## Roteiro de demonstraÃ§Ã£o (atÃ© 3 minutos)

1. **Pontos (0:00â€“1:00):** buscar por bairro; "+ Novo ponto" (cadastrar); abrir o ponto e "Editar ponto"; "Excluir ponto" (confirmaÃ§Ã£o Cancelar/Excluir).
2. **Favoritos (1:00â€“1:20):** tocar no â™¡ de um ponto; abrir "â™¥ Meus pontos"; desmarcar.
3. **DoaÃ§Ãµes (1:20â€“2:20):** "Minhas doaÃ§Ãµes" â†’ "+ Nova doaÃ§Ã£o" escolhendo o ponto; ver no topo; filtrar por tipo; abrir, "Editar doaÃ§Ã£o", "Excluir doaÃ§Ã£o".
4. **Erros da API (2:20â€“2:45):** no Swagger mostrar um 400 (campo vazio / quantidade 0) e um 404 (id inexistente); desligar a API e mostrar a mensagem no app.
5. **DecisÃ£o tÃ©cnica (2:45â€“3:00):** favoritos ficam no aparelho (AsyncStorage, sÃ³ os ids) porque sÃ£o preferÃªncia pessoal e nÃ£o precisam de servidor; pontos e doaÃ§Ãµes ficam no servidor para serem compartilhados e validados em um sÃ³ lugar.

Camadas de rede: sÃ³ `src/services/api.ts` chama `fetch`; `pontosService.ts` e `doacoesService.ts` montam as URLs; as telas sÃ³ chamam os services.
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

