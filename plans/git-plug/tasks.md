## Your steps
- [ ] Q1 bis Q5 beantworten.
- [ ] OK, dass ich `nesyeklaf/silverbullet-notes` (privat) anlege und für Prod `spaces.json` ändere: Revisions `unmanaged`, Shell `enabled` mit Whitelist `["git"]`. Die Instanz ist dafür kurz gestoppt.
- [ ] Auf Prod: `Library: Install <uri>` ausführen und unter Configuration → Git das Intervall setzen.

## Proof
Getestet auf der Testinstanz 3077 mit einem lokalen Bare-Repo als Remote, danach einmal auf Prod gegen GitHub:
- AC1: Nach `Library: Install` erscheinen `Git: Commit-and-sync`, `Git: Commit`, `Git: Pull`, `Git: Push`, `Git: Pause automatic routines` und `Git: Status` in der Palette.
- AC2: Intervall auf 1 min, eine Seite ändern. Nach höchstens 90 s zeigt `git log origin/master -1` den Commit mit der Vorlagen-Nachricht.
- AC3: Den Tab nach 10 s schließen und nach Ablauf des Intervalls wieder öffnen. Commit-and-sync läuft dann innerhalb von 5 s nach dem Start.
- AC4: Zwei Tabs 5 min offen, je eine Änderung pro Minute: höchstens ein Commit pro Intervall und keine Fehlermeldung.
- AC5: Ein Commit aus einem Klon in /tmp erscheint nach dem Pull-Intervall in der offenen Seite.
- AC6: Dieselbe Zeile auf beiden Seiten geändert: Die Automatik pausiert, und `Git: Status` nennt die Datei. Nach dem Auflösen committet und pusht `Git: Mark resolved`. `grep -rn -- "--force" src` findet nichts.
- AC7: Bei Revisions „managed“ startet keine Automatik, und es erscheint ein Hinweis, warum.
- AC8: Mit Shell aus oder ohne `git` in der Whitelist erscheint ein klarer Hinweis, und der Plug stürzt nicht ab. Bei leerer Whitelist warnt er.
- AC9: `Revision: Page History` zeigt die Commits des Plugs.
- AC10 (Phase 2): Von zwei geänderten Dateien eine stagen und committen: Der Commit enthält nur diese Datei.
- AC11: Im Space-Ordner liegt kein Token (`git grep -i token` ist leer). Ein Push ohne Zugang zeigt einen Hinweis mit der Abhilfe.
- AC12: `npm test` im Plug-Repo ist grün, und `npm run build` erzeugt `git.plug.js`.

## Questions
- Q1: Architektur A (Plug + shell.run + unmanaged) statt B (neue Kern-Endpunkte)? Empfehlung A | for: owner | since: 2026-11-22
- Q2: Zuerst Phase 1 und 2, Phase 3 danach? Empfehlung ja | for: owner | since: 2026-11-22
- Q3: Plug-Repo `nesyeklaf/silverbullet-git` öffentlich? Für `Library: Install` per URI muss es öffentlich lesbar sein. Empfehlung öffentlich, es enthält keine persönlichen Daten | for: owner | since: 2026-11-22
- Q4: Remote für die Notizen `nesyeklaf/silverbullet-notes`, privat, per HTTPS mit gh-Login? Empfehlung ja | for: owner | since: 2026-11-22
- Q5: TypeScript-Plug statt Space-Lua-Library? Empfehlung TypeScript | for: owner | since: 2026-11-22

## Build
### G0: Repo-Gerüst
- repo: ~/Projects/silverbullet-git (neu, aus silverbullet-plug-template)
- status: todo
- doer: self
- check: `npm run build && ls git.plug.js`
- [ ] Template übernehmen, Manifest `git.plug.yaml`, Library-Seite `Library/nesyeklaf/Git.md` mit `files: [git.plug.js]`

### G1: Git-Läufer, Konfiguration, Befehle, Automatik (Phase 1)
- repo: ~/Projects/silverbullet-git
- status: todo
- doer: -   # implementer-high (pi, claude-sonnet-5-5, high)
- check: `npm test` (vitest mit system_mock: Zustand in git config, Sperre bei zwei Tabs, Vorlage, Behandlung von index.lock)
- after: G0
- [ ] `git.ts`: Wrapper um `shell.run` mit `-c credential.interactive=never`, Fehlerarten (auth, lock, conflict, no-remote)
- [ ] Prüfungen beim Start: Shell, Whitelist, Revisionsmodus
- [ ] `config.define("git", …)` mit Intervallen, Pull beim Start, Push an/aus, Vorlage, Dateiliste
- [ ] Die sechs Befehle; Timer über `cron:secondPassed` mit Zustand in `git config sb-git.*`

### G2: Source-Control-Ansicht (Phase 2)
- repo: ~/Projects/silverbullet-git
- status: todo
- doer: -   # implementer-medium (sonnet, high)
- check: `npm test`, plus AC10 auf 3077
- after: G1
- [ ] Panel rechts: geänderte Dateien, Stage/Unstage/Verwerfen, Diff, Commit-Feld

### G3: E2E auf der Testinstanz
- repo: ~/.cache/sb-critique (3077), Remote `~/.cache/sb-git-remote.git`
- status: todo
- doer: self
- check: AC1 bis AC10 mit Ausgabe
- after: G2

### G4: Review
- status: todo
- doer: -   # pi, openai-codex/gpt-6.2-sol, medium; eine Runde
- check: Befunde sortiert (umsetzen, erwägen, verworfen mit Grund)
- after: G3

### G5: Prod
- status: todo
- doer: self, nach dem OK des Owners
- check: AC2 und AC11 gegen GitHub
- after: G4
- [ ] Notiz-Repo anlegen, `spaces.json` anpassen, Plug installieren

### G6: Phase 3, Konflikte und GitHub-Link
- status: todo
- after: G5
- check: AC6
