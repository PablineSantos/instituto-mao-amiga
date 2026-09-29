# Roteiro de Demonstração (Até 3 Minutos)

Este roteiro foi elaborado para guiar a apresentação e defesa do aplicativo **Instituto Mão Amiga**.

---

## ⏱️ Cronograma da Apresentação (3 minutos)

| Tempo | Etapa | Ação principal |
|---|---|---|
| **0:00 - 0:30** | 1. Registro de Doação | Cadastrar uma nova doação vinculada a um ponto de coleta |
| **0:30 - 1:00** | 2. Histórico e Resumo | Navegar até "Minhas Doações", exibir totais agregados e lista |
| **1:00 - 1:30** | 3. Busca e Filtro | Filtrar por tipo de item em tempo real e testar busca vazia |
| **1:30 - 2:00** | 4. Edição de Doação | Acessar detalhe, editar quantidade reaproveitando o formulário |
| **2:00 - 2:30** | 5. Exclusão de Doação | Abrir detalhe, acionar exclusão com confirmação via alerta |
| **2:30 - 2:45** | 6. Persistência Local | Fechar e reabrir o app comprovando a persistência |
| **2:45 - 3:00** | 7. Defesa Técnica | Explicar as decisões de arquitetura e armazenamento |

---

## 📋 Passo a Passo Detalhado

### Passo 1: Registrar Doação (0:00 - 0:30)
1. Na tela inicial ("Pontos de Coleta"), preencher o formulário:
   - **Tipo do item:** `Cesta Básica`
   - **Quantidade:** `10`
   - **Ponto de destino:** `Ponto Universitário` (ou selecionar na lista).
2. Tocar no botão **"Registrar Doação"** (área de toque >= 44x44 px).
3. Confirmar o alerta de sucesso e observar a atualização do total de alimentos no card do ponto correspondente.

### Passo 2: Ver o Histórico e Resumo (0:30 - 1:00)
1. Tocar no botão **"Minhas Doações"** (no cabeçalho superior direito ou abaixo do formulário).
2. Destacar no topo o card **"Resumo por Tipo"**:
   - Exemplo: `Cesta Básica: 10 unidades em 1 doação`.
   - Explicar que os tipos são ordenados da maior quantidade para a menor.
3. Mostrar a lista com `FlatList` contendo o item cadastrado com data e hora formatadas em padrão pt-BR.

### Passo 3: Filtrar Doações (1:00 - 1:30)
1. Tocar no campo de busca no topo da tela (o teclado abre sem cobrir o campo ou a lista).
2. Digitar `cesta`: a lista exibe apenas o item correspondente (busca insensível a maiúsculas/minúsculas).
3. Digitar um termo inexistente (ex: `cobertor`):
   - A lista exibe o estado vazio informativo: `"Nenhuma doação encontrada para 'cobertor'"`.
4. Tocar no botão **"✕"** ou em **"Limpar busca"** para restaurar a lista completa.

### Passo 4: Editar Doação (1:30 - 2:00)
1. Tocar no card da doação para abrir a tela de **Detalhes da Doação**.
2. Tocar no botão **"Editar Doação"**:
   - O app redireciona para a tela inicial reaproveitando o formulário existente, com o título alterado para **"Editar Doação"** e os campos pré-preenchidos.
3. Alterar a quantidade de `10` para `15` e tocar em **"Salvar Alterações"**.
4. Retornar ao histórico e detalhe, comprovando que o mesmo registro (`id` preservado) foi atualizado para 15 unidades e o resumo foi recalculado.

### Passo 5: Excluir Doação (2:00 - 2:30)
1. Na tela de **Detalhes da Doação**, tocar em **"Excluir Doação"**.
2. Demonstrar o diálogo nativo de confirmação (`Alert.alert`):
   - Tocar em **"Cancelar"**: nada é apagado.
   - Tocar em **"Excluir"**: o registro é removido do `AsyncStorage`.
3. O app retorna automaticamente para o histórico, onde o item não aparece mais e o resumo é reajustado.

### Passo 6: Fechar e Reabrir o App (2:30 - 2:45)
1. Recarregar o bundle (pressionar `r` no terminal) ou reiniciar o app.
2. Navegar novamente para **"Minhas Doações"** e demonstrar que o estado vazio ou as doações existentes persistiram corretamente no `AsyncStorage`.

---

## 💡 Defesa Técnica e Decisões de Arquitetura

### 1. Por que os totais são calculados em tempo de execução e não salvos à parte?
- **Única Fonte da Verdade (*Single Source of Truth*):** O array de doações é a fonte primária dos dados. Se os totais fossem persistidos em uma chave separada no armazenamento, qualquer edição, exclusão ou falha de escrita causaria inconsistência de dados (dessincronização).
- **Desempenho com `useMemo`:** O cálculo de agregação (agrupamento e ordenação decrescente) é linear $O(N)$ e é memorizado via `useMemo`, sendo recalculado apenas quando o array `doacoes` sofre alterações.

### 2. Por que o acesso ao armazenamento ficou encapsulado em um arquivo só (`doacoesStorage.ts`)?
- **Desacoplamento e Responsabilidade Única:** As telas da interface gráfica não precisam conhecer os detalhes de serialização JSON, chaves do `AsyncStorage` ou tratamento de exceções de I/O.
- **Manutenibilidade e Testabilidade:** Caso seja necessário migrar o armazenamento para SQLite, WatermelonDB ou uma API REST no futuro, apenas o módulo `doacoesStorage.ts` precisará ser modificado, sem quebrar nenhuma tela do app.

---

## 📱 Verificações de Usabilidade e Acessibilidade
- **Área mínima de toque:** Todos os botões, itens de lista e controles interativos possuem área de toque de no mínimo 44x44 pixels.
- **Teclado:** Uso de `KeyboardAvoidingView` e `keyboardShouldPersistTaps="handled"` garantindo que campos de busca e formulários não fiquem ocultos pelo teclado virtual.
- **Adaptação a telas:** Layout fluido com `flex`, `ScrollView` e `FlatList`, testado contra quebras de linha e overflow em telas compactas e amplas.
