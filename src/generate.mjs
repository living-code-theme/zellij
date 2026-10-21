// This port owns its application mappings. Inputs come only from the pinned local palette.


const rgbOf = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

const rgbSpace = (hex) => rgbOf(hex).join(" ");

function zellijTheme(f) {
  const c = (hex) => rgbSpace(hex);
  const comp = (name, base, bg, e) => `        ${name} {
            base ${c(base)}
            background ${c(bg)}
            emphasis_0 ${c(e[0])}
            emphasis_1 ${c(e[1])}
            emphasis_2 ${c(e[2])}
            emphasis_3 ${c(e[3])}
        }`;
  const hi = [f.r("warning"), f.r("accent"), f.r("success"), f.c("orchid")];
  const players = [f.r("accent"), f.c("orchid"), f.r("warning"), f.r("info"), f.r("error"), f.r("success"), f.c("copper"), f.c("rose"), f.c("aqua"), f.r("fgMuted")];
  return `// ${f.name}: https://github.com/living-code-theme/zellij
themes {
    ${f.slug} {
${[
  comp("text_unselected", f.r("fg"), f.r("bg"), hi),
  comp("text_selected", f.r("fg"), f.r("selection"), hi),
  comp("ribbon_selected", f.r("bg"), f.r("accent"), [f.r("error"), f.r("warning"), f.c("orchid"), f.r("info")]),
  comp("ribbon_unselected", f.r("fg"), f.c("surface1"), [f.r("error"), f.r("fg"), f.r("info"), f.c("orchid")]),
  comp("table_title", f.r("accent"), f.r("bg"), hi),
  comp("table_cell_selected", f.r("fg"), f.r("selection"), hi),
  comp("table_cell_unselected", f.r("fg"), f.r("bg"), hi),
  comp("list_selected", f.r("fg"), f.r("selection"), hi),
  comp("list_unselected", f.r("fg"), f.r("bg"), hi),
  comp("frame_selected", f.r("borderActive"), f.r("bg"), [f.c("orchid"), f.r("info"), f.r("warning"), f.r("success")]),
  comp("frame_unselected", f.r("border"), f.r("bg"), [f.c("orchid"), f.r("info"), f.r("warning"), f.r("success")]),
  comp("frame_highlight", f.r("warning"), f.r("bg"), [f.c("orchid"), f.r("warning"), f.r("warning"), f.r("warning")]),
  comp("exit_code_success", f.r("success"), f.r("bg"), [f.r("accent"), f.c("orchid"), f.r("info"), f.r("fgMuted")]),
  comp("exit_code_error", f.r("error"), f.r("bg"), [f.r("warning"), f.r("warning"), f.r("warning"), f.r("warning")]),
].join("\n")}
        multiplayer_user_colors {
${players.map((p, i) => `            player_${i + 1} ${c(p)}`).join("\n")}
        }
    }
}
`;
}

const zellij = {
files: (f) => [{ path: `${f.slug}.kdl`, content: zellijTheme(f) }]
};

export function generate(flavors) {
  return [...flavors.flatMap(f => zellij.files(f)), ...(zellij.all?.(flavors) ?? [])].filter(f => !["LICENSE", "README.md", "package.json", "extension.toml"].includes(f.path.split("/").at(-1)));
}
