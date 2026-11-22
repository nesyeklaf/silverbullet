import type { EditorState } from "@codemirror/state";
// Forked from https://codeberg.org/retronav/ixora
// Original author: Pranav Karawale
// License: Apache License 2.0.

import { syntaxTree } from "@codemirror/language";
import { Decoration, WidgetType } from "@codemirror/view";
import { decoratorStateField, isCursorInRange } from "../util.ts";

const bulletListMarkerRE = /^[-+*]/;

export type ListBulletOptions = {
  /**
   * Draw no bullet before a task (`* [ ] …`): the checkbox takes the
   * bullet's place. The marker comes back while the cursor is on it.
   */
  hideTaskBullets?: boolean;
};

export function listBulletPlugin(options: ListBulletOptions = {}) {
  return decoratorStateField((state: EditorState, _tr, range) => {
    const widgets: any[] = [];
    syntaxTree(state).iterate({
      from: range?.from,
      to: range?.to,
      enter: ({ type, from, to, node }) => {
        if (type.name === "ListMark") {
          if (isCursorInRange(state, [from, to])) {
            widgets.push(
              Decoration.mark({
                class: "sb-li-cursor",
              }).range(from, to),
            );
          } else {
            const listMark = state.sliceDoc(from, to);
            if (
              options.hideTaskBullets &&
              isHiddenTaskBullet(listMark, node.parent?.getChild("Task"))
            ) {
              // The marker and its space go; list_indent.ts gives their
              // slot no columns, so the checkbox sits where the bullet was.
              const end = state.sliceDoc(to, to + 1) === " " ? to + 1 : to;
              widgets.push(Decoration.replace({}).range(from, end));
            } else if (bulletListMarkerRE.test(listMark)) {
              const dec = Decoration.replace({
                widget: new ListBulletWidget(),
              });
              widgets.push(dec.range(from, to));
            } else {
              widgets.push(
                Decoration.mark({
                  class: "sb-li-cursor",
                }).range(from, to),
              );
            }
          }
        }
      },
    });
    return Decoration.set(widgets, true);
  }, {});
}

/**
 * Whether a list marker is a bullet (`*`, `-`, `+`, not a number) in front
 * of a task, the one `hideTaskBullets` leaves out.
 */
export function isHiddenTaskBullet(
  listMark: string,
  task: unknown | null | undefined,
): boolean {
  return !!task && bulletListMarkerRE.test(listMark);
}

/**
 * Widget that renders the bullet glyph (`•`) inline at the source position of
 * the markdown list marker (`*`, `-`, `+`). Uses no positioning tricks — the
 * widget sits exactly where the source char would, so nested-list bullets
 * step right naturally with their leading whitespace.
 */
class ListBulletWidget extends WidgetType {
  toDOM(): HTMLElement {
    const listBullet = document.createElement("span");
    listBullet.textContent = "•"; // U+2022 BULLET
    listBullet.className = "cm-list-bullet";
    return listBullet;
  }
}
