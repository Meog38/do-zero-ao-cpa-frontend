import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import mascot from "@/assets/mascot.png";
import { GEMS_PER_COMPLETED_MISSION, LEARNING_LEVELS, STARTER_HEARTS, XP_PER_CORRECT_ANSWER, XP_PER_INCORRECT_ANSWER, type LearningLevel, type LearningQuestion } from "@/lib/learning-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brainvest — Aprenda finanças jogando" },
      { name: "description", content: "Domine seu cartão, organize seu dinheiro e comece a investir com desafios curtos e interativos." },
      { property: "og:title", content: "Brainvest — Aprenda finanças jogando" },
      { property: "og:description", content: "Educação financeira gamificada para jovens estudantes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: App,
});

type Screen = "splash" | "auth" | "perfil" | "home" | "trilhas" | "atividades" | "desafio" | "resultado";
type Tone = "mint" | "coral" | "butter" | "ink";

const toneCls: Record<Tone, { card: string; text: string; shadow: string; soft: string }> = {
  mint: { card: "bg-mint text-milk", text: "text-mint", shadow: "shadow-mint-dark", soft: "bg-mint-soft" },
  coral: { card: "bg-coral text-milk", text: "text-coral", shadow: "shadow-coral-dark", soft: "bg-coral-soft" },
  butter: { card: "bg-butter text-ink", text: "text-bark", shadow: "shadow-bark/40", soft: "bg-butter-soft" },
  ink: { card: "bg-ink text-cream", text: "text-ink", shadow: "shadow-bark", soft: "bg-line" },
};

