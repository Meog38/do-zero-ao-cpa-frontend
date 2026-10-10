# Do Zero ao CPA - Situacao Atual e Roadmap

## 1. Ideia Original Do Projeto

A proposta nao e ser apenas um simulado da CPA. A ideia central e criar uma trilha gamificada de alfabetizacao financeira que faz a ponte entre situacoes cotidianas e conceitos tecnicos de investimentos/CPA.

Fluxo pedagogico desejado:

```text
cotidiano -> explicacao curta -> pratica -> situacao mais complexa -> conceito financeiro/CPA -> proximo nivel
```

O produto deve comecar com decisoes simples, como organizar salario, cartao, gastos e reserva, e evoluir gradualmente ate perguntas com linguagem mais proxima da certificacao CPA.

Argumento central do projeto:

```text
"Eu gasto dinheiro" -> "eu organizo meu dinheiro" -> "eu entendo investimentos" -> "eu consigo interpretar conceitos da CPA"
```

## 2. O Que Ja Esta Implementado

### Produto/Frontend

- Nome atual: Do Zero ao CPA (antes: Brainvest).
- Aplicacao gamificada com visual proprio, mascote, trilha, missoes e progresso.
- Fluxo de cadastro e login com email/senha.
- Tela de objetivo do usuario.
- Mapa de aprendizagem com 5 niveis.
- Tela de desafio com perguntas de multipla escolha.
- Tela de resultado com XP, vidas, streak, feedback e conceito-chave.
- Tela de conquistas.
- Tela de perfil com nome, email, objetivo, XP, missoes e acoes de conta.

### Conteudo Pedagogico

Ja existe uma trilha de 5 niveis:

1. Minha vida financeira
2. Antes de investir
3. Comecando a investir
4. Pensando como investidor
5. Desafio CPA

O app ja tem cerca de 25 questoes distribuidas nesses niveis. A estrutura esta alinhada com a ideia original: comeca no cotidiano e avanca para prazo, liquidez, risco, adequacao, produtos e casos integrados.

### Gamificacao

Ja existe:

- XP
- Vidas
- Streak
- Gemas
- Missoes
- Conquistas
- Bloqueio/progressao por nivel
- Feedback apos resposta
- Recompensa por missao concluida

### Backend/Banco/Deploy

- Backend Spring Boot em producao no Render.
- Banco Neon Postgres em producao.
- Autenticacao com usuarios, senha com hash BCrypt e sessoes por token.
- Progresso salvo no banco para contas logadas.
- Endpoints de curriculo, perfil, progresso, respostas, reinicio de missao e auth.
- Frontend publicado/sincronizado via Lovable/GitHub.

## 3. Principais Lacunas Para Concluir A Ideia

### Alta Prioridade

1. Refinar o conteudo pedagogico.

O app ja tem a estrutura correta, mas o maior valor do projeto esta no conteudo. As perguntas precisam ficar mais intencionais, com uma progressao muito clara:

- pergunta cotidiana
- explicacao curta
- nova pergunta um pouco mais tecnica
- conexao explicita com conceito CPA
- caso final por missao

O ideal e revisar cada nivel e garantir que cada pergunta ensina algo, nao apenas testa.

2. Melhorar as missoes encadeadas.

A ideia original fala de casos como "O primeiro salario de Lucas". O app ja usa missoes, mas pode reforcar melhor a continuidade narrativa:

- apresentar o personagem no inicio da missao
- manter o mesmo caso ao longo das 5 perguntas
- mostrar como cada resposta muda a situacao
- fechar a missao com resumo do aprendizado

3. Fortalecer o feedback de erro.

Hoje o feedback existe, mas pode ficar mais parecido com a proposta:

- explicar por que a alternativa errada parece tentadora
- reforcar o conceito-chave
- apresentar uma microdica antes da proxima tentativa
- evitar tom punitivo

4. Melhorar a experiencia de conta.

Ja existe login, mas ainda faltam coisas basicas:

- alterar senha
- recuperar senha ou fluxo manual de reset
- separar claramente "sair" de "apagar conta"
- confirmar exclusao de conta com mais cuidado
- mostrar status de sincronizacao do progresso

5. Revisao visual e textual final.

Antes da entrega, fazer uma rodada de polimento:

- procurar textos quebrados/acentos
- revisar responsividade mobile
- revisar estados de loading/erro
- garantir que botoes e cards nao estourem texto
- testar em aba anonima

## 4. Media Prioridade

1. Historico de respostas.

Guardar e mostrar:

- perguntas respondidas
- acertos e erros
- conceito associado
- data/hora
- revisoes recomendadas

