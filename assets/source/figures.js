// Station parts for the README figures, built on Iso. Back parts are drawn before the belt, front parts after it.
window.Parts = function (I, BZ = 1.2) {
  const line = (a, b, stroke, w) => I.raw(`<polyline points="${[a, b].map(p => p.join(",")).join(" ")}" stroke="${stroke}" stroke-width="${w}" fill="none"/>`);
  const p = {
    slab(x, y, w, d) {
      I.box(x, y, -0.5, w, d, 0.5, "slab");
      for (let gx = x; gx <= x + w + 1e-6; gx += 1.6) line(I.P(gx, y, 0), I.P(gx, y + d, 0), "var(--grid)", 1.2);
      for (let gy = y; gy <= y + d + 1e-6; gy += 1.6) line(I.P(x, gy, 0), I.P(x + w, gy, 0), "var(--grid)", 1.2);
      I.flat(x, y + d - 0.7, 0.001, w, 0.25, "var(--stripe)");
    },
    beltBack(x0, L) {
      I.flat(x0 + 0.2, 0.4, 0.002, L, 2.2, "var(--shadow)");
      for (let x = x0 + 0.4; x < x0 + L; x += 2.6) I.box(x, 0.1, 0, 0.3, 0.3, BZ - 0.35, "steel");
    },
    belt(x0, L) {
      I.box(x0, 0, BZ - 0.35, L, 2, 0.35, "steel");
      I.flat(x0, 0.12, BZ, L, 1.76, "var(--belt)");
      for (let x = x0 + 0.5; x < x0 + L; x += 0.8) line(I.P(x, 0.12, BZ), I.P(x, 1.88, BZ), "var(--belt-line)", 1.5);
      for (let x = x0 + 0.3; x < x0 + L; x += 0.55) { const [a, b] = I.P(x, 2, BZ - 0.18); I.raw(`<circle cx="${a}" cy="${b}" r="2.6" fill="var(--steel-t)"/>`); }
      for (let x = x0 + 0.4; x < x0 + L; x += 2.6) I.box(x, 1.6, 0, 0.3, 0.3, BZ - 0.35, "steel");
    },
    hopper(x, cards = true) {
      I.box(x + 0.2, 0.2, BZ, 0.25, 0.25, 1.1, "steel"); I.box(x + 1.75, 0.2, BZ, 0.25, 0.25, 1.1, "steel");
      I.hopper(x, -0.1, BZ + 1.1, 2.2, 2.2, 1.6, 0.6, "yellow");
      if (cards) [[x + 0.5, 0.6, 4.6], [x + 1.1, 0.3, 5.3], [x + 0.7, 1.0, 6.0]].forEach(([cx, cy, cz]) => {
        I.box(cx, cy, cz, 0.9, 0.65, 0.06, "card");
        I.flat(cx + 0.15, cy + 0.15, cz + 0.061, 0.55, 0.06, "var(--card-line)");
        I.flat(cx + 0.15, cy + 0.33, cz + 0.061, 0.4, 0.06, "var(--card-line)");
      });
    },
    pressBack(x) { I.box(x, -0.9, 0, 0.6, 0.6, 4.6, "press"); },
    pressFront(x, plate) {
      I.box(x, -0.9, 4.6, 0.6, 3.6, 0.7, "press");
      I.box(x + 0.15, 0.6, 3.2, 0.3, 0.3, 1.4, "steel");
      I.box(x - 0.15, 0.35, 2.4, 0.9, 0.9, 0.8, "press");
      I.box(x - 0.2, 0.3, BZ, 1.0, 1.0, 0.35, "yellow");
      I.box(x, 2.1, 0, 0.6, 0.6, 4.6, "press");
      if (plate) I.sideText(x + 0.61, 2.45, 4.78, plate, 15, "var(--plate)");
    },
    // Side booth with an arm reaching over the belt; it stamps a tag on what passes.
    boothBack(x) { I.box(x, -2.0, 0, 1.6, 1.3, 2.8, "press"); I.side(x + 1.61, -1.8, 1.6, 0.9, 0.6, "var(--window)"); },
    boothFront(x) { I.box(x + 0.5, -0.7, 2.5, 0.6, 2.0, 0.3, "steel"); I.box(x + 0.55, 0.85, 1.9, 0.5, 0.5, 0.6, "yellow"); },
    gateBack(x) { I.box(x, -0.8, 0, 0.4, 0.4, 3.9, "gate"); },
    gateBeam(x) { I.raw(`<g opacity=".28">`); I.side(x + 0.2, -0.4, BZ, 2.4, 2.7, "var(--gate-t)"); I.raw(`</g>`); },
    gateFront(x, badge = true) {
      I.box(x, 2.0, 0, 0.4, 0.4, 3.9, "gate");
      I.box(x, -0.8, 3.9, 0.4, 3.2, 0.4, "gate");
      if (badge) { const [a, b] = I.P(x + 0.2, 2.4, 4.6); I.raw(`<g transform="translate(${a + 18} ${b - 6})"><circle r="15" fill="var(--gate-t)"/><path d="M-7 0 l5 5 l9 -10" stroke="var(--badge-ink)" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`); }
    },
    crate(x, y, w, h, z = BZ, m = "crate") { I.box(x, y, z, w, w, h, m); I.flat(x + w / 2 - 0.09, y, z + h + 0.001, 0.18, w, "var(--tape)"); },
    tag(x, y, z) { I.front(x, y, z, 0.5, 0.3, "var(--yellow-t)"); },
    sign(x, y, z, dx, dy, t, cls) { const [a, b] = I.P(x, y, z); I.sign(a, b, dx, dy, t, cls); },
  };
  return p;
};

