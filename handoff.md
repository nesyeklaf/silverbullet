# Continuation Handoff

## Objective

- **Receiving agent's goal:** Den SilverBullet-Fork weiterentwickeln, mit den offenen Punkten aus der Interface-Grammatik-Kritik (Liste unter Pending).
- **Current stopping point:** Typeset-Arbeit und die Einstellung `hideTaskBullets` sind fertig, auf `main` gepusht und lokal als Prod-Instanz installiert. Es läuft keine Arbeit mehr.
- **Done when:** Der Owner wählt einen der Pending-Punkte, er ist gebaut und in Dark Mode belegt (Screenshot), die Tests sind grün, und der Stand ist auf `main` gepusht und auf Prod installiert.

## Authoritative context

- **Repository / workspace:** `~/Projects/silverbullet`, origin `git@github.com:nesyeklaf/silverbullet.git` (Fork), upstream `silverbulletmd/silverbullet`
- **Instructions:** `~/.pi/agent/AGENTS.md`, `CLAUDE.md`/`AGENTS.md` im Repo, falls vorhanden
- **Primary artifacts:**
  - Commits `1a6a5cee`, `4f2047ef`, `dfa91d1f` (siehe `git show --stat`)
  - der geparkte Plan `plans/git-plug/`
- **Branch / revision:** `main` = `origin/main` (nach diesem Commit). Basis upstream `6110fdf8`. Lokal liegt noch der Branch `typeset-document-voice`, er ist schon in `main` enthalten.

## Decisions and constraints

- **User decisions:**
  - Interface-Grammatik, beschlossen, aber nur teilweise gebaut:
    - R1: Alles im Seitentext spricht in der Dokument-Stimme (gebaut).
    - R2: Der Seitenname gehört zum Dokument.
    - R3: Eine Ebene für jede transiente Auswahl.
    - R4: Stapelregel als Token, Seite < Docks < Auswahl < Menüs < Dialoge < Toasts.
    - N1: Tag ist ein volles Nomen (umbenennen, zusammenführen, löschen).
    - V1: Command-Namen strikt „Nomen: Verb“; `Navigate:` wird aufgeteilt in `Page:`, `Cursor:` und `View:`.
  - UI-Schrift ist IBM Plex Sans statt Inter. Inter bleibt wählbar.
  - Ergebnisse immer in Dark Mode zeigen.
  - Einen Settings-Suchfilter will der Owner nicht.
  - Backup: kein systemd, kein tar, kein restic. Der Plan für einen obsidian-git-artigen Plug ist verworfen („ne egal“).
- **Must preserve:**
  - Die Root-Schriftgröße bleibt literal `16px` (app.scss:8, components_bundle.scss:11), weil Panel-Iframes sie spiegeln.
  - Chrome nutzt nur die Tokens `--ui-text-*`, nie rohe Größen.
  - Seiteninhalt nutzt `--editor-font-size` und die Seiten-Rollen `--page-meta-size` und `--page-label-size`.
  - `hideTaskBullets` ist standardmäßig false.
- **No-gos:**
  - Nichts nach upstream pushen.
  - Kein `silverbullet upgrade` auf Prod, das überschreibt den Fork.
  - Kein Force-Push.
  - Kein Admin-Account durch den Agenten.
  - `blaze build` und `blaze test` funktionieren in diesem Workspace nicht.
- **Assumptions / unverified claims:**
  - Andere Themes als der Standard sind in Dark Mode nicht geprüft.
  - Eine eigene Editor-Schrift und die Desktop-App sind ungetestet.
  - Wie man die Space Tree öffnet (Ctrl-O), stammt aus der Doku und ist nicht ausprobiert.

## Current repository state

- **Working tree:** sauber bis auf `.sbshot.mjs`.
- **Task-related changed files:** keine uncommitteten.
- **Pre-existing or unrelated changes:** `.sbshot.mjs` ist untracked und bleibt es: ein Playwright-Screenshot-Helfer mit festen lokalen Pfaden.
- **Background processes or external state:**
  - systemd-User-Unit `silverbullet` (gewollt), Prozess `~/.local/bin/silverbullet` auf `127.0.0.1:3000`. `/` antwortet mit 307 auf `/.dashboard`.
  - Daten in `~/.local/share/silverbullet`, darin der Space `spaces/notes` mit Revisions `managed`, Git-Branch `master`, kein Remote.
  - `SB_UPDATE_CHECK=0` ist gesetzt.
  - Das Prod-Binary trägt die Version `2.12.0-394-g2d3e4b2e`. Gebaut wurde es vor dem Amend zu `dfa91d1f`, der Code ist gleich, nur ein Test-Fix kam im Amend dazu.
  - `hideTaskBullets` ist auf Prod aus, der Owner schaltet es selbst ein.
  - Die Testinstanz 3077 ist gestoppt.

