import { useMemo, useState } from "react";

// --- Datenbasis: Multiple-Choice-Fragen nach Themen ---
// Felder: id, cat, q, options, correct (Index), expl
const BANK = [
  // Zeitleiste 1871–1914
  { id: 1, cat: "Zeitleiste", q: "Welches Ergebnis des Kriegs 1870/71 belastete das Verhältnis FR–DE stark?", options: ["Annexion Bosniens", "Verlust Elsass-Lothringen", "Entente cordiale", "Rückversicherungsvertrag"], correct: 1, expl: "Frankreich verlor Elsass-Lothringen an das neu gegründete Deutsche Reich (1871)." },
  { id: 2, cat: "Zeitleiste", q: "Welche Allianz schloss Bismarck 1879?", options: ["Triple Entente", "Zweibund mit Österreich-Ungarn", "Dreibund mit Italien", "Anglo-russische Konvention"], correct: 1, expl: "1879 schloss das Deutsche Reich den Zweibund mit Österreich-Ungarn." },
  { id: 3, cat: "Zeitleiste", q: "Was geschah 1890 außenpolitisch folgenschwer?", options: ["Erneuerung des Rückversicherungsvertrags", "Abdankung Wilhelms II.", "Nichtverlängerung des Rückversicherungsvertrags mit Russland", "Unterzeichnung der Entente cordiale"], correct: 2, expl: "Nach Bismarcks Entlassung wurde der Rückversicherungsvertrag mit Russland nicht erneuert." },
  { id: 4, cat: "Zeitleiste", q: "Wer waren die Partner der Allianz von 1894?", options: ["Deutschland–Österreich", "Frankreich–Russland", "Großbritannien–Deutschland", "Italien–Russland"], correct: 1, expl: "1894 kam es zur französisch-russischen Allianz." },
  { id: 5, cat: "Zeitleiste", q: "Wozu führten die deutschen Flottengesetze ab 1898?", options: ["Entspannung mit Großbritannien", "Rivalität mit Großbritannien", "Bündnis mit Großbritannien", "Auflösung der Entente"], correct: 1, expl: "Der Tirpitz-Flottenbau verschärfte die Rivalität mit Großbritannien." },
  { id: 6, cat: "Zeitleiste", q: "Wer schloss 1904 die Entente cordiale?", options: ["Deutschland–Russland", "Deutschland–Frankreich", "Großbritannien–Frankreich", "Österreich–Serbien"], correct: 2, expl: "1904 vereinbarten Großbritannien und Frankreich die Entente cordiale." },
  { id: 7, cat: "Zeitleiste", q: "Was bewirkte die 1. Marokkokrise 1905/06?", options: ["Entfremdung GB–FR", "Annäherung FR–DE", "Festigung der Entente gegen Deutschland", "Bündnis DE–RU"], correct: 2, expl: "Die deutsche Marokkopolitik stärkte die Entente gegen Deutschland." },
  { id: 8, cat: "Zeitleiste", q: "Welche Folge hatte die Anglo-russische Konvention von 1907?", options: ["Auflösung des Zweibunds", "Vollendung der Triple Entente", "Beitritt Deutschlands zur Entente", "Neutralität Großbritanniens"], correct: 1, expl: "Mit ihr war die Triple Entente (FR–RU–GB) komplett." },
  { id: 9, cat: "Zeitleiste", q: "Wer betrieb 1908/09 die Bosnien-Annexion?", options: ["Aehrenthal (ÖU)", "Bethmann Hollweg (DE)", "Sasonow (RU)", "Grey (GB)"], correct: 0, expl: "Alois von Aehrenthal, österr.-ung. Außenminister, leitete die Annexion Bosniens ein." },
  { id: 10, cat: "Zeitleiste", q: "Wofür steht 'Agadir' 1911?", options: ["2. Marokkokrise", "Balkankrieg", "Bosnienkrise", "Entente cordiale"], correct: 0, expl: "Das deutsch-französische Kräftemessen in Agadir war die 2. Marokkokrise." },
  { id: 11, cat: "Zeitleiste", q: "Welche Wirkung hatten die Balkankriege 1912/13?", options: ["Stärkung Österreich-Ungarns", "Schwächung Serbiens", "Stärkung Serbiens, Wien fühlt sich bedroht", "Annäherung DE–GB"], correct: 2, expl: "Serbien gewann an Gewicht; Wien sah seine Position gefährdet." },
  { id: 12, cat: "Zeitleiste", q: "Was kennzeichnet 1913 europaweit?", options: ["Abrüstung", "Heeres- und Flottenaufrüstungen", "Auflösung der Entente", "Austritt Italiens aus dem Dreibund"], correct: 1, expl: "Heeresprogramme und deutsche Heeresvorlage verstärkten das Wettrüsten." },
  { id: 13, cat: "Zeitleiste", q: "Wann war das Attentat von Sarajevo?", options: ["28. Juni 1914", "23. Juli 1914", "1. August 1914", "4. August 1914"], correct: 0, expl: "Am 28. Juni 1914 erschoss Gavrilo Princip Erzherzog Franz Ferdinand." },

  // Julikrise
  { id: 20, cat: "Julikrise", q: "Wer verübte das Attentat von Sarajevo?", options: ["Apis (D. Dimitrijević)", "Gavrilo Princip", "Nikola Pašić", "Alexander v. Hoyos"], correct: 1, expl: "Der Attentäter war Gavrilo Princip, Mitglied eines serbisch-nationalistischen Netzwerks." },
  { id: 21, cat: "Julikrise", q: "Was bezeichnet der 'Blankoscheck' (5.–6. Juli 1914)?", options: ["RU-Zusicherung an Serbien", "FR-Zusage an RU", "DE-Zusicherung an ÖU, volle Unterstützung gegen Serbien", "GB-Garantie an Belgien"], correct: 2, expl: "Berlin (Wilhelm II., Bethmann Hollweg, Jagow) sicherte Wien volle Unterstützung zu." },
  { id: 22, cat: "Julikrise", q: "Wer brauchte die Blankoscheck-Zusage ein?", options: ["Leopold Berchtold", "Alexander von Hoyos", "Franz Conrad v. Hötzendorf", "István Tisza"], correct: 1, expl: "Alexander von Hoyos brachte die Zusage aus Berlin nach Wien (Hoyos-Mission)." },
  { id: 23, cat: "Julikrise", q: "Wann wurde das Ultimatum an Serbien gestellt?", options: ["28. Juni", "23. Juli", "25. Juli", "28. Juli"], correct: 1, expl: "Österreich-Ungarn stellte am 23. Juli 1914 ein äußerst hartes Ultimatum." },
  { id: 24, cat: "Julikrise", q: "Wie reagierte Serbien am 25. Juli?", options: ["Lehnte vollständig ab", "Akzeptierte fast alles, stritt Kernpunkte ab", "Akzeptierte alles", "Erklärte Österreich sofort den Krieg"], correct: 1, expl: "Pašić akzeptierte fast alle Forderungen, lehnte aber die entscheidenden ab." },
  { id: 25, cat: "Julikrise", q: "Wann erklärte ÖU Serbien den Krieg?", options: ["25. Juli", "28. Juli", "30. Juli", "1. August"], correct: 1, expl: "Am 28. Juli 1914 erfolgte die Kriegserklärung Österreich-Ungarns an Serbien." },
  { id: 26, cat: "Julikrise", q: "Wer ordnete am 30. Juli die russische Generalmobilmachung an?", options: ["Zar Nikolaus II.", "Sergei Sasonow", "Sukhomlinow", "Alle drei wirkten, formell entschied der Zar"], correct: 3, expl: "Außenminister Sasonow und Kriegsminister Sukhomlinow drängten; der Zar befahl." },
  { id: 27, cat: "Julikrise", q: "Welche Kette folgte am 1./3./4. August?", options: ["FR→RU Krieg, DE neutral", "DE erklärt RU und FR den Krieg; Einmarsch in Belgien → GB tritt ein", "RU erklärt DE den Krieg; GB bleibt neutral", "ÖU erklärt GB den Krieg"], correct: 1, expl: "1.8. DE–RU, 3.8. DE–FR, 4.8. Belgien → GB tritt ein." },

  // Personen
  { id: 30, cat: "Personen", q: "Wofür steht Wilhelm II. 1914 politisch?", options: ["Vermittlung zwischen FR und RU", "Blankoscheck und Flottenpolitik", "Neutralitätspolitik", "Abrüstung"], correct: 1, expl: "Wilhelm II. trug Flottenbau und die Blankoscheck-Zusage mit." },
  { id: 31, cat: "Personen", q: "Welche Rolle spielte Bethmann Hollweg?", options: ["Franz. Präsident", "Russ. Außenminister", "Deutscher Reichskanzler, harte Linie im Juli 1914", "Österr. Generalstabschef"], correct: 2, expl: "Bethmann Hollweg war Reichskanzler und trieb die harte Linie mit voran." },
  { id: 32, cat: "Personen", q: "Gottlieb von Jagow war…", options: ["dt. Staatssekretär des AA", "brit. Außenminister", "serb. Premier", "russ. Kriegsminister"], correct: 0, expl: "Jagow war Staatssekretär im Auswärtigen Amt und stützte Wiens Kurs." },
  { id: 33, cat: "Personen", q: "Moltke d. J. stand für…", options: ["Plan XVII", "Schlieffen-Plan-Umsetzung und Zeitdruck", "Entente cordiale", "Bosnien-Annexion"], correct: 1, expl: "Er trieb die starre Umsetzung des Schlieffen-Plans voran." },
  { id: 34, cat: "Personen", q: "Der Schlieffen-Plan sah vor…", options: ["Angriff über Belgien auf Frankreich", "Defensive an Westfront", "Erstschlag gegen Russland", "Seeblockade gegen GB"], correct: 0, expl: "Schneller Sieg gegen Frankreich durch Belgien, dann gegen Russland." },
  { id: 35, cat: "Personen", q: "Tirpitz ist verbunden mit…", options: ["Heeresreform RU", "Flottenbau DE", "Marokkokrise FR", "Plan XVII"], correct: 1, expl: "Alfred von Tirpitz gilt als Architekt der deutschen Hochseeflotte." },
  { id: 36, cat: "Personen", q: "Berchtold war…", options: ["russ. Außenminister", "österr. Außenminister, Ultimatum an Serbien", "brit. Premier", "franz. Generalstabschef"], correct: 1, expl: "Leopold Graf Berchtold war ÖU-Außenminister und treibend beim Ultimatum." },
  { id: 37, cat: "Personen", q: "Conrad von Hötzendorf forderte…", options: ["Abrüstung", "Vermittlung", "präventive Kriege gegen Serbien/Italien", "Seebündnis mit GB"], correct: 2, expl: "Der österr. Generalstabschef plädierte jahrelang für Krieg." },
  { id: 38, cat: "Personen", q: "István Tisza…", options: ["befürwortete sofort Krieg", "bremste zunächst, stimmte dann zu", "war franz. Botschafter", "war König Belgiens"], correct: 1, expl: "Der ungarische Ministerpräsident zögerte, gab dann seine Zustimmung." },
  { id: 39, cat: "Personen", q: "Nikola Pašić war…", options: ["serb. Premier, moderierte die Antwort", "russ. Außenminister", "brit. Außenminister", "dt. Botschafter in London"], correct: 0, expl: "Pašić akzeptierte vieles, lehnte Kernpunkte ab." },
  { id: 40, cat: "Personen", q: "Wer warnte Berlin, dass GB nicht neutral bleiben werde?", options: ["Lichnowsky", "Poincaré", "Grey", "Paléologue"], correct: 0, expl: "Botschafter Karl Max Fürst Lichnowsky warnte aus London." },
  { id: 41, cat: "Personen", q: "Aehrenthal ist verbunden mit…", options: ["Entente cordiale", "Bosnien-Annexion 1908", "Plan XVII", "Flottengesetze"], correct: 1, expl: "Alois von Aehrenthal verantwortete die Bosnien-Annexion." },
  { id: 42, cat: "Personen", q: "Wer verweigerte 1914 den Durchmarsch der Deutschen?", options: ["Albert I. von Belgien", "Nikolaus II.", "Asquith", "Tisza"], correct: 0, expl: "König Albert I. verweigerte den Durchmarsch, GB trat ein." },
  { id: 43, cat: "Personen", q: "Poincaré und Paléologue stehen für…", options: ["Abrüstung", "Rückzug aus RU", "festen FR-RU Schulterschluss", "Neutralität FR"], correct: 2, expl: "Sie banden Frankreich eng an Russland." },
  { id: 44, cat: "Personen", q: "Wer war britischer Außenminister 1914?", options: ["Edward Grey", "Neville Chamberlain", "David Lloyd George", "Arthur Balfour"], correct: 0, expl: "Sir Edward Grey war 1914 Außenminister." },

  // Bündnisse & Mechanik
  { id: 50, cat: "Bündnisse & Mechanik", q: "Welche Kombination erklärt die 'Kriegsautomatik'?", options: ["Demokratisierung + Handel", "Bündnisse + starre Aufmarschpläne", "Abrüstung + Vermittlung", "Kolonialabgaben + Zollunion"], correct: 1, expl: "Bündnissysteme gekoppelt mit Mobilmachungsplänen erzeugten Zeitdruck und Automatismen." },
  { id: 51, cat: "Bündnisse & Mechanik", q: "Welcher Plan ist französisch?", options: ["Plan XVII", "Schlieffen-Plan", "Barbarossa", "Gallipoli"], correct: 0, expl: "Plan XVII war der französische Angriffs-/Aufmarschplan 1913/14." },
  { id: 52, cat: "Bündnisse & Mechanik", q: "Welche Aussage trifft die Eskalationslogik am besten?", options: ["Mobilmachung = reine Übung", "Mobilmachung erzeugt Zwang zum Erstschlag", "Ultimaten sind unverbindlich", "Belgische Neutralität war irrelevant"], correct: 1, expl: "Mobilmachung galt als Kriegseintrittsvorstufe und erzeugte Zeitdruck." },

  // Merksatz
  { id: 68, cat: "Merksatz", q: "Welcher Merksatz fasst es?", options: ["Menschen luden die Pistole, Strukturen drückten ab", "Strukturen luden die Pistole, Menschen drückten ab", "Wirtschaft lüstete nach Krieg", "Alle waren unschuldig"], correct: 1, expl: "Strukturen luden die Pistole. Menschen drückten ab." },
];

