import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import mascot from "@/assets/mascot.png";

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

const TRILHAS: { id: number; titulo: string; emoji: string; tone: Tone; licoes: string[] }[] = [
  { id: 1, titulo: "Organize sua vida financeira", emoji: "🗂️", tone: "mint", licoes: ["Para onde vai meu dinheiro?", "Necessidade ou desejo?", "Como organizar renda e gastos?", "Como definir uma meta mensal?", "Como fazer o dinheiro sobrar?"] },
  { id: 2, titulo: "Domine seu cartão", emoji: "💳", tone: "coral", licoes: ["Limite não é renda", "Como funcionam fatura e vencimento?", "O perigo das compras parceladas", "Pagamento mínimo e crédito rotativo", "Como evitar uma fatura maior que sua renda?"] },
  { id: 3, titulo: "Prepare-se para investir", emoji: "🌱", tone: "butter", licoes: ["Por que investir?", "O que é uma reserva de emergência?", "Quanto consigo investir por mês?", "Risco, liquidez e rentabilidade", "Objetivos de curto, médio e longo prazo"] },
  { id: 4, titulo: "Conheça os investimentos", emoji: "📈", tone: "ink", licoes: ["Tesouro Direto", "CDB", "Fundos de investimento", "Comparação entre as alternativas", "Simulação final"] },
];

const toneCls: Record<Tone, { card: string; text: string; shadow: string; soft: string }> = {
  mint: { card: "bg-mint text-milk", text: "text-mint", shadow: "shadow-mint-dark", soft: "bg-mint-soft" },
  coral: { card: "bg-coral text-milk", text: "text-coral", shadow: "shadow-coral-dark", soft: "bg-coral-soft" },
  butter: { card: "bg-butter text-ink", text: "text-bark", shadow: "shadow-bark/40", soft: "bg-butter-soft" },
  ink: { card: "bg-ink text-cream", text: "text-ink", shadow: "shadow-bark", soft: "bg-line" },
};

