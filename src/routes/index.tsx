import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import mascot from "@/assets/mascot.png";
import { LEARNING_LEVELS, STARTER_HEARTS, type LearningLevel, type LearningQuestion } from "@/lib/learning-content";
import { clearProgress, EMPTY_PROGRESS, getMissionGemReward, getQuestionXpReward, readProgress, writeProgress, type UserProgress } from "@/lib/user-progress";
import { changeAccountPassword, deleteLearnerProfile, getCurrentAccount, getCurriculum, getLearnerProgress, isApiConfigured, loginAccount, logoutAccount, registerAccount, requestPasswordReset, resetAccountPassword, restartLearnerMission, setApiAuthToken, submitLearnerAnswer, updateLearnerProfile, type ApiAnswer, type ApiAuth, type ApiCurriculum, type ApiProgress } from "@/lib/brainvest-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Do Zero ao CPA — Aprenda finanças jogando" },
      { name: "description", content: "Domine seu cartão, organize seu dinheiro e comece a investir com desafios curtos e interativos." },
      { property: "og:title", content: "Do Zero ao CPA — Aprenda finanças jogando" },
      { property: "og:description", content: "Educação financeira gamificada para jovens estudantes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: App,
});

type Screen = "splash" | "auth" | "objetivo" | "home" | "trilhas" | "conquistas" | "perfil" | "atividades" | "desafio" | "resultado";
type Tone = "mint" | "coral" | "butter" | "ink";

const OBJECTIVES = [
  { emoji: "🧾", label: "Organizar meu dinheiro", guidance: "Seu foco: organizar renda e gastos antes de definir metas." },
  { emoji: "🛡️", label: "Evitar dívidas", guidance: "Seu foco: entender gastos e juros antes de assumir novos compromissos." },
  { emoji: "🌱", label: "Aprender a investir", guidance: "Seu foco: construir uma base financeira antes de escolher investimentos." },
  { emoji: "🎓", label: "Estudar para a CPA", guidance: "Sua preparação começa pela base e avança até casos no estilo CPA." },
];

const toneCls: Record<Tone, { card: string; text: string; shadow: string; soft: string }> = {
  mint: { card: "bg-mint text-milk", text: "text-mint", shadow: "shadow-mint-dark", soft: "bg-mint-soft" },
  coral: { card: "bg-coral text-milk", text: "text-coral", shadow: "shadow-coral-dark", soft: "bg-coral-soft" },
  butter: { card: "bg-butter text-ink", text: "text-bark", shadow: "shadow-bark/40", soft: "bg-butter-soft" },
  ink: { card: "bg-ink text-cream", text: "text-ink", shadow: "shadow-bark", soft: "bg-line" },
};

function mergeCurriculum(apiCurriculum: ApiCurriculum): LearningLevel[] {
  return apiCurriculum.levels.map((apiLevel) => {
    const localLevel = LEARNING_LEVELS.find((level) => level.id === apiLevel.id);
    return {
      ...localLevel,
      ...apiLevel,
      questions: apiLevel.questions.map((apiQuestion) => {
        const localQuestion = localLevel?.questions.find((question) => question.id === apiQuestion.id);
        return { ...localQuestion, ...apiQuestion } as LearningQuestion;
      }),
    } as LearningLevel;
  });
}

function mergeApiProgress(apiProgress: ApiProgress, current: UserProgress): UserProgress {
  return {
    ...current,
    backendLearnerId: apiProgress.learnerId,
    displayName: apiProgress.displayName,
    objective: apiProgress.objective,
    xp: apiProgress.xp,
    gems: apiProgress.gems,
    lives: apiProgress.lives,
    streak: apiProgress.streak,
    completedMissionIds: apiProgress.completedMissionIds,
    completedQuestionCounts: apiProgress.completedQuestionCounts,
    rewardedQuestionIds: apiProgress.rewardedQuestionIds,
    activeMissionId: apiProgress.completedMissionIds.length === LEARNING_LEVELS.length ? null : apiProgress.activeLevelId,
    currentQuestionIndex: apiProgress.currentQuestionIndex,
  };
}

function mergeAuth(auth: ApiAuth, current: UserProgress): UserProgress {
  return {
    ...mergeApiProgress(auth.progress, current),
    email: auth.user.email,
    authToken: auth.token || current.authToken,
    backendLearnerId: auth.user.learnerId,
    displayName: auth.user.displayName,
  };
}

function Chunky({ onClick, tone = "mint", children, className = "", disabled }: { onClick?: () => void; tone?: Tone | "milk"; children: ReactNode; className?: string; disabled?: boolean }) {
  const t = tone === "milk" ? "bg-milk text-ink border-2 border-line shadow-line" : `${toneCls[tone].card} ${toneCls[tone].shadow}`;
  return (
    <button disabled={disabled} onClick={onClick} className={`chunky-sm w-full rounded-2xl py-3.5 text-sm font-extrabold uppercase tracking-wider transition-all active:translate-y-1 active:shadow-none disabled:opacity-40 ${t} ${className}`}>
      {children}
    </button>
  );
}

function buildMistakeCoach(question: LearningQuestion, selectedOptionId: string | null) {
  const selectedOption = question.options.find((option) => option.id === selectedOptionId);
  const correctOption = question.options.find((option) => option.id === question.correctOptionId);

  return {
    selectedText: selectedOption?.text ?? "Alternativa escolhida",
    temptation:
      "Essa alternativa pode parecer boa porque simplifica a decisao ou olha so para um detalhe chamativo.",
    key:
      `Conceito-chave: ${question.concept}. Compare a escolha com o objetivo, o prazo, o risco e a necessidade real do personagem.`,
    hint:
      `Microdica: procure a opcao que preserva melhor o plano do caso. Nesta pergunta, ela aponta para: ${correctOption?.text ?? "a alternativa correta"}.`,
  };
}

