---
status: draft
updated: 2026-11-22
---
# Git-Plug: obsidian-git für SilverBullet

## Why
Der Owner will seine Notizen automatisch in ein privates Git-Repo sichern. Das soll eine Funktion von SilverBullet sein, kein systemd-Job, und sich anfühlen wie [obsidian-git](https://github.com/Vinzent03/obsidian-git): Intervall, Commit-Nachricht nach Vorlage, Pull beim Start, Source-Control-Ansicht. Und es soll ein eigenes Plugin sein, das man installiert und wieder entfernt, nicht fest im Kern.

## Owner decisions
- Backup-Ziel: Git Sync in ein privates Repo (2026-11-22).
- Umfang: nur SilverBullet, nicht ganz /home (2026-11-22).
- Kein systemd, keine Lösung außerhalb von SilverBullet (2026-11-22).
- Verhalten wie obsidian-git, als eigenes Plugin installierbar (2026-11-22).
- Offen: Q1 bis Q5 in tasks.md.

## What changes
- Neues Repo `nesyeklaf/silverbullet-git` mit einem TypeScript-Plug `git.plug.js` und einer Library-Seite `Library/nesyeklaf/Git`. Installation per `Library: Install <uri>`.
- Der Plug fährt Git über `shell.run("git", …)` im Space-Ordner auf dem Server.
- Phase 1, das Backup:
  - Befehle `Git: Commit-and-sync`, `Git: Commit`, `Git: Pull`, `Git: Push`, `Git: Pause automatic routines` und `Git: Status`.
  - Automatik: Commit-and-sync alle n Minuten, Pull alle n Minuten, Pull beim Start. Das Intervall gilt über Sitzungen hinweg.
  - Commit-Nachricht nach Vorlage (`{{date}}`, `{{numFiles}}`), optional mit der Liste der geänderten Dateien.
  - Alle Einstellungen in der Konfigurations-UI, Kategorie „Git“.
- Phase 2: Eine Source-Control-Ansicht als Seitenleiste: geänderte Dateien, Stage und Unstage, Verwerfen, Diff, Commit-Feld. Die Historie liefert der Kern weiter über `Revision: Page History` und `Revision: Space History`.
- Phase 3: Liste der Konflikte, `Git: Mark resolved`, `Git: Open file on GitHub`.
- Im Kern: nichts. Der Space wird auf Revisions „unmanaged“ gestellt. Dann liest der Kern die Historie und committet selbst nicht mehr.

## Out of scope
- Line Authoring (git blame pro Zeile): Plugs können keine CodeMirror-Leiste anlegen. Das bräuchte einen Kern-Hook und kommt später, wenn gewünscht.
- Clone, Submodule, Branch-Wechsel, Rebase, Force-Push.
- Mobile und isomorphic-git: Git läuft immer auf dem Server.
- Backup von `users.json` und `spaces.json`.
- Ein Ersatz für das eingebaute Git Sync des Kerns: Es bleibt, wird für diesen Space aber abgeschaltet.