function Chunky({ onClick, tone = "mint", children, className = "", disabled }: { onClick?: () => void; tone?: Tone | "milk"; children: ReactNode; className?: string; disabled?: boolean }) {
  const t = tone === "milk" ? "bg-milk text-ink border-2 border-line shadow-line" : `${toneCls[tone].card} ${toneCls[tone].shadow}`;
  return (
    <button disabled={disabled} onClick={onClick} className={`chunky-sm w-full rounded-2xl py-3.5 text-sm font-extrabold uppercase tracking-wider transition-all active:translate-y-1 active:shadow-none disabled:opacity-40 ${t} ${className}`}>
      {children}
    </button>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [nome, setNome] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [trilha, setTrilha] = useState<LearningLevel>(LEARNING_LEVELS[0]!);
  const [resposta, setResposta] = useState<string | null>(null);
  const [questaoIndex, setQuestaoIndex] = useState(0);
  const [vidas, setVidas] = useState(STARTER_HEARTS);
  const [sequencia, setSequencia] = useState(0);
  const [xp, setXp] = useState(0);
  const [gemas, setGemas] = useState(0);
  const [missoesConcluidas, setMissoesConcluidas] = useState<number[]>([]);
  const [questoesConcluidas, setQuestoesConcluidas] = useState<Record<number, number>>({});
  const [perguntaAtual, setPerguntaAtual] = useState<LearningQuestion | null>(null);
  const nivel = 1 + Math.floor(xp / 500);
  const go = (s: Screen) => setScreen(s);
  const primeiro = nome.trim().split(" ")[0] || "Luísa";
  const pergunta = trilha.questions[questaoIndex]!;

  const iniciarMissao = (nivelAprendizagem: LearningLevel) => {
    setTrilha(nivelAprendizagem);
    setQuestaoIndex(missoesConcluidas.includes(nivelAprendizagem.id) ? 0 : (questoesConcluidas[nivelAprendizagem.id] ?? 0));
    setVidas(STARTER_HEARTS);
    setSequencia(0);
    setResposta(null);
    setPerguntaAtual(null);
    go("atividades");
  };

  const enviarResposta = () => {
    const acertou = pergunta.correctOptionId === resposta;
    const ultimaDaMissao = questaoIndex === trilha.questions.length - 1;
    setPerguntaAtual(pergunta);
    setXp((total) => total + (acertou ? XP_PER_CORRECT_ANSWER : XP_PER_INCORRECT_ANSWER));
    setSequencia((total) => acertou ? total + 1 : 0);
    if (!acertou) setVidas((total) => Math.max(0, total - 1));
    if (acertou && ultimaDaMissao) {
      setMissoesConcluidas((concluidas) => concluidas.includes(trilha.id) ? concluidas : [...concluidas, trilha.id]);
      setGemas((total) => total + GEMS_PER_COMPLETED_MISSION);
      setQuestoesConcluidas((concluidas) => ({ ...concluidas, [trilha.id]: trilha.questions.length }));
    } else if (acertou) {
      setQuestoesConcluidas((concluidas) => ({ ...concluidas, [trilha.id]: Math.max(concluidas[trilha.id] ?? 0, questaoIndex + 1) }));
    }
    go("resultado");
  };

  const continuarMissao = () => {
    if (perguntaAtual?.correctOptionId !== resposta) {
      if (vidas === 0) {
        setQuestaoIndex(0);
        setVidas(STARTER_HEARTS);
      }
      setResposta(null);
      setPerguntaAtual(null);
      go("desafio");
      return;
    }
    if (questaoIndex === trilha.questions.length - 1) {
      setResposta(null);
      setPerguntaAtual(null);
      go("home");
      return;
    }
    setQuestaoIndex((index) => index + 1);
    setResposta(null);
    setPerguntaAtual(null);
    go("desafio");
  };

  return (
    <div className="flex min-h-screen justify-center bg-cream px-3 py-6">
      <div className="flex w-full max-w-[420px] flex-col overflow-hidden rounded-[40px] border-x-2 border-t-2 border-line bg-milk chunky shadow-line" style={{ minHeight: 780 }}>
        <div key={screen} className="animate-pop flex flex-1 flex-col">
          {screen === "splash" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
              <img src={mascot} alt="Coruja Brainvest" width={816} height={816} className="size-48" />
              <h1 className="font-display text-5xl font-bold text-mint">brainvest</h1>
              <p className="max-w-[28ch] text-bark">Aprenda a usar o cartão, organizar seu dinheiro e investir — jogando.</p>
              <div className="mt-6 w-full space-y-3">
                <Chunky onClick={() => go("auth")}>Começar agora</Chunky>
                <Chunky tone="milk" onClick={() => go("auth")}>Já tenho conta</Chunky>
              </div>
            </div>
          )}

          {screen === "auth" && (
            <div className="flex flex-1 flex-col px-7 pt-10">
              <button onClick={() => go("splash")} className="self-start text-2xl text-bark">←</button>
              <h2 className="mt-6 font-display text-3xl font-bold text-ink">Crie seu perfil</h2>
              <p className="mt-1 text-sm text-bark">Leva menos de 1 minuto.</p>
              <div className="mt-8 space-y-3">
                {[
                  { ph: "Seu nome", v: nome, set: setNome },
                  { ph: "E-mail", v: undefined, set: undefined },
                  { ph: "Senha", v: undefined, set: undefined, type: "password" },
                ].map((f) => (
                  <input key={f.ph} type={f.type ?? "text"} placeholder={f.ph} value={f.v} onChange={f.set ? (e) => f.set!(e.target.value) : undefined}
                    className="w-full rounded-2xl border-2 border-line bg-cream px-4 py-3.5 font-semibold text-ink outline-none placeholder:text-bark/50 focus:border-mint" />
                ))}
              </div>
              <div className="mt-auto pb-8 pt-8"><Chunky onClick={() => go("perfil")}>Cadastrar</Chunky></div>
            </div>
          )}

          {screen === "perfil" && (
            <div className="flex flex-1 flex-col px-7 pt-10">
              <div className="flex items-center gap-4">
                <img src={mascot} alt="" width={816} height={816} className="size-20" />
                <div className="relative rounded-2xl border-2 border-line bg-milk p-3">
                  <p className="font-display text-sm font-bold text-ink">Oi, {primeiro}! Qual é seu principal objetivo?</p>
                </div>
              </div>
              <div className="mt-8 space-y-3">
                {[["🧾", "Organizar meu dinheiro"], ["🛡️", "Evitar dívidas"], ["🌱", "Aprender a investir"]].map(([e, o]) => (
                  <button key={o} onClick={() => setObjetivo(o!)}
                    className={`chunky-sm flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left font-bold transition-all ${objetivo === o ? "border-mint bg-mint-soft text-mint shadow-mint/30" : "border-line bg-milk text-ink shadow-line"}`}>
                    <span className="text-2xl">{e}</span>{o}
                  </button>
                ))}
              </div>
              <div className="mt-auto pb-8 pt-8"><Chunky disabled={!objetivo} onClick={() => go("home")}>Continuar</Chunky></div>
            </div>
          )}

          {(screen === "home" || screen === "trilhas") && (
            <>
              <StatsBar xp={xp} gemas={gemas} sequencia={sequencia} />
              <div className="flex-1 px-6 py-4">
                {screen === "home" ? (
                  <>
                    <div className="mb-6 flex items-center gap-4">
                      <img src={mascot} alt="" width={816} height={816} className="size-20 shrink-0" />
                      <div className="rounded-2xl border-2 border-line bg-milk p-3">
                        <p className="font-display text-sm font-bold text-ink">Do primeiro salário ao primeiro investimento, {primeiro}.</p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-bark">{missoesConcluidas.length} de {LEARNING_LEVELS.length} missões · Nível {nivel}</p>
                      </div>
                    </div>
                    <h2 className="mb-4 font-display text-xl font-bold text-ink">Sua próxima decisão</h2>
                    <div className="space-y-4">
                      {(() => {
                        const proxima = LEARNING_LEVELS.find((item) => !missoesConcluidas.includes(item.id)) ?? LEARNING_LEVELS[LEARNING_LEVELS.length - 1]!;
                        const progresso = missoesConcluidas.includes(proxima.id) ? proxima.questions.length : (questoesConcluidas[proxima.id] ?? 0);
                        return <LessonCard tone={proxima.tone} emoji={proxima.emoji} sub={`Nível ${proxima.id} · ${progresso} de ${proxima.questions.length} etapas`} title={proxima.missionTitle}
                          onClick={() => iniciarMissao(proxima)} cta={progresso ? "Continuar missão" : "Começar missão"} />;
                      })()}
                      <div className="rounded-2xl border-2 border-line bg-cream p-4">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-bark">Sua jornada</p>
                        <div className="mt-3 flex items-center gap-2">
                          {LEARNING_LEVELS.map((item) => <span key={item.id} title={item.title} className={`grid size-9 flex-1 place-items-center rounded-xl text-lg ${missoesConcluidas.includes(item.id) ? "bg-mint text-milk" : item.id === (missoesConcluidas.length + 1) ? "bg-butter text-ink" : "bg-line text-bark opacity-50"}`}>{missoesConcluidas.includes(item.id) ? "✓" : item.emoji}</span>)}
                        </div>
                        <p className="mt-2 text-xs font-semibold text-bark">Cotidiano <span aria-hidden="true">→</span> decisões de investimento <span aria-hidden="true">→</span> CPA</p>
                      </div>
                      <Chunky tone="milk" onClick={() => go("trilhas")}>Explorar mapa de aprendizagem</Chunky>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mb-1 font-display text-2xl font-bold text-ink">Do cotidiano ao CPA</h2>
                    <p className="mb-5 text-sm text-bark">Cada etapa prepara você para a próxima. Objetivo: {objetivo || "Aprender a investir"}</p>
                    <div className="space-y-4">
                      {LEARNING_LEVELS.map((item) => {
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
                {pergunta.options.map((o) => (
                  <button key={o.id} aria-pressed={resposta === o.id} onClick={() => setResposta(o.id)}
                    className={`chunky-sm flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left font-bold transition-all ${resposta === o.id ? "border-mint bg-mint-soft shadow-mint/40" : "border-line bg-milk shadow-line"} text-ink`}>
                    <span className={`grid size-8 place-items-center rounded-lg text-sm ${resposta === o.id ? "bg-mint text-milk" : "bg-cream text-bark"}`}>{o.id}</span>
                    {o.text}
                  </button>
                ))}
              </div>
              <div className="mt-auto pb-8 pt-8"><Chunky disabled={!resposta} onClick={enviarResposta}>Conferir resposta</Chunky></div>
            </div>
          )}

          {screen === "resultado" && perguntaAtual && (() => {
            const acertou = perguntaAtual.correctOptionId === resposta;
            const feedback = acertou ? perguntaAtual.correctFeedback : perguntaAtual.incorrectFeedback;
            const missaoConcluida = acertou && questaoIndex === trilha.questions.length - 1;
            return (
              <div className="flex flex-1 flex-col px-6 pt-10">
                <img src={mascot} alt="" width={816} height={816} className={`mx-auto size-28 ${acertou ? "" : "grayscale-[40%]"}`} />
                <h2 className={`mt-3 text-center font-display text-3xl font-bold ${acertou ? "text-mint" : "text-coral"}`}>{acertou ? missaoConcluida ? "Missão concluída!" : "Boa decisão!" : "Vamos entender juntos"}</h2>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border-2 border-line bg-butter-soft p-4 text-center chunky-sm shadow-line">
                    <p className="text-[10px] font-extrabold uppercase text-bark">XP ganho</p>
                    <p className="font-display text-3xl font-bold text-ink">+{acertou ? XP_PER_CORRECT_ANSWER : XP_PER_INCORRECT_ANSWER}</p>
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
                {acertou && missaoConcluida && <div className="mt-3 rounded-2xl bg-butter-soft p-4 text-sm font-bold text-ink">🏅 +{GEMS_PER_COMPLETED_MISSION} gemas · Próximo nível desbloqueado</div>}
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
  const tabs: [string, string, Screen | null][] = [["🏠", "Aprender", "home"], ["🗂️", "Trilhas", "trilhas"], ["🏆", "Ranking", null], ["👤", "Perfil", null]];
  return (
    <div className="mt-4 flex items-center justify-around border-t-4 border-line bg-milk px-4 py-4">
      {tabs.map(([e, l, s]) => {
        const on = s === active;
        return (
          <button key={l} onClick={() => s && go(s)} className={`flex flex-col items-center gap-1 ${on ? "" : "opacity-40"}`}>
            <div className={`grid size-12 place-items-center rounded-2xl text-2xl ${on ? "border-b-4 border-mint/20 bg-mint-soft" : ""}`}>{e}</div>
            <span className={`text-[10px] font-extrabold uppercase ${on ? "text-mint" : "text-bark"}`}>{l}</span>
          </button>
        );
      })}
    </div>
  );
}
