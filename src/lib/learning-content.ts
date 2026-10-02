export type LearningTone = "mint" | "coral" | "butter" | "ink";

export type LearningOption = { id: string; text: string };

export type LearningQuestion = {
  id: string;
  context: string;
  prompt: string;
  concept: string;
  options: LearningOption[];
  correctOptionId: string;
  correctFeedback: string;
  incorrectFeedback: string;
};

export type LearningLevel = {
  id: number;
  title: string;
  emoji: string;
  tone: LearningTone;
  description: string;
  missionTitle: string;
  missionBrief: string;
  missionSummary: string;
  questions: LearningQuestion[];
};

const LEARNING_LEVELS_SOURCE: LearningLevel[] = [
  {
    id: 1,
    title: "Minha vida financeira",
    emoji: "🧾",
    tone: "mint",
    description: "Entenda para onde seu dinheiro vai e tome decisões melhores no dia a dia.",
    missionTitle: "Missão: o primeiro salário de Lucas",
    missionBrief:
      "Lucas tem 19 anos, recebe R$ 2.400 líquidos e gasta R$ 1.700 por mês. Ele quer se organizar sem deixar de aproveitar a vida.",
    missionSummary: "Lucas fechou o mes entendendo renda, gastos essenciais, desejos e juros do cartao. A ponte com CPA e clara: antes de produto financeiro, vem diagnostico, orcamento e decisao adequada ao objetivo.",
    questions: [
      {
        id: "l1-q1",
        context: "Organização do mês",
        prompt: "Qual é o primeiro passo para Lucas descobrir quanto pode guardar?",
        concept: "Orçamento",
        options: [
          { id: "A", text: "Anotar renda e gastos por um mês" },
          { id: "B", text: "Investir todo o saldo da conta hoje" },
          { id: "C", text: "Cancelar todos os momentos de lazer" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Isso. Registrar entradas e saídas mostra o que já está comprometido e quanto cabe nos planos.",
        incorrectFeedback:
          "Antes de decidir quanto guardar ou cortar, Lucas precisa saber para onde o dinheiro está indo. Um orçamento começa com esse retrato.",
      },
      {
        id: "l1-q2",
        context: "Necessidade ou desejo",
        prompt:
          "A geladeira de Lucas quebrou. Ele também queria trocar o celular, que ainda funciona. Qual gasto tende a ser prioridade?",
        concept: "Priorização de gastos",
        options: [
          { id: "A", text: "Trocar o celular, porque era o plano inicial" },
          { id: "B", text: "Resolver a geladeira e reavaliar o celular" },
          { id: "C", text: "Parcelar os dois sem olhar o orçamento" },
        ],
        correctOptionId: "B",
        correctFeedback:
          "Boa. Necessidades urgentes vêm antes de desejos que podem esperar, considerando os recursos disponíveis.",
        incorrectFeedback:
          "Um plano pode mudar quando surge uma necessidade essencial. Adiar um desejo ajuda a evitar dívida e manter o orçamento sob controle.",
      },
      {
        id: "l1-q3",
        context: "Cartão de crédito",
        prompt:
          "A fatura de Lucas é R$ 1.400 e vence hoje. Ele tem o valor na conta e nenhuma despesa urgente antes do próximo salário. O que tende a evitar juros?",
        concept: "Pagamento da fatura",
        options: [
          { id: "A", text: "Pagar o valor mínimo" },
          { id: "B", text: "Pagar a fatura integralmente" },
          { id: "C", text: "Esperar o próximo mês sem avisar o banco" },
        ],
        correctOptionId: "B",
        correctFeedback:
          "Correto. Pagar o total até o vencimento evita financiar o saldo da fatura no crédito rotativo.",
        incorrectFeedback:
          "O pagamento mínimo não quita a fatura: o saldo restante pode gerar juros. Como Lucas tem o valor disponível, pagar o total evita esse financiamento.",
      },
      {
        id: "l1-q4",
        context: "Juros no cartão",
        prompt: "Lucas pagou só parte da fatura. O que acontece com o restante, em geral?",
        concept: "Crédito rotativo",
        options: [
          { id: "A", text: "É automaticamente perdoado no mês seguinte" },
          { id: "B", text: "Pode entrar no crédito rotativo e gerar juros" },
          { id: "C", text: "Vira uma compra parcelada sem custo" },
        ],
        correctOptionId: "B",
        correctFeedback:
          "Isso. O saldo não pago pode ser financiado com juros; vale procurar alternativas de renegociação antes que a dívida cresça.",
        incorrectFeedback:
          "Pagar menos que o total não elimina a diferença. O saldo pode ser financiado e gerar encargos, então é importante agir cedo.",
      },
      {
        id: "l1-q5",
        context: "Decisão do mês",
        prompt:
          "Depois de anotar os gastos, Lucas percebe que assinaturas pouco usadas consomem R$ 90 por mês. Qual decisão é mais consistente com o objetivo de guardar dinheiro?",
        concept: "Ajuste de orçamento",
        options: [
          { id: "A", text: "Cancelar ou rever as assinaturas e reservar o valor" },
          { id: "B", text: "Ignorar os gastos pequenos porque não fazem diferença" },
          { id: "C", text: "Usar o limite do cartão para cobrir o mês" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Missão cumprida. Pequenos gastos recorrentes podem somar; direcionar o valor liberado para uma meta torna o plano concreto.",
        incorrectFeedback:
          "Gastos recorrentes se acumulam. Rever o que tem pouco valor para Lucas pode liberar dinheiro sem cortar o que é importante.",
      },
    ],
  },
  {
    id: 2,
    title: "Antes de investir",
    emoji: "🛟",
    tone: "coral",
    description: "Prepare uma base: objetivos, prazo, reserva, inflação e acesso ao dinheiro.",
    missionTitle: "Missão: a viagem e a reserva de Marina",
    missionBrief:
      "Marina está guardando dinheiro para uma viagem daqui a dois meses e também quer montar uma reserva para imprevistos.",
    missionSummary: "Marina separou dinheiro de curto prazo da reserva e percebeu que liquidez, prazo e inflacao mudam a escolha. Essa e a base para analisar adequacao antes de comparar rentabilidade.",
    questions: [
      {
        id: "l2-q1",
        context: "Objetivo e prazo",
        prompt:
          "Marina separou R$ 300 para uma viagem daqui a dois meses. O que ela deve considerar antes de escolher onde guardar?",
        concept: "Objetivo e horizonte",
        options: [
          { id: "A", text: "O prazo curto e a data em que vai precisar do dinheiro" },
          { id: "B", text: "Apenas a maior rentabilidade anunciada" },
          { id: "C", text: "Somente o nome mais conhecido do produto" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Certo. O prazo do objetivo orienta quanto risco faz sentido e quando o dinheiro precisa estar disponível.",
        incorrectFeedback:
          "A maior taxa não basta. Para um objetivo próximo, a data de uso e a possibilidade de resgatar são essenciais.",
      },
      {
        id: "l2-q2",
        context: "Reserva de emergência",
        prompt:
          "Marina começa a formar uma reserva para despesas inesperadas. Qual característica costuma ser importante para esse dinheiro?",
        concept: "Liquidez",
        options: [
          { id: "A", text: "Poder acessar o recurso quando surgir uma emergência" },
          { id: "B", text: "Ficar bloqueado por vários anos em troca de uma taxa maior" },
          { id: "C", text: "Variar muito de preço todos os dias" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Exato. Liquidez é a facilidade e o prazo para transformar um investimento em dinheiro disponível.",
        incorrectFeedback:
          "Uma reserva pode ser necessária sem aviso. Por isso, liquidez e estabilidade são relevantes; carência longa pode não combinar com essa finalidade.",
      },
      {
        id: "l2-q3",
        context: "Inflação",
        prompt:
          "Os preços sobem ao longo do ano. Se o dinheiro de Marina rende menos que essa alta, o que pode ocorrer?",
        concept: "Poder de compra",
        options: [
          { id: "A", text: "O saldo nominal cresce, mas compra menos coisas" },
          { id: "B", text: "O poder de compra sempre aumenta" },
          { id: "C", text: "A inflação cancela automaticamente os juros" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Isso. O rendimento nominal não conta a história toda: é preciso considerar a variação dos preços para entender o ganho real.",
        incorrectFeedback:
          "O saldo pode aumentar em reais e ainda assim perder poder de compra se os preços subirem mais.",
      },
      {
        id: "l2-q4",
        context: "Reserva adequada ao objetivo",
        prompt:
          "Marina tem R$ 10.000 reservados para emergências e analisa um produto com carência de dois anos. Qual ponto merece atenção primeiro?",
        concept: "Liquidez e carência",
        options: [
          { id: "A", text: "Se conseguirá acessar o dinheiro antes do fim da carência" },
          { id: "B", text: "Se o produto tem o maior nome da prateleira" },
          { id: "C", text: "Se a carência torna o investimento livre de riscos" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Boa leitura. Uma carência longa pode conflitar com a finalidade de uma reserva que talvez precise ser usada rapidamente.",
        incorrectFeedback:
          "Carência não significa ausência de risco nem combina automaticamente com qualquer objetivo. Para a reserva, disponibilidade é central.",
      },
      {
        id: "l2-q5",
        context: "Plano para começar",
        prompt:
          "Marina ainda não tem reserva e quer começar a investir para uma meta de longo prazo. Qual abordagem é mais cuidadosa?",
        concept: "Planejamento financeiro",
        options: [
          { id: "A", text: "Definir prioridades, criar uma reserva acessível e planejar a meta" },
          { id: "B", text: "Aplicar tudo em um produto difícil de resgatar" },
          { id: "C", text: "Escolher um investimento só pela rentabilidade passada" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Missão concluída. Separar objetivos por prazo ajuda a não depender de um investimento de longo prazo numa emergência.",
        incorrectFeedback:
          "Uma estratégia começa pelas necessidades e pelos prazos. Rentabilidade passada não garante resultados futuros e não substitui uma reserva.",
      },
    ],
  },
  {
    id: 3,
    title: "Começando a investir",
    emoji: "🌱",
    tone: "butter",
    description: "Conheça renda fixa, títulos públicos, CDBs, fundos e renda variável.",
    missionTitle: "Missão: escolher sem cair no nome bonito",
    missionBrief:
      "Depois de organizar a reserva, Pedro compara produtos de investimento. Cada escolha precisa combinar com o funcionamento e o prazo do produto.",
    missionSummary: "Pedro saiu do nome do produto e passou a olhar emissor, regra de remuneracao, cotas, prazo e risco. E esse olhar que prepara para a linguagem de investimentos da CPA.",
    questions: [
      {
        id: "l3-q1",
        context: "Renda fixa",
        prompt: "Ao ouvir que um investimento é de renda fixa, qual interpretação é mais adequada?",
        concept: "Renda fixa",
        options: [
          {
            id: "A",
            text: "As regras de remuneração são definidas no início, mas o resultado pode depender das condições do produto",
          },
          { id: "B", text: "O investimento não tem risco e sempre rende o mesmo valor" },
          { id: "C", text: "O investidor recebe participação nos lucros de uma empresa" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Correto. Renda fixa descreve regras de remuneração; não é sinônimo de retorno garantido ou ausência de risco.",
        incorrectFeedback:
          "Renda fixa não quer dizer risco zero. Prazo, emissor, indexador e condições de resgate ainda importam.",
      },
      {
        id: "l3-q2",
        context: "CDB",
        prompt: "Um CDB é emitido por qual tipo de instituição?",
        concept: "Certificado de Depósito Bancário",
        options: [
          { id: "A", text: "Um banco ou outra instituição financeira emissora" },
          { id: "B", text: "O Tesouro Nacional em nome do governo federal" },
          { id: "C", text: "Uma bolsa de valores em nome do investidor" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Isso. No CDB, o investidor empresta recursos à instituição emissora conforme as condições contratadas.",
        incorrectFeedback:
          "CDB significa Certificado de Depósito Bancário: é emitido por uma instituição financeira, não pelo Tesouro ou pela bolsa.",
      },
      {
        id: "l3-q3",
        context: "Tesouro Direto",
        prompt:
          "Ao comprar um título público pelo Tesouro Direto, a quem o investidor está emprestando recursos?",
        concept: "Títulos públicos",
        options: [
          { id: "A", text: "Ao governo federal, conforme as regras do título" },
          { id: "B", text: "A uma empresa privada escolhida pela corretora" },
          { id: "C", text: "A outros investidores sem intermediação" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Certo. Títulos públicos são emitidos pelo Tesouro Nacional; cada título tem regras próprias de remuneração e vencimento.",
        incorrectFeedback:
          "No Tesouro Direto, o título é público e emitido pelo Tesouro Nacional. Ainda é preciso entender prazo e oscilação em resgates antecipados.",
      },
      {
        id: "l3-q4",
        context: "Fundos de investimento",
        prompt: "O que representa uma cota de um fundo de investimento?",
        concept: "Fundos e cotas",
        options: [
          { id: "A", text: "Uma fração do patrimônio do fundo" },
          { id: "B", text: "Uma promessa de rentabilidade fixa do administrador" },
          { id: "C", text: "Um depósito bancário automaticamente coberto pelo FGC" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Exato. Ao investir, a pessoa adquire cotas, e o resultado depende dos ativos e das regras do fundo.",
        incorrectFeedback:
          "Cota é uma fração do patrimônio do fundo. Fundo não é depósito bancário e não oferece garantia de rentabilidade por definição.",
      },
      {
        id: "l3-q5",
        context: "Renda variável",
        prompt: "Uma ação pode subir ou cair de preço. O que isso indica para quem investe?",
        concept: "Renda variável",
        options: [
          { id: "A", text: "O retorno pode variar e há possibilidade de perdas" },
          { id: "B", text: "O preço só muda quando a empresa distribui dividendos" },
          { id: "C", text: "A ação tem vencimento e devolve sempre o valor aplicado" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Missão concluída. Na renda variável, preços e resultados podem oscilar; entender isso vem antes de investir.",
        incorrectFeedback:
          "O preço das ações varia no mercado e não há devolução garantida do valor investido. Oscilação e perdas fazem parte dos riscos.",
      },
    ],
  },
  {
    id: 4,
    title: "Pensando como investidor",
    emoji: "🧭",
    tone: "ink",
    description: "Conecte perfil, risco, retorno, diversificação e horizonte de investimento.",
    missionTitle: "Missão: o plano de investimento de Bia",
    missionBrief:
      "Bia tem objetivos com prazos diferentes e está conhecendo alternativas. Seu desafio é avaliar adequação, não perseguir a maior taxa isoladamente.",
    missionSummary: "Bia aprendeu que risco, retorno, diversificacao, perfil e horizonte precisam conversar entre si. A boa decisao nao e a mais chamativa: e a que combina com a pessoa e com o prazo.",
    questions: [
      {
        id: "l4-q1",
        context: "Risco e retorno",
        prompt:
          "Uma oferta promete retorno potencial maior, mas pode oscilar bastante. O que Bia deve entender?",
        concept: "Relação entre risco e retorno",
        options: [
          { id: "A", text: "Maior retorno potencial pode vir acompanhado de maior risco" },
          { id: "B", text: "O retorno maior elimina a chance de perda" },
          { id: "C", text: "O risco importa apenas depois do vencimento" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Certo. Potencial de retorno precisa ser analisado junto com os riscos e a capacidade de suportar perdas.",
        incorrectFeedback:
          "Uma possibilidade de retorno maior não elimina riscos. Avaliar ambos é parte da decisão, antes e durante o investimento.",
      },
      {
        id: "l4-q2",
        context: "Diversificação",
        prompt: "Por que distribuir os investimentos entre alternativas diferentes pode ajudar?",
        concept: "Diversificação",
        options: [
          { id: "A", text: "Pode reduzir a concentração em uma única fonte de risco" },
          { id: "B", text: "Garante lucro em qualquer cenário" },
          { id: "C", text: "Torna desnecessário conhecer os produtos" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Isso. Diversificar pode reduzir concentração, embora não elimine todos os riscos nem garanta lucro.",
        incorrectFeedback:
          "Diversificação distribui exposições, mas não torna uma carteira livre de risco ou de perdas.",
      },
      {
        id: "l4-q3",
        context: "Perfil do investidor",
        prompt: "O que uma análise de perfil procura compreender sobre a pessoa investidora?",
        concept: "Perfil e tolerância a risco",
        options: [
          { id: "A", text: "Objetivos, situação, experiência e tolerância a riscos" },
          { id: "B", text: "Apenas o produto com maior rentabilidade recente" },
          { id: "C", text: "Somente a idade, sem considerar os objetivos" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Correto. Perfil é uma das informações que ajuda a avaliar se um produto faz sentido para aquela pessoa.",
        incorrectFeedback:
          "A adequação depende de mais do que idade ou retorno recente: objetivos, conhecimento e tolerância a riscos também contam.",
      },
      {
        id: "l4-q4",
        context: "Horizonte de investimento",
        prompt:
          "Bia precisará pagar um curso daqui a seis meses. Por que o prazo deve influenciar a escolha?",
        concept: "Horizonte e adequação",
        options: [
          {
            id: "A",
            text: "Porque ela pode não ter tempo para esperar uma recuperação após oscilações",
          },
          { id: "B", text: "Porque um prazo curto garante retorno alto" },
          { id: "C", text: "Porque o vencimento nunca importa em investimentos" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Boa. O horizonte afeta a capacidade de lidar com oscilações e a compatibilidade com o momento do gasto.",
        incorrectFeedback:
          "Um objetivo próximo reduz o tempo para lidar com oscilações ou esperar um vencimento. Prazo não garante retorno.",
      },
      {
        id: "l4-q5",
        context: "Decisão adequada",
        prompt:
          "Bia tem baixa tolerância a oscilações e precisará do dinheiro em breve. Uma ação volátil parece alinhada a esse objetivo?",
        concept: "Adequação entre produto e objetivo",
        options: [
          { id: "A", text: "Não necessariamente; prazo e tolerância precisam ser considerados" },
          { id: "B", text: "Sim, porque ações sempre recuperam perdas antes do objetivo" },
          { id: "C", text: "Sim, porque a maior variação garante maior retorno" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Missão cumprida. Uma recomendação educacional começa por conhecer o objetivo e os riscos que a pessoa aceita.",
        incorrectFeedback:
          "Não há garantia de recuperação antes da data necessária. Uma alternativa volátil pode não combinar com prazo curto e baixa tolerância.",
      },
    ],
  },
  {
    id: 5,
    title: "Desafio CPA",
    emoji: "🎓",
    tone: "coral",
    description: "Aplique os conceitos em casos integrados com linguagem mais técnica.",
    missionTitle: "Missão: você é assessor por cinco minutos",
    missionBrief:
      "Rafael tem R$ 10.000 para uma reserva e um objetivo de longo prazo. Ele demonstra baixa tolerância a perdas e pergunta sobre CDBs, fundos e títulos públicos.",
    missionSummary: "Rafael integrou o caso final: separou reserva e longo prazo, checou liquidez, risco de credito, custos, documentos do fundo e suitability. Essa e a logica central para chegar mais forte ao CPA.",
    questions: [
      {
        id: "l5-q1",
        context: "Caso integrado · necessidade de liquidez",
        prompt:
          "Um CDB oferece taxa atraente, mas tem carência de dois anos. Considerando que parte dos recursos é a reserva de Rafael, qual análise é prioritária?",
        concept: "Liquidez e adequação",
        options: [
          {
            id: "A",
            text: "Verificar se a restrição de resgate é compatível com a finalidade de reserva",
          },
          { id: "B", text: "Assumir que a taxa maior torna o produto adequado" },
          { id: "C", text: "Ignorar a carência se o emissor for conhecido" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Correto. A finalidade dos recursos e a disponibilidade do produto devem ser compatíveis antes de comparar taxas.",
        incorrectFeedback:
          "Taxa não substitui análise de adequação. Uma reserva pode ser necessária antes do fim da carência.",
      },
      {
        id: "l5-q2",
        context: "Caso integrado · emissor e garantia",
        prompt: "Ao avaliar um CDB, qual afirmação sobre o emissor e a proteção é mais precisa?",
        concept: "Risco de crédito e cobertura do FGC",
        options: [
          {
            id: "A",
            text: "É uma obrigação da instituição emissora; eventual cobertura depende das regras e limites vigentes do FGC",
          },
          { id: "B", text: "É uma obrigação do governo federal sem risco de crédito" },
          { id: "C", text: "Todo investimento financeiro tem cobertura integral do FGC" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Isso. O risco de crédito está ligado ao emissor. A cobertura do FGC se aplica somente a produtos elegíveis e conforme regras e limites vigentes.",
        incorrectFeedback:
          "CDB é obrigação do emissor, não do governo. O FGC não cobre todos os investimentos nem significa cobertura ilimitada.",
      },
      {
        id: "l5-q3",
        context: "Caso integrado · fundo de investimento",
        prompt:
          "Rafael avalia um fundo para diversificar. Qual informação ajuda a entender os riscos e custos antes de investir?",
        concept: "Leitura das características do fundo",
        options: [
          {
            id: "A",
            text: "Política de investimento, riscos, taxas, prazo de resgate e documentos do fundo",
          },
          { id: "B", text: "Somente o retorno do último mês" },
          { id: "C", text: "Apenas a quantidade de cotistas" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Boa análise. Política, riscos, custos e condições de resgate ajudam a avaliar se o fundo combina com o objetivo.",
        incorrectFeedback:
          "Um retorno recente isolado não explica estratégia, risco, custos nem prazo de resgate. É preciso analisar as características do fundo.",
      },
      {
        id: "l5-q4",
        context: "Caso integrado · perfil e recomendação",
        prompt:
          "Rafael declara baixa tolerância a perdas, mas recebe uma sugestão de produto volátil para sua reserva. Qual conduta é mais adequada numa análise de suitability?",
        concept: "Adequação ao perfil",
        options: [
          {
            id: "A",
            text: "Reavaliar objetivo, prazo e perfil antes de considerar a recomendação adequada",
          },
          { id: "B", text: "Recomendar mesmo assim, pois a rentabilidade potencial é maior" },
          { id: "C", text: "Considerar apenas a idade e desconsiderar as respostas de perfil" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Correto. Suitability relaciona características do produto com objetivos, situação e perfil do cliente.",
        incorrectFeedback:
          "Potencial de retorno não substitui a avaliação de adequação. Objetivo, horizonte, conhecimento e tolerância ao risco precisam ser considerados.",
      },
      {
        id: "l5-q5",
        context: "Caso integrado · decisão final",
        prompt:
          "Rafael separa a reserva de emergência do objetivo de longo prazo. Qual princípio deve orientar a comparação final dos produtos?",
        concept: "Adequação, risco e horizonte",
        options: [
          {
            id: "A",
            text: "Comparar risco, liquidez, custos e prazo com a finalidade de cada parcela",
          },
          { id: "B", text: "Escolher uma única alternativa pela maior taxa divulgada" },
          { id: "C", text: "Tratar todos os produtos como equivalentes se forem investimentos" },
        ],
        correctOptionId: "A",
        correctFeedback:
          "Missão CPA concluída. Você conectou objetivo, prazo, risco, liquidez e características do produto numa decisão contextual.",
        incorrectFeedback:
          "A taxa isolada não mostra se o produto atende cada objetivo. Compare liquidez, riscos, custos e horizonte para cada parcela.",
      },
    ],
  },
];

const OPTION_LABELS = ["A", "B", "C"] as const;

export const LEARNING_LEVELS: LearningLevel[] = LEARNING_LEVELS_SOURCE.map((level) => ({
  ...level,
  questions: level.questions.map((question, index) => {
    const correctOption = question.options.find(
      (option) => option.id === question.correctOptionId,
    )!;
    const distractors = question.options.filter((option) => option.id !== question.correctOptionId);
    const correctIndex = (level.id + index - 1) % OPTION_LABELS.length;
    let distractorIndex = 0;
    const options = question.options.map((_, optionIndex) => {
      const id = OPTION_LABELS[optionIndex]!;
      return optionIndex === correctIndex
        ? { ...correctOption, id }
        : { ...distractors[distractorIndex++]!, id };
    });

    return { ...question, options, correctOptionId: OPTION_LABELS[correctIndex]! };
  }),
}));

export const STARTER_HEARTS = 3;
export const XP_PER_CORRECT_ANSWER = 20;
export const XP_PER_INCORRECT_ANSWER = 5;
export const GEMS_PER_COMPLETED_MISSION = 15;