// How it works: the line seen from the side, in the order of the agent guide.
window.drawWorkflow = function (svg) {
  const o = [], W = 1200, fl = 410, bt = 330;
  const r = (x, y, w, h, f, rx = 3, extra = "") => o.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" ${extra}/>`);
  const t = (x, y, s, f, size = 18, w = 700) => o.push(`<text x="${x}" y="${y}" text-anchor="middle" font-family="JetBrains Mono" font-size="${size}" font-weight="${w}" fill="${f}">${s}</text>`);
  // back wall with windows, then the floor
  r(40, 30, W - 80, fl - 30, "var(--wall-l)", 8);
  for (let x = 110; x < W - 100; x += 210) r(x, 60, 120, 70, "var(--window)", 4);
  r(40, fl, W - 80, 24, "var(--slab-l)", 0); r(40, fl, W - 80, 6, "var(--stripe)", 0);
  // 3 booth, behind the belt, with an arm that stamps a tag
  const b3 = 750;
  r(b3 + 20, bt - 230, 110, 230 + fl - bt, "var(--press-t)", 6); r(b3 + 38, bt - 210, 50, 32, "var(--window)", 3);
  r(b3 - 30, bt - 160, 80, 16, "var(--steel-l)", 3); r(b3 - 30, bt - 144, 16, 70, "var(--steel-l)", 2); r(b3 - 36, bt - 74, 28, 20, "var(--yellow-t)", 3);
  // conveyor: frame, belt, rollers, legs
  for (let x = 120; x < W - 100; x += 160) r(x, bt + 22, 14, fl - bt - 22, "var(--steel-r)", 2);
  r(90, bt, W - 180, 24, "var(--steel-l)", 4); r(90, bt - 6, W - 180, 8, "var(--belt)", 2);
  for (let x = 104; x < W - 90; x += 28) o.push(`<circle cx="${x}" cy="${bt + 12}" r="6" fill="var(--steel-r)"/><circle cx="${x}" cy="${bt + 12}" r="2" fill="var(--steel-t)"/>`);
  const crate = (x, w = 50, h = 42, tag = false) => { r(x - w / 2, bt - 6 - h, w, h, "var(--crate-l)", 2); r(x - w / 2, bt - 6 - h, w, 8, "var(--crate-t)", 2); r(x - 4, bt - 6 - h, 8, h, "var(--tape)", 0); if (tag) r(x + 8, bt - 30, 14, 12, "var(--yellow-t)", 1); };
  // 1 hopper on a stand, cards falling in
  const h1 = 190;
  r(h1 - 44, bt - 70, 10, 64, "var(--steel-r)", 2); r(h1 + 34, bt - 70, 10, 64, "var(--steel-r)", 2);
  o.push(`<path d="M${h1 - 75} ${bt - 170} H${h1 + 75} L${h1 + 28} ${bt - 70} H${h1 - 28} Z" fill="var(--yellow-l)"/>`);
  r(h1 - 80, bt - 178, 160, 12, "var(--yellow-t)", 3);
  [[-30, -200, -12], [14, -235, 8], [-6, -268, -4]].forEach(([dx, dy, a]) => r(h1 + dx - 22, bt + dy, 44, 8, "var(--card-t)", 2, `transform="rotate(${a} ${h1 + dx} ${bt + dy + 4})" stroke="var(--card-r)" stroke-width="1.5"`));
  crate(320, 40, 30);
  // 2 press: pillar, beam, piston, die
  const p2 = 470;
  r(p2 - 80, bt - 250, 26, 250 + fl - bt, "var(--press-l)", 3); r(p2 + 54, bt - 250, 26, 250 + fl - bt, "var(--press-l)", 3);
  r(p2 - 90, bt - 270, 180, 34, "var(--press-t)", 4); t(p2, bt - 247, "COPIER", "var(--plate)", 17);
  r(p2 - 8, bt - 236, 16, 90, "var(--steel-t)", 2); r(p2 - 36, bt - 146, 72, 50, "var(--press-r)", 4); r(p2 - 40, bt - 26, 80, 20, "var(--yellow-t)", 3);
  crate(610);
  crate(880, 50, 42, true);
  // 4 test gate: two posts, beam, scan curtain, badge
  const g4 = 1010;
  o.push(`<rect x="${g4 - 40}" y="${bt - 200}" width="80" height="194" fill="var(--gate-t)" opacity=".25"/>`);
  r(g4 - 52, bt - 220, 18, 220 + fl - bt, "var(--gate-l)", 3); r(g4 + 34, bt - 220, 18, 220 + fl - bt, "var(--gate-l)", 3); r(g4 - 60, bt - 236, 120, 22, "var(--gate-t)", 4);
  o.push(`<circle cx="${g4}" cy="${bt - 270}" r="20" fill="var(--gate-t)"/><path d="M${g4 - 9} ${bt - 270} l6 7 l12 -14" stroke="var(--badge-ink)" stroke-width="3.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  crate(1010, 50, 42, true); crate(1095, 56, 50, true);
  // step numbers and names under the floor
  [[h1, "1", "ask the five questions"], [p2, "2", "copier copy --defaults"], [b3, "3", "git init -b main"], [g4, "4", "pytest + ruff"]].forEach(([x, n, name]) => {
    o.push(`<circle cx="${x}" cy="${fl + 62}" r="20" class="numc"/>`); t(x, fl + 69, n, "var(--sign-ink)", 20); t(x, fl + 116, name, "var(--ink)");
  });
  svg.innerHTML = o.join("");
};

// What you get: one crate per part of a generated repository, the optional kit drawn as a ghost crate.
window.drawContents = function (svg) {
  const I = Iso(svg, { s: 34, ox: 560, oy: 140 }), p = Parts(I, 0);
  p.slab(-0.8, -0.8, 10.4, 8.4);
  const items = [
    [0.2, 0.2, "tests/  pytest.ini", -260, -10],
    [3.6, 0.2, "scripts/  release, stamp, new_skill", 120, -80],
    [7.0, 0.2, ".github/workflows/  tests, release", 150, -70],
    [0.2, 3.6, "AGENTS.md  ruff.toml  .editorconfig", -250, 10],
    [3.6, 3.6, "&lt;prefix&gt;-example/  SKILL.md", 330, 170],
    [7.0, 3.6, "contract/kit.sh  (with_kit)", 320, 50],
  ];
  const signs = [];
  items.forEach(([x, y, t, dx, dy], i) => {
    I.box(x - 0.1, y - 0.1, 0, 2.8, 2.8, 0.2, "pallet");
    if (i === 5) {
      I.raw(`<g opacity=".55" stroke="var(--yellow-l)" stroke-width="2" stroke-dasharray="6 5">`); I.box(x + 0.3, y + 0.3, 0.2, 2, 2, 1.5, "ghost"); I.raw(`</g>`);
    } else {
      p.crate(x + 0.3, y + 0.3, 2, 1.3, 0.2, i === 4 ? "yellow" : "crate");
      if (i === 0 || i === 3) p.crate(x + 0.65, y + 0.65, 1.3, 0.8, 1.5);
    }
    signs.push([x + 1.3, y + 1.3, i === 5 ? 1.7 : 1.5, dx, dy, t, i === 5 ? "sign opt" : "sign"]);
  });
  // README, LICENSE and the copier answers ride on a small cart in front
  I.box(3.9, 7.0, 0, 2.0, 1.2, 0.2, "steel"); I.box(4.1, 7.15, 0.2, 0.7, 0.9, 0.12, "card"); I.box(5.0, 7.15, 0.2, 0.7, 0.9, 0.24, "card");
  signs.push([4.9, 7.6, 0.4, -260, 40, "README  LICENSE  .copier-answers.yml", "sign"]);
  signs.forEach(s => p.sign(...s));
  I.done();
};

// Stay in sync: a forklift delivers the newer template to the rack where the generated repo is stored.
window.drawUpdate = function (svg) {
  const I = Iso(svg, { s: 34, ox: 540, oy: 235 }), p = Parts(I, 0);
  p.slab(-1.2, -1.2, 12.2, 8.0);
  // storage rack: back posts, then each level with its load, then front posts
  const posts = y => [0, 3, 6].forEach(x => I.box(x, y, 0, 0.25, 0.25, 4.5, "steel"));
  posts(0);
  I.box(0, 0, 0.3, 6.25, 2.6, 0.18, "yellow");
  p.crate(0.5, 0.45, 1.7, 1.2, 0.48);
  I.box(3.4, 0.35, 0.48, 2.3, 1.9, 1.5, "repo"); I.flat(4.4, 0.35, 1.981, 0.3, 1.9, "var(--tape)");
  I.box(0, 0, 3.0, 6.25, 2.6, 0.18, "yellow");
  p.crate(0.5, 0.45, 1.6, 1.1, 3.18); p.crate(3.7, 0.45, 1.5, 1.0, 3.18);
  posts(2.35);
  // forklift facing the rack: forks and load first, then mast, then body
  const fx = 3.3, fy = 4.4;
  I.box(fx + 0.5, fy - 0.9, 0.9, 0.3, 2.0, 0.08, "steel"); I.box(fx + 1.7, fy - 0.9, 0.9, 0.3, 2.0, 0.08, "steel");
  I.box(fx + 0.3, fy - 0.8, 0.98, 1.9, 1.6, 0.16, "pallet");
  [[0.4, -0.7], [1.3, -0.7], [0.4, 0.05], [1.3, 0.05]].forEach(([dx, dy]) => I.box(fx + dx, fy + dy, 1.14, 0.75, 0.7, 0.5, "yellow"));
  I.box(fx + 0.3, fy + 1.1, 0, 0.18, 0.18, 3.3, "steel"); I.box(fx + 2.0, fy + 1.1, 0, 0.18, 0.18, 3.3, "steel");
  I.box(fx + 0.3, fy + 1.1, 3.1, 1.88, 0.18, 0.18, "steel");
  I.box(fx, fy + 1.4, 0.25, 2.5, 2.4, 1.1, "yellow");
  I.box(fx + 0.3, fy + 1.9, 0, 0.5, 0.5, 0.5, "press"); I.box(fx + 1.7, fy + 1.9, 0, 0.5, 0.5, 0.5, "press");
  I.box(fx + 0.3, fy + 3.0, 1.35, 1.9, 0.8, 0.4, "press");
  // review stand with a clipboard holding the diff
  I.box(9.6, 3.6, 0, 0.2, 0.2, 2.0, "steel");
  I.box(9.0, 3.5, 2.0, 1.4, 1.0, 0.08, "card");
  [0.2, 0.45, 0.7].forEach((dy, i) => I.flat(9.2, 3.5 + dy, 2.081, i === 1 ? 0.6 : 1.0, 0.09, i === 1 ? "var(--gate-t)" : "var(--yellow-l)"));
  p.sign(4.5, 2.25, 1.2, -360, -215, "repo + .copier-answers.yml");
  p.sign(4.1, fy - 0.7, 1.65, -340, 40, "newer template");
  p.sign(fx + 1.2, fy + 3.0, 2.95, -40, 150, "copier update --defaults");
  p.sign(9.7, 4.0, 2.1, 150, -60, "review the diff, then commit", "sign ok");
  I.done();
};
