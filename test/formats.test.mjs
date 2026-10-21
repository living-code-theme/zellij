// Native format regressions, exercised through this port's generator.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {resolveAll,ANSI_ORDER} from '../scripts/palette.mjs';
import {generate} from '../src/generate.mjs';

const flavors = resolveAll();

const zellijTheme=f=>generate([f])[0].content;

test("zellij themes are balanced KDL with every component and RGB triples", () => {
  const components = ["text_unselected", "text_selected", "ribbon_selected", "ribbon_unselected", "table_title", "table_cell_selected", "table_cell_unselected", "list_selected", "list_unselected", "frame_selected", "frame_unselected", "frame_highlight", "exit_code_success", "exit_code_error"];
  for (const f of flavors) {
    const kdl = zellijTheme(f);
    assert.equal([...kdl].filter((c) => c === "{").length, [...kdl].filter((c) => c === "}").length);
    assert.match(kdl, new RegExp(`^themes \\{\\n    ${f.slug} \\{\\n`, "m"));
    for (const c of components) {
      const body = kdl.match(new RegExp(`        ${c} \\{\\n([\\s\\S]*?)\\n        \\}`))?.[1];
      assert.ok(body, c);
      const attrs = Object.fromEntries(body.trim().split("\n").map((l) => l.trim().split(/ (.*)/s).slice(0, 2)));
      assert.deepEqual(Object.keys(attrs), ["base", "background", "emphasis_0", "emphasis_1", "emphasis_2", "emphasis_3"], c);
      for (const v of Object.values(attrs)) assert.match(v, /^\d{1,3} \d{1,3} \d{1,3}$/);
    }
    assert.equal([...kdl.matchAll(/player_(\d+) \d+ \d+ \d+/g)].length, 10);
    assert.ok(kdl.includes(`base ${[1, 3, 5].map((i) => parseInt(f.r("fg").slice(i, i + 2), 16)).join(" ")}`));
  }
});
