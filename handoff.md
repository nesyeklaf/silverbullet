# Handoff: Fork nesyeklaf/silverbullet

Stand 2026-11-22. Basis: upstream `6110fdf8` (Merge #2256). Branch `typeset-document-voice`, per Fast-Forward nach `main` übernommen.

## Was drin ist

| Commit | Inhalt |
|---|---|
| `1a6a5cee` | Typeset: Inhalte im Seitentext (Frontmatter, Attribute, Queries, Page-Widgets) nutzen die Dokument-Schrift (Lora) statt der UI-Schrift. Seiten-Rollen `--page-meta-size` 0.85em, `--page-label-size` 0.78em. Titel `editor-font-size × 1.7`, Überschriften 1.4/1.2/1.1. |
| `4f2047ef` | Eine Typo-Skala für das Chrome: `--ui-text-xs/sm/base/md/lg/xl/2xl` in `client/styles/theme.scss`. Verirrte Größen (Hashtag-Chip, ×, Mention-Quelle, Linked Mentions) liegen jetzt auf den Seiten-Rollen. Neue UI-Schrift ist IBM Plex Sans (`UI_FONT = "ibm-plex-sans"`). Inter ist weiter als Schrift wählbar. |
| `dfa91d1f` | Neue Einstellung `hideTaskBullets` (Standard false), zu finden unter Configuration → Editor → „Hide bullets before tasks“. Sie blendet den Punkt vor `- [ ]` aus, und die Checkbox rückt an seine Stelle. Wirkt im Editor (`client/codemirror/syntax/list.ts`, `editing/list_indent.ts`, `editing/clean.ts`) und in gerenderten Listen (`data-task-bullets` auf `<html>`, `_markdown_body.scss`). |

Tests: `client/codemirror` und Renderer, 586/586 grün. 35 Fehler in `fonts_dom`, `themes` und `space_theme` (`localStorage.clear` undefined) gab es schon vorher. Sie kommen aus der Testumgebung, nicht aus diesen Änderungen.

## Lokale Produktiv-Instanz

- Binary: `~/.local/bin/silverbullet`, eine Kopie, damit `cargo clean` sie nicht kaputt macht.
- Daten: `~/.local/share/silverbullet`, darin der Space „Notes“ unter `spaces/notes` mit Revisions `managed` (Git lokal, Branch `master`, kein Remote).
- Dienst: systemd-User-Unit `silverbullet` auf `127.0.0.1:3000`. Gesetzt ist `SB_UPDATE_CHECK=0`, weil die Update-Hinweise auf Upstream zeigen und `silverbullet upgrade` den Fork überschreiben würde.
- Update:
  ```
  npm ci && npm run build
  CARGO_NET_GIT_FETCH_WITH_CLI=true ~/.cargo/bin/cargo build --release -p silverbullet
  install -m755 target/release/silverbullet ~/.local/bin/silverbullet
  systemctl --user restart silverbullet
  ```
  `CARGO_NET_GIT_FETCH_WITH_CLI` ist nötig, sonst scheitert der Fetch von `candle-core` per SSH.
- `hideTaskBullets` steckt im Binary, ist auf Prod aber aus. Einschalten musst du es selbst.

## Offen

- Interface-Grammatik, beschlossen, aber nicht gebaut:
  - R4: feste Stapelregel als z-index-Tokens (Seite < Docks < Auswahl < Menüs < Dialoge < Toasts)
  - R2: der Seitenname gehört zum Dokument
  - R3: eine Ebene für jede transiente Auswahl
  - N1: Tag als volles Nomen (umbenennen, zusammenführen, löschen)
  - V1: Command-Namen strikt „Nomen: Verb“
- Frage an den Owner: Inter-`@font-face` ganz entfernen? Der Detector meldet `_fonts.scss:35,42`.
- Backup: Ein Plan für einen Git-Plug im Stil von obsidian-git liegt in `plans/git-plug/`. Er ist geparkt, der Owner hat ihn nicht weiterverfolgt. Auf Prod gibt es noch kein Backup-Remote.
- `/impeccable init` (PRODUCT.md) ist nur ein Vorschlag.
- Ungetestet: andere Themes außer dem Standard in Dark, eigene Editor-Schrift, die Desktop-App.