const OPCOES = [
  { id: "A", texto: "Pagar a fatura inteira", certa: true, titulo: "Escolha segura! 🎉", explica: "Você quita os R$ 1.400 e fica com R$ 600 para o mês. Sem juros, sem dívida — e seu limite volta inteiro. Da próxima vez, tente manter a fatura abaixo de 30% da renda." },
  { id: "B", texto: "Pagar apenas o mínimo", certa: false, titulo: "Cuidado com o rotativo 😬", explica: "O restante (cerca de R$ 1.200) entra no crédito rotativo, com juros que podem passar de 400% ao ano. No mês seguinte a dívida já está maior. O mais seguro é pagar a fatura inteira." },
  { id: "C", texto: "Não pagar e deixar para o próximo mês", certa: false, titulo: "Essa sai caro 💸", explica: "Atrasar gera multa, juros de mora, rotativo e pode sujar seu nome. A dívida cresce rápido. Com R$ 2.000 de renda, dava para pagar tudo — essa é a alternativa mais segura." },
];

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
  const [trilha, setTrilha] = useState(TRILHAS[1]!);
  const [resposta, setResposta] = useState<string | null>(null);
  const [xp, setXp] = useState(320);
  const [gemas, setGemas] = useState(120);
  const nivel = 4 + Math.floor(xp / 500);
  const go = (s: Screen) => setScreen(s);
  const primeiro = nome.trim().split(" ")[0] || "Luísa";

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
                  <button key={o} onClick={() => setObjetivo(o)}
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
              <StatsBar xp={xp} gemas={gemas} />
              <div className="flex-1 px-6 py-4">
                {screen === "home" ? (
                  <>
                    <div className="mb-6 flex items-center gap-4">
                      <img src={mascot} alt="" width={816} height={816} className="size-20 shrink-0" />
                      <div className="rounded-2xl border-2 border-line bg-milk p-3">
                        <p className="font-display text-sm font-bold text-ink">Pronta para dominar seu cartão hoje, {primeiro}?</p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-bark">Nível {nivel} · {xp % 500}/500 XP</p>
                      </div>
                    </div>
                    <h2 className="mb-4 font-display text-xl font-bold text-ink">Continue de onde parou</h2>
                    <div className="space-y-4">
                      <LessonCard tone="coral" emoji="💳" sub="Trilha 2 · Lição 4 de 5" title="Pagamento mínimo e crédito rotativo"
                        onClick={() => { setTrilha(TRILHAS[1]!); go("desafio"); }} cta="Começar +50 XP" />
                      <div className="relative">
                        <div className="relative rounded-2xl border-2 border-line bg-cream p-5 chunky shadow-line">
                          <div className="flex items-start justify-between opacity-50">
                            <div className="grid size-12 place-items-center rounded-xl bg-line text-2xl">🛡️</div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-bark">Bloqueado</p>
                              <p className="font-display text-lg font-bold text-ink">Reserva de emergência</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Chunky tone="milk" onClick={() => go("trilhas")}>Ver todas as trilhas</Chunky>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mb-1 font-display text-2xl font-bold text-ink">Escolha uma trilha</h2>
                    <p className="mb-5 text-sm text-bark">Objetivo: {objetivo || "Evitar dívidas"}</p>
                    <div className="space-y-4">
                      {TRILHAS.map((t, i) => (
                        <button key={t.id} onClick={() => { setTrilha(t); go("atividades"); }}
                          className={`chunky flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all active:translate-y-1 active:shadow-none ${toneCls[t.tone].card} ${toneCls[t.tone].shadow}`}>
                          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-milk/20 text-2xl">{t.emoji}</div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-75">Trilha {t.id} · {[60, 40, 0, 0][i]}%</p>
                            <p className="font-display text-lg font-bold leading-tight">{t.titulo}</p>
                          </div>
                        </button>
                      ))}
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
                <p className={`mt-2 text-[10px] font-bold uppercase tracking-widest ${toneCls[trilha.tone].text}`}>Trilha {trilha.id}</p>
                <h2 className="font-display text-2xl font-bold text-ink">{trilha.titulo}</h2>
              </div>
              <div className="mt-6 space-y-3 pb-8">
                {trilha.licoes.map((l, i) => {
                  const done = i < 3, atual = i === 3;
                  return (
                    <button key={l} disabled={!done && !atual} onClick={() => go("desafio")}
                      className={`chunky-sm flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left font-bold transition-all ${atual ? "border-mint bg-mint-soft text-ink shadow-mint/40" : "border-line bg-milk text-ink shadow-line"} disabled:opacity-40`}>
                      <span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm ${done ? "bg-mint text-milk" : atual ? "bg-butter text-ink" : "bg-line text-bark"}`}>{done ? "✓" : atual ? "▶" : "🔒"}</span>
                      <span className="flex-1 text-sm">{l}</span>
                      {atual && <span className="text-[10px] font-extrabold uppercase text-mint">+50 XP</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {screen === "desafio" && (
            <div className="flex flex-1 flex-col px-6 pt-8">
              <div className="flex items-center gap-4">
                <button onClick={() => go("home")} className="text-2xl text-bark">✕</button>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-line"><div className="h-full w-[80%] rounded-full bg-mint" /></div>
              </div>
              <span className="mt-8 self-start rounded-md bg-butter px-2 py-0.5 text-[10px] font-extrabold uppercase text-ink">Situação real</span>
              <div className="mt-3 rounded-2xl bg-coral p-5 text-milk chunky shadow-coral-dark">
                <p className="font-display text-xl font-bold leading-snug">Você recebe R$ 2.000 por mês e sua fatura está em R$ 1.400. O que você faria?</p>
              </div>
              <div className="mt-6 space-y-3">
                {OPCOES.map((o) => (
                  <button key={o.id} onClick={() => setResposta(o.id)}
                    className={`chunky-sm flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left font-bold transition-all ${resposta === o.id ? "border-mint bg-mint-soft shadow-mint/40" : "border-line bg-milk shadow-line"} text-ink`}>
                    <span className={`grid size-8 place-items-center rounded-lg text-sm ${resposta === o.id ? "bg-mint text-milk" : "bg-cream text-bark"}`}>{o.id}</span>
                    {o.texto}
                  </button>
                ))}
              </div>
              <div className="mt-auto pb-8 pt-8">
                <Chunky disabled={!resposta} onClick={() => {
                  const ok = OPCOES.find((o) => o.id === resposta)?.certa;
                  setXp((x) => x + (ok ? 50 : 10)); setGemas((g) => g + (ok ? 15 : 0)); go("resultado");
                }}>Confirmar</Chunky>
              </div>
            </div>
          )}

          {screen === "resultado" && (() => {
            const r = OPCOES.find((o) => o.id === resposta)!;
            return (
              <div className="flex flex-1 flex-col px-6 pt-10">
                <img src={mascot} alt="" width={816} height={816} className={`mx-auto size-32 ${r.certa ? "" : "grayscale-[40%]"}`} />
                <h2 className={`mt-4 text-center font-display text-3xl font-bold ${r.certa ? "text-mint" : "text-coral"}`}>{r.titulo}</h2>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border-2 border-line bg-butter-soft p-4 text-center chunky-sm shadow-line">
                    <p className="text-[10px] font-extrabold uppercase text-bark">XP ganho</p>
                    <p className="font-display text-3xl font-bold text-ink">+{r.certa ? 50 : 10}</p>
                  </div>
                  <div className="rounded-2xl border-2 border-line bg-mint-soft p-4 text-center chunky-sm shadow-line">
                    <p className="text-[10px] font-extrabold uppercase text-bark">Gemas</p>
                    <p className="font-display text-3xl font-bold text-ink">💎 +{r.certa ? 15 : 0}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl border-2 border-line bg-cream p-4">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-bark">O que acontece</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{r.explica}</p>
                </div>
                {!r.certa && (
                  <div className="mt-3 rounded-2xl bg-mint-soft p-4 text-sm font-semibold text-mint-dark">✓ Mais seguro: A) Pagar a fatura inteira.</div>
                )}
                <div className="mt-auto space-y-3 pb-8 pt-8">
                  <Chunky onClick={() => { setResposta(null); go("home"); }}>Continuar</Chunky>
                  {!r.certa && <Chunky tone="milk" onClick={() => { setResposta(null); go("desafio"); }}>Tentar de novo</Chunky>}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function StatsBar({ xp, gemas }: { xp: number; gemas: number }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 pb-4 pt-8">
      <div className="flex items-center gap-2 rounded-2xl border-b-4 border-line bg-cream px-3 py-1.5"><span className="text-lg">🔥</span><span className="text-sm font-bold text-ink">3</span></div>
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