function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [progress, setProgress] = useState<UserProgress>(EMPTY_PROGRESS);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [learningLevels, setLearningLevels] = useState<LearningLevel[]>(LEARNING_LEVELS);
  const [apiStatus, setApiStatus] = useState<"local" | "connecting" | "online" | "offline">(isApiConfigured ? "connecting" : "local");
  const [apiError, setApiError] = useState("");
  const [authMode, setAuthMode] = useState<"register" | "login" | "forgot" | "reset">("register");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [respostaCorreta, setRespostaCorreta] = useState<boolean | null>(null);
  const [respostaApi, setRespostaApi] = useState<ApiAnswer | null>(null);
  const [trilha, setTrilha] = useState<LearningLevel>(LEARNING_LEVELS[0]!);
  const [resposta, setResposta] = useState<string | null>(null);
  const [questaoIndex, setQuestaoIndex] = useState(0);
  const [perguntaAtual, setPerguntaAtual] = useState<LearningQuestion | null>(null);
  const [xpDaResposta, setXpDaResposta] = useState(0);
  const [gemasDaResposta, setGemasDaResposta] = useState(0);
  const { displayName: nome, objective: objetivo, email, authToken, backendLearnerId, lives: vidas, streak: sequencia, xp, gems: gemas, completedMissionIds: missoesConcluidas, completedQuestionCounts: questoesConcluidas } = progress;
  const nivel = 1 + Math.floor(xp / 500);
  const go = (s: Screen) => setScreen(s);
  const primeiro = nome.trim().split(" ")[0] || "Luísa";
  const pergunta = trilha.questions[questaoIndex]!;

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      const saved = readProgress(window.localStorage);
      setApiAuthToken(saved.authToken);
      setProgress(saved);
      setProgressLoaded(true);
      if (!isApiConfigured) return;

      try {
        const curriculum = await getCurriculum();
        if (cancelled) return;
        setLearningLevels(mergeCurriculum(curriculum));
        if (saved.authToken) {
          const account = await getCurrentAccount();
          if (cancelled) return;
          setProgress((current) => mergeAuth(account, current));
          setApiStatus("online");
          return;
        }
        setProgress((current) => current.authToken ? current : { ...current, backendLearnerId: null });
        setApiStatus("online");
      } catch (error) {
        if (cancelled) return;
        setApiStatus("offline");
        setApiError(error instanceof Error ? error.message : "A API está indisponível.");
      }
    };
    void initialize();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (progressLoaded) writeProgress(window.localStorage, progress);
  }, [progress, progressLoaded]);

  const iniciarMissao = (nivelAprendizagem: LearningLevel) => {
    const resumir = progress.activeMissionId === nivelAprendizagem.id && progress.lives > 0;
    const reiniciarSemVidas = progress.activeMissionId === nivelAprendizagem.id && progress.lives === 0;
    const indice = reiniciarSemVidas ? 0 : resumir
      ? Math.min(progress.currentQuestionIndex, nivelAprendizagem.questions.length - 1)
      : missoesConcluidas.includes(nivelAprendizagem.id)
        ? 0
        : (questoesConcluidas[nivelAprendizagem.id] ?? 0);
    setTrilha(nivelAprendizagem);
    setQuestaoIndex(indice);
    setProgress((current) => ({
      ...current,
      activeMissionId: missoesConcluidas.includes(nivelAprendizagem.id) ? null : nivelAprendizagem.id,
      currentQuestionIndex: indice,
      lives: resumir ? current.lives : STARTER_HEARTS,
      streak: reiniciarSemVidas ? 0 : current.streak,
      completedQuestionCounts: reiniciarSemVidas
        ? { ...current.completedQuestionCounts, [nivelAprendizagem.id]: 0 }
        : current.completedQuestionCounts,
    }));
    setResposta(null);
    setPerguntaAtual(null);
    setRespostaCorreta(null);
    setRespostaApi(null);
    setApiError("");
    go("atividades");
  };

  const finalizarObjetivo = async () => {
    if (isApiConfigured) {
      setApiStatus("connecting");
      try {
        let learnerId = backendLearnerId;
        if (authToken && learnerId) {
          await updateLearnerProfile(learnerId, nome.trim(), objetivo);
        } else if (!authToken) {
          const auth = await registerAccount(nome.trim(), objetivo, email.trim(), password);
          setApiAuthToken(auth.token);
          setProgress((current) => mergeAuth(auth, current));
          setApiStatus("online");
          setApiError("");
          setPassword("");
          go("home");
          return;
        } else {
          throw new Error("Entre novamente para sincronizar seu perfil.");
        }
        const serverProgress = await getLearnerProgress(learnerId);
        setProgress((current) => mergeApiProgress(serverProgress, current));
        setApiStatus("online");
        setApiError("");
      } catch (error) {
        setApiStatus("offline");
        setApiError(error instanceof Error ? error.message : "Não foi possível salvar seu perfil na API.");
      }
    }
    go("home");
  };

  const entrarNaConta = async () => {
    if (!email.trim() || !password) return;
    setApiStatus("connecting");
    setApiError("");
    try {
      const auth = await loginAccount(email.trim(), password);
      setApiAuthToken(auth.token);
      setProgress((current) => mergeAuth(auth, current));
      setPassword("");
      setApiStatus("online");
      go("home");
    } catch (error) {
      setApiStatus("offline");
      setApiError(error instanceof Error ? error.message : "Não foi possível entrar na conta.");
    }
  };

  const solicitarResetSenha = async () => {
    if (!email.trim()) return;
    setApiStatus("connecting");
    setApiError("");
    setAccountMessage("");
    try {
      await requestPasswordReset(email.trim());
      setAccountMessage("Se este e-mail estiver cadastrado, enviaremos instrucoes de recuperacao.");
      setApiStatus("online");
      setAuthMode("reset");
    } catch (error) {
      setApiStatus("offline");
      setApiError(error instanceof Error ? error.message : "Nao foi possivel solicitar a recuperacao.");
    }
  };

  const redefinirSenha = async () => {
    if (!resetToken.trim() || resetPassword.length < 8) return;
    setApiStatus("connecting");
    setApiError("");
    setAccountMessage("");
    try {
      await resetAccountPassword(resetToken.trim(), resetPassword);
      setResetToken("");
      setResetPassword("");
      setPassword("");
      setAccountMessage("Senha redefinida. Entre com a nova senha.");
      setApiStatus("online");
      setAuthMode("login");
    } catch (error) {
      setApiStatus("online");
      setApiError(error instanceof Error ? error.message : "Nao foi possivel redefinir a senha.");
    }
  };

  const selecionarObjetivo = (label: string) => {
    setProgress((current) => ({ ...current, objective: label }));
    if (apiStatus === "online" && authToken && backendLearnerId && nome.trim()) {
      void updateLearnerProfile(backendLearnerId, nome.trim(), label).catch((error: unknown) => {
        setApiStatus("offline");
        setApiError(error instanceof Error ? error.message : "Não foi possível sincronizar o objetivo.");
      });
    }
  };

  const enviarResposta = async () => {
    if (!resposta || submitting) return;
    if (authToken && backendLearnerId && apiStatus !== "online") {
      setApiError("Seu perfil está no backend, mas a API está indisponível. Reconecte para enviar a resposta sem perder progresso.");
      return;
    }
    setSubmitting(true);
    setApiError("");
    const acertou = pergunta.correctOptionId === resposta;
    const ultimaDaMissao = questaoIndex === trilha.questions.length - 1;
    const missaoJaConcluida = missoesConcluidas.includes(trilha.id);
    const questaoJaRecompensada = progress.rewardedQuestionIds.includes(pergunta.id);
    const xpGanho = getQuestionXpReward(acertou, questaoJaRecompensada, missaoJaConcluida);
    const gemasGanhos = acertou && ultimaDaMissao ? getMissionGemReward(missaoJaConcluida) : 0;

    if (apiStatus === "online" && authToken && backendLearnerId) {
      const requestId = pendingRequestId ?? crypto.randomUUID();
      setPendingRequestId(requestId);
      try {
        const answer = await submitLearnerAnswer(backendLearnerId, pergunta.id, resposta, requestId);
        const serverProgress = await getLearnerProgress(backendLearnerId);
        setProgress((current) => mergeApiProgress(serverProgress, current));
        setPerguntaAtual(pergunta);
        setRespostaCorreta(answer.correct);
        setRespostaApi(answer);
        setXpDaResposta(answer.xpAwarded);
        setGemasDaResposta(answer.gemsAwarded);
        setPendingRequestId(null);
        setSubmitting(false);
        go("resultado");
      } catch (error) {
        setSubmitting(false);
        setApiError(error instanceof Error ? error.message : "A resposta não foi confirmada. Tente novamente.");
      }
      return;
    }

    setPerguntaAtual(pergunta);
    setRespostaCorreta(acertou);
    setRespostaApi(null);
    setXpDaResposta(xpGanho);
    setGemasDaResposta(gemasGanhos);
    setProgress((current) => ({
      ...current,
      xp: current.xp + xpGanho,
      gems: current.gems + gemasGanhos,
      streak: acertou ? current.streak + 1 : 0,
      lives: acertou ? current.lives : Math.max(0, current.lives - 1),
      rewardedQuestionIds: xpGanho > 0 ? [...current.rewardedQuestionIds, pergunta.id] : current.rewardedQuestionIds,
      completedMissionIds: acertou && ultimaDaMissao && !missaoJaConcluida
        ? [...current.completedMissionIds, trilha.id]
        : current.completedMissionIds,
      completedQuestionCounts: acertou && !missaoJaConcluida
        ? { ...current.completedQuestionCounts, [trilha.id]: Math.max(current.completedQuestionCounts[trilha.id] ?? 0, questaoIndex + 1) }
        : current.completedQuestionCounts,
      activeMissionId: acertou && ultimaDaMissao ? null : current.activeMissionId,
      currentQuestionIndex: acertou
        ? ultimaDaMissao ? 0 : questaoIndex + 1
        : current.currentQuestionIndex,
    }));
    setSubmitting(false);
    go("resultado");
  };

  const continuarMissao = async () => {
    const acertou = respostaCorreta ?? perguntaAtual?.correctOptionId === resposta;
    if (!acertou) {
      if (vidas === 0) {
        if (apiStatus === "online" && authToken && backendLearnerId) {
          try {
            await restartLearnerMission(backendLearnerId, trilha.id);
            const serverProgress = await getLearnerProgress(backendLearnerId);
            setProgress((current) => mergeApiProgress(serverProgress, current));
          } catch (error) {
            setApiError(error instanceof Error ? error.message : "Não foi possível reiniciar a missão.");
            return;
          }
        }
        setQuestaoIndex(0);
        if (apiStatus !== "online" || !backendLearnerId) {
          setProgress((current) => ({
            ...current,
            lives: STARTER_HEARTS,
            streak: 0,
            activeMissionId: trilha.id,
            currentQuestionIndex: 0,
            completedQuestionCounts: { ...current.completedQuestionCounts, [trilha.id]: 0 },
          }));
        }
      } else {
        if (apiStatus !== "online" || !backendLearnerId) {
          setProgress((current) => ({ ...current, currentQuestionIndex: questaoIndex }));
        }
      }
      setResposta(null);
      setPerguntaAtual(null);
      setRespostaCorreta(null);
      setRespostaApi(null);
      setPendingRequestId(null);
      setApiError("");
      go("desafio");
      return;
    }
    if (questaoIndex === trilha.questions.length - 1) {
      setResposta(null);
      setPerguntaAtual(null);
      setRespostaCorreta(null);
      setRespostaApi(null);
      go("home");
      return;
    }
    setQuestaoIndex((index) => index + 1);
    if (apiStatus !== "online" || !backendLearnerId) {
      setProgress((current) => ({ ...current, currentQuestionIndex: questaoIndex + 1 }));
    }
    setResposta(null);
    setPerguntaAtual(null);
    setRespostaCorreta(null);
    setRespostaApi(null);
    setPendingRequestId(null);
    setApiError("");
    go("desafio");
  };

  const apagarPerfil = async () => {
    const confirmation = window.prompt("Para apagar sua conta e todo o progresso salvo, digite APAGAR.");
    if (confirmation !== "APAGAR") return;
    if (authToken && backendLearnerId) {
      try {
        await deleteLearnerProfile(backendLearnerId);
      } catch (error) {
        setApiError(error instanceof Error ? error.message : "Não foi possível apagar o perfil no backend.");
        return;
      }
    }
    clearProgress(window.localStorage);
    setProgress({ ...EMPTY_PROGRESS });
    setApiError("");
    go("splash");
  };

  const sairDaConta = async () => {
    try {
      if (authToken) await logoutAccount();
    } catch {
      // Logout local ainda deve acontecer se a sessão remota já expirou.
    }
    setApiAuthToken(null);
    clearProgress(window.localStorage);
    setProgress({ ...EMPTY_PROGRESS });
    setPassword("");
    setApiError("");
    go("splash");
  };

  const alterarSenha = async () => {
    if (!authToken || currentPassword.length < 8 || newPassword.length < 8) return;
    setApiError("");
    setAccountMessage("");
    setApiStatus("connecting");
    try {
      await changeAccountPassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setAccountMessage("Senha alterada com sucesso.");
      setApiStatus("online");
    } catch (error) {
      setApiStatus(authToken ? "online" : "offline");
      setApiError(error instanceof Error ? error.message : "Nao foi possivel alterar a senha.");
    }
  };

  const syncLabel = authToken
    ? apiStatus === "online"
      ? "Sincronizado com sua conta"
      : apiStatus === "connecting"
        ? "Sincronizando progresso..."
        : "Conta salva localmente; aguardando reconexao"
    : "Progresso salvo apenas neste dispositivo";

  return (
    <div className="flex min-h-screen w-full min-w-0 justify-center overflow-x-hidden bg-cream px-3 py-6">
      <div className="flex w-full min-w-0 max-w-[420px] flex-col overflow-hidden rounded-[40px] border-x-2 border-t-2 border-line bg-milk chunky shadow-line" style={{ minHeight: 780 }}>
        <div key={screen} className="animate-pop flex flex-1 flex-col">
          {screen === "splash" && (
            <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 px-5 text-center sm:px-8">
              <img src={mascot} alt="Tucano Do Zero ao CPA" width={1024} height={1024} className="size-40 max-w-full object-contain sm:size-48" />
              <h1 className="max-w-full break-words font-display text-3xl font-bold leading-tight text-mint sm:text-4xl">Do Zero ao CPA</h1>
              <p className="max-w-[28ch] text-bark">Do seu primeiro salário aos conceitos de investimento da CPA.</p>
              <div className="mt-6 w-full min-w-0 space-y-3">
                <Chunky onClick={() => go("auth")}>Começar agora</Chunky>
                {progressLoaded && nome.trim() && <Chunky tone="milk" onClick={() => go("home")}>{authToken ? "Continuar na minha conta" : "Continuar progresso local"}</Chunky>}
              </div>
            </div>
          )}

          {screen === "auth" && (
            <div className="flex flex-1 flex-col px-7 pt-10">
              <button onClick={() => go("splash")} className="self-start text-2xl text-bark">←</button>
              <h2 className="mt-6 font-display text-3xl font-bold text-ink">{authMode === "register" ? "Crie sua conta" : authMode === "login" ? "Entre na sua conta" : "Recupere sua senha"}</h2>
              <p className="mt-1 text-sm text-bark">Seu progresso será salvo no banco e acompanha você em outros dispositivos.</p>
              <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-cream p-1">
                <button onClick={() => { setAuthMode("register"); setApiError(""); setAccountMessage(""); }} className={`rounded-xl py-2 text-xs font-extrabold uppercase ${authMode === "register" ? "bg-mint text-milk" : "text-bark"}`}>Cadastrar</button>
                <button onClick={() => { setAuthMode("login"); setApiError(""); setAccountMessage(""); }} className={`rounded-xl py-2 text-xs font-extrabold uppercase ${authMode === "login" ? "bg-mint text-milk" : "text-bark"}`}>Entrar</button>
              </div>
              <div className="mt-8 space-y-3">
                {authMode === "register" && (
                  <input aria-label="Seu nome" autoComplete="given-name" maxLength={60} placeholder="Seu nome" value={nome}
                    onChange={(event) => setProgress((current) => ({ ...current, displayName: event.target.value }))}
                    className="w-full rounded-2xl border-2 border-line bg-cream px-4 py-3.5 font-semibold text-ink outline-none placeholder:text-bark/50 focus:border-mint" />
                )}
                <input aria-label="E-mail" autoComplete="email" inputMode="email" maxLength={254} placeholder="E-mail" value={email}
                  onChange={(event) => setProgress((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border-2 border-line bg-cream px-4 py-3.5 font-semibold text-ink outline-none placeholder:text-bark/50 focus:border-mint" />
                {(authMode === "register" || authMode === "login") && (
                <input aria-label="Senha" autoComplete={authMode === "register" ? "new-password" : "current-password"} minLength={8} maxLength={100} type="password" placeholder="Senha, mínimo 8 caracteres" value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border-2 border-line bg-cream px-4 py-3.5 font-semibold text-ink outline-none placeholder:text-bark/50 focus:border-mint" />
                )}
                {authMode === "reset" && (
                  <>
                    <input aria-label="Codigo de recuperacao" autoComplete="one-time-code" maxLength={200} placeholder="Codigo ou token de recuperacao" value={resetToken}
                      onChange={(event) => setResetToken(event.target.value)}
                      className="w-full rounded-2xl border-2 border-line bg-cream px-4 py-3.5 font-semibold text-ink outline-none placeholder:text-bark/50 focus:border-mint" />
                    <input aria-label="Nova senha" autoComplete="new-password" minLength={8} maxLength={100} type="password" placeholder="Nova senha, minimo 8 caracteres" value={resetPassword}
                      onChange={(event) => setResetPassword(event.target.value)}
                      className="w-full rounded-2xl border-2 border-line bg-cream px-4 py-3.5 font-semibold text-ink outline-none placeholder:text-bark/50 focus:border-mint" />
                  </>
                )}
                {accountMessage && <p role="status" className="rounded-xl bg-mint-soft p-3 text-sm font-semibold text-ink">{accountMessage}</p>}
                {apiError && <p role="alert" className="rounded-xl bg-coral-soft p-3 text-sm font-semibold text-ink">{apiError}</p>}
              </div>
              <div className="mt-auto space-y-3 pb-8 pt-8">
                {authMode === "register" ? (
                  <Chunky disabled={!nome.trim() || !email.trim() || password.length < 8} onClick={() => go("objetivo")}>Continuar</Chunky>
                ) : authMode === "login" ? (
                  <Chunky disabled={!email.trim() || password.length < 8 || apiStatus === "connecting"} onClick={entrarNaConta}>{apiStatus === "connecting" ? "Entrando..." : "Entrar"}</Chunky>
                ) : authMode === "forgot" ? (
                  <Chunky disabled={!email.trim() || apiStatus === "connecting"} onClick={solicitarResetSenha}>{apiStatus === "connecting" ? "Enviando..." : "Enviar instrucao"}</Chunky>
                ) : (
                  <Chunky disabled={!resetToken.trim() || resetPassword.length < 8 || apiStatus === "connecting"} onClick={redefinirSenha}>{apiStatus === "connecting" ? "Salvando..." : "Redefinir senha"}</Chunky>
                )}
                {authMode === "login" && <button onClick={() => { setAuthMode("forgot"); setApiError(""); setAccountMessage(""); }} className="w-full text-sm font-extrabold text-mint underline underline-offset-4">Esqueci minha senha</button>}
                {(authMode === "forgot" || authMode === "reset") && <button onClick={() => { setAuthMode("login"); setApiError(""); }} className="w-full text-sm font-extrabold text-bark underline underline-offset-4">Voltar para entrar</button>}
                {authMode === "forgot" && <button onClick={() => setAuthMode("reset")} className="w-full text-sm font-extrabold text-bark underline underline-offset-4">Ja tenho um codigo</button>}
              </div>
            </div>
          )}

          {screen === "objetivo" && (
            <div className="flex flex-1 flex-col px-7 pt-10">
              <div className="flex items-center gap-4">
                <img src={mascot} alt="" width={816} height={816} className="size-20" />
                <div className="relative rounded-2xl border-2 border-line bg-milk p-3">
                  <p className="font-display text-sm font-bold text-ink">Oi, {primeiro}! Qual é seu principal objetivo?</p>
                </div>
              </div>
              <div className="mt-8 space-y-3">
                {OBJECTIVES.map(({ emoji, label, guidance }) => (
                  <button key={label} aria-pressed={objetivo === label} onClick={() => selecionarObjetivo(label)}
                    className={`chunky-sm flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left font-bold transition-all ${objetivo === label ? "border-mint bg-mint-soft text-mint shadow-mint/30" : "border-line bg-milk text-ink shadow-line"}`}>
                    <span className="text-2xl">{emoji}</span><span>{label}<span className="mt-1 block text-xs font-medium text-bark">{guidance}</span></span>
                  </button>
                ))}
              </div>
              <div className="mt-auto pb-8 pt-8"><Chunky disabled={!objetivo || apiStatus === "connecting"} onClick={finalizarObjetivo}>{apiStatus === "connecting" ? "Conectando..." : "Ver minha trilha"}</Chunky></div>
            </div>
          )}

          {screen === "perfil" && (
            <div className="flex flex-1 flex-col px-6 pt-8">
              <div className="flex items-center gap-4">
                <img src={mascot} alt="Tucano Do Zero ao CPA" width={1024} height={1024} className="size-20" />
                <div><h2 className="font-display text-2xl font-bold text-ink">Seu perfil</h2><p className="text-xs text-bark">{authToken ? "Progresso salvo na sua conta" : "Progresso local ainda sem conta"}</p></div>
              </div>
              {email && <div className="mt-5 rounded-2xl border-2 border-line bg-cream p-4"><p className="text-xs font-extrabold uppercase tracking-wider text-bark">E-mail</p><p className="mt-1 break-words text-sm font-bold text-ink">{email}</p></div>}
              <div className="mt-3 rounded-2xl border-2 border-line bg-milk p-4">
                <p className="text-xs font-extrabold uppercase tracking-wider text-bark">Status</p>
                <p className="mt-1 text-sm font-bold text-ink">{syncLabel}</p>
                {authToken && <p className="mt-2 text-xs leading-relaxed text-bark">Se esquecer a senha, use a opcao de recuperacao na tela de entrada.</p>}
              </div>
              <label className="mt-8 text-xs font-extrabold uppercase tracking-wider text-bark" htmlFor="profile-name">Como quer ser chamado?</label>
              <input id="profile-name" maxLength={60} value={nome} onBlur={() => {
                if (apiStatus === "online" && authToken && backendLearnerId && objetivo) {
                  void updateLearnerProfile(backendLearnerId, nome.trim(), objetivo).catch((error: unknown) => {
                    setApiStatus("offline");
                    setApiError(error instanceof Error ? error.message : "Não foi possível sincronizar o perfil.");
                  });
                }
              }} onChange={(event) => setProgress((current) => ({ ...current, displayName: event.target.value }))}
                className="mt-2 w-full rounded-2xl border-2 border-line bg-cream px-4 py-3.5 font-semibold text-ink outline-none focus:border-mint" />
              <div className="mt-6 rounded-2xl border-2 border-line bg-cream p-4">
                <p className="text-xs font-extrabold uppercase tracking-wider text-bark">Seu objetivo</p>
                <p className="mt-1 font-display text-lg font-bold text-ink">{objetivo || "Ainda não definido"}</p>
                <button onClick={() => go("objetivo")} className="mt-3 text-sm font-extrabold text-mint underline underline-offset-4">Alterar objetivo</button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-butter-soft p-4 text-center"><p className="text-xs font-bold uppercase text-bark">XP</p><p className="font-display text-2xl font-bold text-ink">{xp}</p></div>
                <div className="rounded-2xl bg-mint-soft p-4 text-center"><p className="text-xs font-bold uppercase text-bark">Missões</p><p className="font-display text-2xl font-bold text-ink">{missoesConcluidas.length}/{learningLevels.length}</p></div>
              </div>
              {authToken && (
                <div className="mt-4 rounded-2xl border-2 border-line bg-cream p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-bark">Alterar senha</p>
                  <input aria-label="Senha atual" autoComplete="current-password" type="password" placeholder="Senha atual" value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="mt-3 w-full rounded-2xl border-2 border-line bg-milk px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:text-bark/50 focus:border-mint" />
                  <input aria-label="Nova senha" autoComplete="new-password" type="password" placeholder="Nova senha, minimo 8 caracteres" value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="mt-3 w-full rounded-2xl border-2 border-line bg-milk px-4 py-3 text-sm font-semibold text-ink outline-none placeholder:text-bark/50 focus:border-mint" />
                  <button disabled={currentPassword.length < 8 || newPassword.length < 8 || apiStatus === "connecting"} onClick={alterarSenha}
                    className="mt-3 w-full rounded-xl bg-mint px-4 py-3 text-xs font-extrabold uppercase text-milk disabled:opacity-40">{apiStatus === "connecting" ? "Salvando..." : "Salvar nova senha"}</button>
                </div>
              )}
              {accountMessage && <p role="status" className="mt-4 rounded-xl bg-mint-soft p-3 text-sm font-semibold text-ink">{accountMessage}</p>}
              {apiError && <p role="alert" className="mt-4 rounded-xl bg-coral-soft p-3 text-sm font-semibold text-ink">{apiError}</p>}
              <div className="mt-auto space-y-3 pb-8 pt-8">
                <Chunky tone="milk" onClick={sairDaConta}>{authToken ? "Sair da conta" : "Limpar este dispositivo"}</Chunky>
                <Chunky tone="milk" onClick={apagarPerfil}>Apagar perfil e progresso</Chunky>
                <TabBar active={screen} go={go} />
              </div>
            </div>
          )}

          {(screen === "home" || screen === "trilhas" || screen === "conquistas") && (
            <>
              <StatsBar xp={xp} gemas={gemas} sequencia={sequencia} />
              <div className="flex-1 px-6 py-4">
                {apiStatus === "offline" && <div role="status" className="mb-4 rounded-xl border border-coral/40 bg-coral-soft px-3 py-2 text-xs font-semibold text-ink">Servidor indisponível no momento. Se o Render estiver acordando, tente recarregar em alguns segundos. {apiError}</div>}
                {apiStatus === "connecting" && <div role="status" className="mb-4 rounded-xl border border-butter bg-butter-soft px-3 py-2 text-xs font-semibold text-ink">Conectando ao servidor...</div>}
                {screen === "home" ? (
                  <>
                    <div className="mb-6 flex items-center gap-4">
                      <img src={mascot} alt="" width={816} height={816} className="size-20 shrink-0" />
                      <div className="rounded-2xl border-2 border-line bg-milk p-3">
                        <p className="font-display text-sm font-bold text-ink">{objetivo === "Estudar para a CPA" ? `Sua preparação para a CPA começa pela base, ${primeiro}.` : `Do primeiro salário ao primeiro investimento, ${primeiro}.`}</p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-bark">{missoesConcluidas.length} de {learningLevels.length} missões · Nível {nivel}</p>
                      </div>
                    </div>
                    <h2 className="mb-2 font-display text-xl font-bold text-ink">Próximo passo para você</h2>
                    <p className="mb-4 text-sm text-bark">{OBJECTIVES.find((item) => item.label === objetivo)?.guidance ?? "Comece pelo básico e avance no seu ritmo."}</p>
                    <div className="space-y-4">
                      {(() => {
                        const proxima = learningLevels.find((item) => !missoesConcluidas.includes(item.id)) ?? learningLevels[learningLevels.length - 1]!;
                        const progresso = missoesConcluidas.includes(proxima.id) ? proxima.questions.length : (questoesConcluidas[proxima.id] ?? 0);
                        return <LessonCard tone={proxima.tone} emoji={proxima.emoji} sub={`Nível ${proxima.id} · ${progresso} de ${proxima.questions.length} etapas`} title={proxima.missionTitle}
                          onClick={() => iniciarMissao(proxima)} cta={progresso ? "Continuar missão" : objetivo === "Estudar para a CPA" ? "Começar base para CPA" : "Começar missão"} />;
                      })()}
                      <div className="rounded-2xl border-2 border-line bg-cream p-4">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-bark">Sua jornada</p>
                        <div className="mt-3 flex items-center gap-2">
                          {learningLevels.map((item) => <span key={item.id} title={item.title} className={`grid size-9 flex-1 place-items-center rounded-xl text-lg ${missoesConcluidas.includes(item.id) ? "bg-mint text-milk" : item.id === (missoesConcluidas.length + 1) ? "bg-butter text-ink" : "bg-line text-bark opacity-50"}`}>{missoesConcluidas.includes(item.id) ? "✓" : item.emoji}</span>)}
                        </div>
                        <p className="mt-2 text-xs font-semibold text-bark">Cotidiano <span aria-hidden="true">→</span> decisões de investimento <span aria-hidden="true">→</span> CPA</p>
                      </div>
                      <Chunky tone="milk" onClick={() => go("trilhas")}>Explorar mapa de aprendizagem</Chunky>
                    </div>
                  </>
                ) : screen === "trilhas" ? (
                  <>
                    <h2 className="mb-1 font-display text-2xl font-bold text-ink">Do cotidiano ao CPA</h2>
                    <p className="mb-5 text-sm text-bark">Cada etapa prepara você para a próxima. Objetivo: {objetivo || "Aprender a investir"}</p>
                    <div className="space-y-4">
                      {learningLevels.map((item) => {
                        const done = missoesConcluidas.includes(item.id);
                        const unlocked = item.id === 1 || missoesConcluidas.includes(item.id - 1);
                        const progresso = done ? item.questions.length : (questoesConcluidas[item.id] ?? 0);
                        return <button key={item.id} disabled={!unlocked} onClick={() => iniciarMissao(item)}
                          className={`chunky flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-45 ${toneCls[item.tone].card} ${toneCls[item.tone].shadow}`}>
                          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-milk/20 text-2xl">{done ? "✓" : item.emoji}</div>
                          <div className="flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-75">Nível {item.id} · {unlocked ? `${progresso}/${item.questions.length} etapas` : "Conclua o nível anterior"}</p>
                            <p className="font-display text-lg font-bold leading-tight">{item.title}</p>
                            <p className="mt-1 text-xs font-semibold opacity-80">{item.description}</p>
                          </div>
                        </button>;
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mb-1 font-display text-2xl font-bold text-ink">Conquistas</h2>
                    <p className="mb-5 text-sm text-bark">Marcos conquistados ao avançar na trilha.</p>
                    <div className="space-y-3">
                      {[
                        { level: 1, emoji: "🌱", title: "Primeiro passo", detail: "Conclua sua primeira missão." },
                        { level: 2, emoji: "🛟", title: "Reserva consciente", detail: "Aprenda a relacionar reserva e liquidez." },
                        { level: 3, emoji: "📊", title: "Conhecedor de produtos", detail: "Explore renda fixa, fundos e renda variável." },
                        { level: 4, emoji: "🧭", title: "Decisão adequada", detail: "Conecte risco, perfil e objetivo." },
                        { level: 5, emoji: "🎓", title: "Desafio CPA", detail: "Conclua a missão integrada final." },
                      ].map((achievement) => {
                        const unlocked = missoesConcluidas.includes(achievement.level);
                        return <div key={achievement.title} className={`flex items-center gap-4 rounded-2xl border-2 p-4 ${unlocked ? "border-butter bg-butter-soft" : "border-line bg-cream opacity-60"}`}>
                          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-milk text-2xl">{unlocked ? achievement.emoji : "🔒"}</span>
                          <div><p className="font-display font-bold text-ink">{achievement.title}</p><p className="text-xs text-bark">{achievement.detail}</p></div>
                        </div>;
                      })}
                    </div>
                  </>
                )}
              </div>
              <TabBar active={screen} go={go} />
            </>
          )}

          {screen === "atividades" && (
            <div className="flex flex-1 flex-col px-6 pt-8">
              <button onClick={() => go("trilhas")} className="self-start text-2xl text-bark">←</button>
              <div className={`mt-4 rounded-3xl p-5 ${toneCls[trilha.tone].soft}`}>
                <span className="text-3xl">{trilha.emoji}</span>
                <p className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${toneCls[trilha.tone].text}`}>Nível {trilha.id} · {trilha.questions.length} decisões</p>
                <h2 className="font-display text-2xl font-bold text-ink">{trilha.missionTitle}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink">{trilha.missionBrief}</p>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-bark">
                <span>Missão em andamento</span><span>{Math.min(questoesConcluidas[trilha.id] ?? 0, trilha.questions.length)}/{trilha.questions.length} concluídas</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-mint transition-all" style={{ width: `${((questoesConcluidas[trilha.id] ?? 0) / trilha.questions.length) * 100}%` }} /></div>
              <div className="mt-5 flex-1 space-y-2 overflow-y-auto pb-4">
                {trilha.questions.map((item, index) => {
                  const done = index < (questoesConcluidas[trilha.id] ?? 0);
                  const current = index === questaoIndex;
                  return <div key={item.id} className={`flex items-center gap-3 rounded-xl border-2 p-3 ${current ? "border-mint bg-mint-soft" : "border-line bg-milk"}`}>
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-extrabold ${done ? "bg-mint text-milk" : current ? "bg-butter text-ink" : "bg-line text-bark"}`}>{done ? "✓" : index + 1}</span>
                    <div><p className="text-[10px] font-extrabold uppercase tracking-wider text-bark">{item.context}</p><p className="text-sm font-bold text-ink">{item.concept}</p></div>
                  </div>;
                })}
              </div>
              <div className="pb-8 pt-3"><Chunky onClick={() => go("desafio")}>{questaoIndex ? "Continuar missão" : "Começar missão"}</Chunky></div>
            </div>
          )}

          {screen === "desafio" && (
            <div className="flex flex-1 flex-col px-6 pt-8">
              <div className="flex items-center gap-4">
                <button onClick={() => go("atividades")} className="text-2xl text-bark">✕</button>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-mint transition-all" style={{ width: `${(questaoIndex / trilha.questions.length) * 100}%` }} /></div>
                <span className="shrink-0 text-sm font-extrabold text-coral">♥ {vidas}</span>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="self-start rounded-md bg-butter px-2 py-0.5 text-[10px] font-extrabold uppercase text-ink">{pergunta.context}</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-bark">{questaoIndex + 1} / {trilha.questions.length}</span>
              </div>
              <div className="mt-3 rounded-2xl bg-coral p-5 text-milk chunky shadow-coral-dark">
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-milk/75">{trilha.missionTitle}</p>
                <p className="mb-3 text-xs leading-relaxed text-milk/90">{trilha.missionBrief}</p>
                <p className="font-display text-xl font-bold leading-snug">{pergunta.prompt}</p>
              </div>
              <div className="mt-6 space-y-3">
                {apiError && <p role="alert" className="mt-4 rounded-xl bg-coral-soft p-3 text-sm font-semibold text-ink">{apiError} Sua resposta ainda não foi confirmada.</p>}
                {pergunta.options.map((o) => (
                  <button key={o.id} aria-pressed={resposta === o.id} onClick={() => setResposta(o.id)}
                    className={`chunky-sm flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left font-bold transition-all ${resposta === o.id ? "border-mint bg-mint-soft shadow-mint/40" : "border-line bg-milk shadow-line"} text-ink`}>
                    <span className={`grid size-8 place-items-center rounded-lg text-sm ${resposta === o.id ? "bg-mint text-milk" : "bg-cream text-bark"}`}>{o.id}</span>
                    {o.text}
                  </button>
                ))}
              </div>
              <div className="mt-auto pb-8 pt-8"><Chunky disabled={!resposta || submitting} onClick={enviarResposta}>{submitting ? "Enviando..." : apiError ? "Tentar enviar novamente" : "Conferir resposta"}</Chunky></div>
            </div>
          )}

          {screen === "resultado" && perguntaAtual && (() => {
            const acertou = respostaCorreta ?? perguntaAtual.correctOptionId === resposta;
            const feedback = respostaApi?.feedback ?? (acertou ? perguntaAtual.correctFeedback : perguntaAtual.incorrectFeedback);
            const missaoConcluida = acertou && (respostaApi?.missionCompleted ?? questaoIndex === trilha.questions.length - 1);
            const mistakeCoach = buildMistakeCoach(perguntaAtual, resposta);
            return (
              <div className="flex flex-1 flex-col px-6 pt-10">
                <img src={mascot} alt="" width={816} height={816} className={`mx-auto size-28 ${acertou ? "" : "grayscale-[40%]"}`} />
                <h2 className={`mt-3 text-center font-display text-3xl font-bold ${acertou ? "text-mint" : "text-coral"}`}>{acertou ? missaoConcluida ? "Missão concluída!" : "Boa decisão!" : "Vamos entender juntos"}</h2>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border-2 border-line bg-butter-soft p-4 text-center chunky-sm shadow-line">
                    <p className="text-[10px] font-extrabold uppercase text-bark">XP ganho</p>
                    <p className="font-display text-3xl font-bold text-ink">+{xpDaResposta}</p>
                  </div>
                  <div className="rounded-2xl border-2 border-line bg-mint-soft p-4 text-center chunky-sm shadow-line">
                    <p className="text-[10px] font-extrabold uppercase text-bark">Vidas · sequência</p>
                    <p className="font-display text-2xl font-bold text-ink">♥ {vidas} · 🔥 {sequencia}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border-2 border-line bg-cream p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-bark">Conceito-chave · {perguntaAtual.concept}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{feedback}</p>
                </div>
                {!acertou && (
                  <div className="mt-3 rounded-2xl border-2 border-coral/40 bg-coral-soft p-4">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-bark">Por que parecia tentador</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink">Voce escolheu: {mistakeCoach.selectedText}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink">{mistakeCoach.temptation}</p>
                    <p className="mt-2 text-sm font-bold leading-relaxed text-ink">{mistakeCoach.key}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink">{mistakeCoach.hint}</p>
                  </div>
                )}
                {acertou && missaoConcluida && (
                  <div className="mt-3 space-y-3">
                    <div className="rounded-2xl border-2 border-line bg-milk p-4">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-bark">Resumo da missao</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink">{trilha.missionSummary}</p>
                    </div>
                    <div className="rounded-2xl bg-butter-soft p-4 text-sm font-bold text-ink">{gemasDaResposta ? `+${gemasDaResposta} gemas - Proximo nivel desbloqueado` : "Revisao concluida - recompensas ja resgatadas"}</div>
                  </div>
                )}
                <div className="mt-auto space-y-3 pb-8 pt-8">
                  <Chunky onClick={continuarMissao}>{!acertou ? vidas === 0 ? "Reiniciar missão" : "Tentar de novo" : missaoConcluida ? "Ver próxima etapa" : "Continuar missão"}</Chunky>
                  <Chunky tone="milk" onClick={() => { setResposta(null); setPerguntaAtual(null); go("atividades"); }}>Ver mapa da missão</Chunky>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function StatsBar({ xp, gemas, sequencia }: { xp: number; gemas: number; sequencia: number }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 pb-4 pt-8">
      <div className="flex items-center gap-2 rounded-2xl border-b-4 border-line bg-cream px-3 py-1.5"><span className="text-lg">🔥</span><span className="text-sm font-bold text-ink">{sequencia}</span></div>
      <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-line">
        <div className="absolute inset-y-0 left-0 rounded-full bg-mint transition-all duration-700" style={{ width: `${((xp % 500) / 500) * 100}%` }} />
      </div>
      <div className="flex items-center gap-2 rounded-2xl border-b-4 border-line bg-cream px-3 py-1.5"><span className="text-lg">💎</span><span className="text-sm font-bold text-ink">{gemas}</span></div>
    </div>
  );
}

function LessonCard({ tone, emoji, sub, title, cta, onClick }: { tone: Tone; emoji: string; sub: string; title: string; cta: string; onClick: () => void }) {
  return (
    <div className={`chunky rounded-2xl p-5 ${toneCls[tone].card} ${toneCls[tone].shadow}`}>
      <div className="flex items-start justify-between">
        <div className="grid size-12 place-items-center rounded-xl bg-milk/20 text-2xl">{emoji}</div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-75">{sub}</p>
          <p className="font-display text-lg font-bold leading-tight">{title}</p>
        </div>
      </div>
      <button onClick={onClick} className={`chunky-sm mt-4 w-full rounded-xl bg-milk py-3 text-xs font-extrabold uppercase tracking-wider shadow-coral-soft transition-all active:translate-y-1 active:shadow-none ${toneCls[tone].text}`}>{cta}</button>
    </div>
  );
}

function TabBar({ active, go }: { active: Screen; go: (s: Screen) => void }) {
  const tabs: [string, string, Screen][] = [["🏠", "Aprender", "home"], ["🗺️", "Trilha", "trilhas"], ["🏆", "Conquistas", "conquistas"], ["👤", "Perfil", "perfil"]];
  return (
    <div className="mt-4 flex items-center justify-around border-t-4 border-line bg-milk px-4 py-4">
      {tabs.map(([e, l, s]) => {
        const on = s === active;
        return (
          <button key={l} aria-current={on ? "page" : undefined} onClick={() => go(s)} className={`flex flex-col items-center gap-1 ${on ? "" : "opacity-65"}`}>
            <div className={`grid size-12 place-items-center rounded-2xl text-2xl ${on ? "border-b-4 border-mint/20 bg-mint-soft" : ""}`}>{e}</div>
            <span className={`text-[10px] font-extrabold uppercase ${on ? "text-mint" : "text-bark"}`}>{l}</span>
          </button>
        );
      })}
    </div>
  );
}