## Work status

### Completed

- Dokument-Stimme für Inhalte im Seitentext. Evidence: Commit `1a6a5cee`.
- Chrome-Typo-Skala, Seiten-Rollen für verirrte Größen, IBM Plex Sans. Evidence: Commit `4f2047ef`.
- Die Einstellung `hideTaskBullets`, mit der die Checkbox an die Stelle des Punkts rückt. Evidence:
  - Commit `dfa91d1f`
  - In Dark Mode auf 3077 gemessen: linke Kante der Checkbox bei 341 px, gleich wie die Punkte; 0 von 6 Dashboard-Tasks zeigen einen Punkt.
- Lokale Prod-Instanz. Evidence:
  - `~/.cache/sb-release-build.log` endet mit `DEPLOY_OK`
  - `systemctl --user is-active silverbullet` → active

### In progress

- None

### Pending

1. R4: z-index-Tokens nach der Stapelregel. Im Moment gibt es vier Stapel-Mechanismen und keine Doku dazu, die Darstellung beginnt in `client/editor_ui.tsx`.
2. R2 und R3: Seitenname als Teil des Dokuments; eine gemeinsame Ebene für Picker, filterBox und Prompt.
3. N1: Befehle zum Umbenennen, Zusammenführen und Löschen von Tags.
4. V1: Command-Namen auf „Nomen: Verb“ umstellen. Das ändert öffentliche Namen, also vorher eine Alias- und Migrationsstrategie mit dem Owner klären.
5. Frage an den Owner: Das Inter-`@font-face` entfernen? Der Detector meldet `_fonts.scss:35,42`. Empfehlung: behalten, sonst fallen Nutzer still auf eine andere Schrift zurück, die Inter als Editor-Schrift gewählt haben.
6. Optional: `/impeccable init` für eine PRODUCT.md.

### Out of scope

- Git-Plug und Backup-Lösungen: verworfen, der Plan ist nur archiviert in `plans/git-plug/`.
- Ein Settings-Suchfeld.

## Verification

- **Passed:**
  - `npx vitest run client/codemirror`: 52 Dateien, 415/415 Tests, am 2026-11-22 nach dem Push.
  - `npx tsc --noEmit -p .`: keine Ausgabe.
- **Failed:** `fonts_dom.test.ts`, `themes.test.ts` und `space_theme.test.ts` mit 35 Fehlern (`localStorage.clear` undefined). Sie schlagen auch ohne diese Änderungen fehl und kommen aus der Testumgebung.
- **Not run / unavailable:** der ganze Rust-Workspace mit `cargo nextest`, weil kein Rust geändert wurde; die E2E-Suite; die Desktop-App.

## Suggested skills

- `impeccable`: Sie passt zu R2, R3 und R4, denn das sind Layout- und Ebenenarbeit. Prompt: `$impeccable layout: z-index-Stapelregel aus R4 als Tokens umsetzen, Dark Mode belegen`
- `interface-grammar`: Sie passt zu N1 und V1, denn dort geht es um Nomen und Verben. Prompt: `Tag als volles Nomen (N1) und Command-Namen Nomen: Verb (V1) entwerfen, vor dem Bau mit dem Owner abstimmen`

## First safe next action

- **Action:** Den Owner fragen, welcher Pending-Punkt als nächstes kommt. Empfehlung: R4, weil der Punkt klein, lokal und leicht rückgängig zu machen ist. Dann die z-index-Werte inventarisieren mit `grep -rn "z-index" client/styles client/**/*.scss`.
- **Expected evidence:** eine Liste aller z-index-Werte mit Datei:Zeile, jeder einer Ebene der Stapelregel zugeordnet.
- **Required approval or prerequisite:**
  - Der Owner wählt den Punkt.
  - Vor einem Deploy auf Prod: Release-Build, dann `install -m755 target/release/silverbullet ~/.local/bin/silverbullet` und `systemctl --user restart silverbullet`.
  - Für den Cargo-Build `CARGO_NET_GIT_FETCH_WITH_CLI=true` setzen, sonst scheitert der Fetch von `candle-core`.

## Sensitive context

- **Redactions:** None
- **Authorized source needed:** Der Admin-Account der Prod-Instanz gehört dem Owner. Sein Passwort läuft nie über einen Agenten.