Isso ajuda a mostrar que o app nao e apenas um quiz, mas uma ferramenta de aprendizagem.

2. Ranking ou progresso comparativo.

Pode ser interessante, mas com cuidado. Ranking pode motivar, mas tambem pode virar distracao.

Mais valioso que ranking puro:

- progresso pessoal
- conquistas por conceito
- "voce melhorou em liquidez"
- "revise risco x retorno"

3. Painel simples para mentor/professor.

Para impressionar na apresentacao, um painel administrativo simples teria muito valor:

- total de usuarios
- missoes concluidas
- media de XP
- conceitos com mais erro
- progresso por aluno

Nao precisa ser sofisticado. Um dashboard basico ja comunica impacto.

4. Mais conteudo CPA.

O nivel 5 pode ter mais casos integrados e linguagem um pouco mais tecnica, mas sem transformar o produto em apostila/simulado tradicional.

## 5. Baixa Prioridade Ou Nao Vale Agora

1. Simulado completo da CPA.

Nao vale a pena para o MVP. Desvia da proposta principal, que e fazer a ponte pedagogica entre cotidiano e conceitos tecnicos.

2. Comunidade/chat entre usuarios.

Complexo, moderacao dificil e pouco essencial para a entrega.

3. Pagamentos, planos premium ou monetizacao.

Totalmente fora do escopo atual.

4. App mobile nativo.

O app web responsivo ja atende a entrega. Fazer app nativo agora aumentaria muito o escopo.

5. Inteligencia artificial generativa dentro do app.

Pode ser interessante no futuro, mas agora adiciona risco, custo e imprevisibilidade. Melhor entregar uma trilha bem escrita e estavel.

6. Muitas mecanicas de jogo.

Nao copiar Duolingo inteiro. O projeto precisa de poucas mecanicas bem aplicadas: XP, vidas, streak, conquistas e mapa.

## 6. O Que Mais Vale A Pena Fazer Agora

### Caminho Recomendado Para Um MVP Forte

1. Revisar e melhorar as 25 perguntas existentes.

Esse e o maior ganho por tempo investido. A banca/mentores vao perceber se a trilha tem intencao pedagogica real.

2. Reescrever cada missao como um caso unico.

Exemplo:

- Nivel 1: primeiro salario de Lucas
- Nivel 2: reserva de emergencia de Marina
- Nivel 3: primeiros investimentos de Ana
- Nivel 4: perfil e objetivos de Bia
- Nivel 5: caso integrado estilo CPA com Rafael

3. Criar uma tela/resumo ao fim de cada missao.

Mostrar:

- conceito aprendido
- erro mais importante
- recomendacao de revisao
- proximo passo da trilha

4. Criar dashboard simples de progresso.

Pode ficar na tela de perfil:

- XP total
- missoes concluidas
- conceitos dominados
- conceitos para revisar

5. Preparar roteiro de demo.

Para a apresentacao, o ideal e mostrar uma unica ideia evoluindo:

```text
reserva de emergencia cotidiana -> liquidez -> produto com carencia -> pergunta estilo CPA
```

Isso comunica a proposta melhor do que mostrar todas as telas.

## 7. Checklist Para Entrega

### Produto

- [x] Frontend publicado
- [x] Backend publicado
- [x] Banco em producao
- [x] Cadastro e login
- [x] Progresso persistente no banco
- [x] Trilha com 5 niveis
- [x] Gamificacao basica
- [ ] Revisao pedagogica das perguntas
- [ ] Missoes com narrativa mais forte
- [ ] Tela de resumo de missao
- [ ] Melhorar feedback de erro
- [ ] Revisao visual/mobile final

### Seguranca/Conta

- [x] Senha com hash
- [x] Sessao por token
- [x] Progresso vinculado a usuario
- [ ] Alterar senha
- [ ] Recuperar senha
- [ ] Limpeza de sessoes expiradas
- [ ] Rate limit basico para login/cadastro

### Apresentacao

- [ ] Definir narrativa do problema
- [ ] Explicar a ponte cotidiano -> CPA
- [ ] Preparar demo de 2 minutos
- [ ] Mostrar arquitetura atual: Lovable + Render + Neon
- [ ] Mostrar roadmap de continuidade para proximas turmas

## 8. Melhor Proximo Sprint

Se houver pouco tempo, o melhor sprint e:

1. Revisar conteudo dos 5 niveis.
2. Criar resumo de missao.
3. Melhorar feedback de erro.
4. Polir perfil/progresso.
5. Preparar roteiro de apresentacao.

Isso entrega o que mais diferencia o projeto: nao e um quiz, e uma trilha educativa que aproxima jovens da linguagem financeira tecnica.