const CATS = ["Alle", ...Array.from(new Set(BANK.map((q) => q.cat)))];

function shuffle(arr: any[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App(): JSX.Element {
  const [cat, setCat] = useState("Alle");
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [showExpl, setShowExpl] = useState(false);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [shuffleOn, setShuffleOn] = useState(true);

  const pool = useMemo(() => {
    const base = cat === "Alle" ? BANK : BANK.filter((q) => q.cat === cat);
    return shuffleOn ? shuffle(base) : base;
  }, [cat, shuffleOn, started]);

  const total = pool.length;
  const current = pool[step];

  function startQuiz() {
    setStarted(true);
    setStep(0);
    setPicked(null);
    setShowExpl(false);
    setScore(0);
    setWrong([]);
  }

  function pickOption(i: number) {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === current.correct;
    if (correct) setScore((s) => s + 1);
    else setWrong((w) => [...w, current.id]);
    setShowExpl(true);
  }

  function next() {
    if (step + 1 < total) {
      setStep((s) => s + 1);
      setPicked(null);
      setShowExpl(false);
    } else {
      setStarted(false);
    }
  }

  const progress = total ? Math.round((step / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Lern-App: Erster Weltkrieg</h1>
          <span className="text-sm opacity-70">MC-Quiz · Kategorien · Erklärungen</span>
        </header>

        {/* Steuerleiste */}
        {!started && (
          <div className="bg-white rounded-2xl shadow p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">Kategorie</label>
              <select
                className="mt-1 w-full border rounded-xl p-2"
                value={cat}
                onChange={(e) => setCat(e.target.value)}
              >
                {CATS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <input id="shuffle" type="checkbox" checked={shuffleOn} onChange={(e)=>setShuffleOn(e.target.checked)} />
              <label htmlFor="shuffle" className="text-sm">Zufällige Reihenfolge</label>
            </div>
            <div className="flex items-end justify-end">
              <button onClick={startQuiz} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Quiz starten ({pool.length} Fragen)</button>
            </div>
          </div>
        )}

        {/* Ergebnisansicht */}
        {!started && (score > 0 || wrong.length > 0) && (
          <div className="bg-white rounded-2xl shadow p-6 mb-4">
            <h2 className="text-xl font-semibold mb-2">Ergebnis</h2>
            <p className="mb-2">Punkte: <b>{score}</b> / {score + wrong.length}</p>
            <div className="h-2 w-full bg-gray-200 rounded">
              <div className="h-2 bg-green-500 rounded" style={{width: `${Math.round((score/(score+wrong.length))*100)}%`}} />
            </div>
            {wrong.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer font-medium">Falsche Fragen ansehen</summary>
                <ul className="mt-2 list-disc ml-6 space-y-1">
                  {wrong.map((id) => {
                    const q = BANK.find((x) => x.id === id)!;
                    return (
                      <li key={id}>
                        <span className="font-semibold">{q.q}</span>
                        <div className="text-sm opacity-80">Richtig: {q.options[q.correct]}</div>
                        <div className="text-sm opacity-80">Hinweis: {q.expl}</div>
                      </li>
                    );
                  })}
                </ul>
              </details>
            )}
          </div>
        )}

        {/* Quizlauf */}
        {started && current && (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1"><span>Frage {step + 1} / {total}</span><span>Punkte: {score}</span></div>
              <div className="h-2 w-full bg-gray-200 rounded">
                <div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">{current.q}</h2>
            <div className="grid gap-3">
              {current.options.map((opt: string, i: number) => {
                const isPicked = picked === i;
                const isCorrect = i === current.correct;
                const base = "w-full text-left px-4 py-3 rounded-xl border";
                const idle = "hover:border-blue-400";
                const right = "border-green-600 bg-green-50";
                const wrongCls = "border-red-600 bg-red-50";
                const chosen = isPicked ? (isCorrect ? right : wrongCls) : (picked !== null && isCorrect ? right : idle);
                return (
                  <button
                    key={i}
                    disabled={picked !== null}
                    onClick={() => pickOption(i)}
                    className={`${base} ${chosen}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showExpl && (
              <div className="mt-4 p-3 rounded-xl bg-gray-50 border text-sm">
                <b>Erklärung:</b> {current.expl}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button onClick={() => { setStarted(false); }} className="px-3 py-2 rounded-xl border">Abbrechen</button>
              <button onClick={next} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">{step + 1 < total ? "Weiter" : "Beenden"}</button>
            </div>
          </div>
        )}

        {/* Überblick */}
        <section className="mt-6 bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-3">Kurzüberblick</h3>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            <li>Strukturfaktoren: Imperialismus, Bündnisse, Militarismus, Nationalismus.</li>
            <li>Juli 1914: Kette bewusster Entscheidungen, getrieben von Ultimaten und Mobilmachung.</li>
            <li>Merksatz: <i>Strukturen luden die Pistole. Menschen drückten ab.</i></li>
          </ul>
        </section>

        <footer className="py-6 text-center text-xs opacity-60">© Lern-App WWI · Kategorien: {CATS.join(", ")}</footer>
      </div>
    </div>
  );
}
