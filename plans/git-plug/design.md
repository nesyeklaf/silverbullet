## Owner decisions
Siehe proposal.md. Q1 bis Q5 sind offen.

## Agent decisions
- **A (empfohlen): Der Plug fährt Git selbst über `shell.run`, der Space läuft mit Revisions „unmanaged“.**
  - Kontext: Plugs laufen als Web Worker im Browser. `shell.run` geht an `POST /.shell` und läuft im Space-Ordner (server/src/handlers/shell.rs:115). Der Modus „unmanaged“ liest die Historie, committet aber nie (Test `unmanaged_store_never_commits`, engine.rs:1483).
  - Abgelehnt: **B, der Plug als Oberfläche über neue Rust-Endpunkte des Kern-Git** (Status, Diff, Commit mit Nachricht, Blame, Intervalle).
  - Warum A: Der Plug läuft auf jedem SilverBullet mit Shell, auch auf Upstream, und ist damit wirklich ein eigenes Plugin. Am 9.800 Zeilen großen Revisions-Kern ändert sich nichts. Es gibt einen Schreiber pro Repo statt zwei. B wäre robuster, weil es auch ohne offenen Tab läuft, funktioniert aber nur auf diesem Fork.
- **Shell-Whitelist `["git"]`.** Eine leere Whitelist bei `enabled: true` erlaubt jeden Befehl (Test `runs_an_allowed_command`). Der Plug prüft das beim Start und warnt.
- **Gemeinsamer Zustand in `git config sb-git.*`** (`lastCommitSync`, `lastPull`, `paused`). Das gilt dann für alle Tabs und Geräte und überlebt das Schließen des Tabs. Nur so läuft das Intervall über Sitzungen hinweg wie bei obsidian-git. Abgelehnt: der clientStore, weil er pro Browser gilt und zwei Tabs sich dann nicht sehen.
- **Ein Lauf auf einmal:** Vor jedem Lauf setzt der Plug `sb-git.runningSince`. Ein anderer Tab überspringt den Lauf, wenn das jünger als 2 min ist. Meldet Git `index.lock`, gilt das als „später nochmal“, nicht als Fehler.
- **Timer über das Event `cron:secondPassed`** (client/client.ts:493), wie in zefhemels Git.md.
- **Pull mit `--no-rebase`, nie mit `--force`.** Bei einem Konflikt bleiben die Marker in der Datei. Die Automatik pausiert, bis `Git: Mark resolved` committet.
- **Zugangsdaten:** Es gilt das Git des Server-Users (gh als HTTPS-Helper oder ein SSH-Key). Jeder Aufruf läuft mit `-c credential.interactive=never`. Im Space liegt nie ein Token.
- **TypeScript-Plug statt Space Lua.** Die Source-Control-Ansicht braucht ein Panel, und vitest mit `system_mock` gibt echte Tests. Lua wäre im Space editierbar, aber schwer zu testen.
- **Vorbild:** silverbulletmd/silverbullet-git, inzwischen veraltet, und silverbullet-libraries/Git.md mit nur `autoSync`. Wir übernehmen die Idee, aber keinen Code.

## Risks
- **Läuft nur, solange ein Client offen ist,** genau wie obsidian-git. Ohne Tab gibt es aber auch keine Änderungen durch SilverBullet. Was du zuletzt im Tab änderst, wird erst beim nächsten Öffnen committet (Pull und Commit beim Start). Externe Editoren oder Agents ohne offenen Tab werden nicht gesichert. Mögliche Abhilfe ist der Runtime API Headless-Chrome; der ist experimentell und ungetestet.
- **Shell mit Git ist praktisch Codeausführung** (`git -c core.sshCommand=…`). Jeder Plug und jedes Lua-Skript im Space bekommt sie. Auf einer lokalen Instanz für einen Nutzer ist das vertretbar, auf einer geteilten nicht. Das kommt in die Doku.
- **Lokale Sync-Kopie:** Der Plug committet, was auf der Server-Platte liegt. Änderungen, die noch im Browser hängen, landen im nächsten Lauf.
- **Konflikte:** Die schöne Konflikt-UI des Kerns hängt an seiner eigenen Sync-Engine und ist hier nicht nutzbar. Phase 3 baut nur eine einfache Liste.
- **Veröffentlichen** des Plug-Repos und Anlegen des Notiz-Repos sind externe Schritte. Beides nur nach dem OK des Owners.
