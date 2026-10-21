// Isometric drawing kit: fixed geometry, colors only through CSS tokens, so both themes come from one drawing.
window.Iso = function (svg, { s = 36, ox = 640, oy = 200 } = {}) {
  const C = 0.866, out = [];
  const P = (x, y, z) => [ox + (x - y) * C * s, oy + (x + y) * 0.5 * s - z * s];
  const pts = a => a.map(p => p.map(n => n.toFixed(1)).join(",")).join(" ");
  const poly = (a, fill, extra = "") => out.push(`<polygon points="${pts(a)}" fill="${fill}" ${extra}/>`);
  const mat = m => ({ t: `var(--${m}-t)`, l: `var(--${m}-l)`, r: `var(--${m}-r)` });
  const api = {
    P, poly, raw: h => out.push(h),
    box(x, y, z, w, d, h, m) {
      const c = mat(m);
      poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], c.l);
      poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], c.r);
      poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], c.t);
    },
    // Floor-plane quad, for shadows, decals and floor tiles.
    flat(x, y, z, w, d, fill, extra = "") { poly([P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)], fill, extra); },
    // Quad on the front face (normal +y) and on the right face (normal +x).
    front(x, y, z, w, h, fill, extra = "") { poly([P(x, y, z), P(x + w, y, z), P(x + w, y, z + h), P(x, y, z + h)], fill, extra); },
    side(x, y, z, d, h, fill, extra = "") { poly([P(x, y, z), P(x, y + d, z), P(x, y + d, z + h), P(x, y, z + h)], fill, extra); },
    // Funnel: wide open top, narrow bottom, inner dark opening.
    hopper(x, y, z, w, d, h, inset, m) {
      const c = mat(m), i = inset;
      poly([P(x + i, y + d - i, z), P(x + w - i, y + d - i, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], c.l);
      poly([P(x + w - i, y + i, z), P(x + w - i, y + d - i, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], c.r);
      poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], c.t);
      poly([P(x + .18, y + .18, z + h), P(x + w - .18, y + .18, z + h), P(x + w - .18, y + d - .18, z + h), P(x + .18, y + d - .18, z + h)], "var(--hole)");
    },
    // Text laid on the right face, reading along -y.
    sideText(x, y, z, t, size, fill, weight = 700) {
      const [a, b] = P(x, y, z);
      out.push(`<text transform="matrix(${C},-0.5,0,1,${a.toFixed(1)},${b.toFixed(1)})" font-family="JetBrains Mono" font-size="${size}" font-weight="${weight}" fill="${fill}">${t}</text>`);
    },
    // Text laid on the front face, reading along +x.
    frontText(x, y, z, t, size, fill, weight = 700) {
      const [a, b] = P(x, y, z);
      out.push(`<text transform="matrix(${C},0.5,0,1,${a.toFixed(1)},${b.toFixed(1)})" font-family="JetBrains Mono" font-size="${size}" font-weight="${weight}" fill="${fill}">${t}</text>`);
    },
    // Sign: a chip in screen space with a leader line down to a point of the scene.
    sign(px, py, dx, dy, t, cls = "sign") {
      const w = t.replace(/&[a-z]+;/g, "x").length * 10.4 + 26, x = px + dx - w / 2, y = py + dy - 34;
      out.push(`<line x1="${px}" y1="${py}" x2="${px + dx}" y2="${py + dy}" stroke="var(--lead)" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>`);
      out.push(`<circle cx="${px}" cy="${py}" r="4" fill="var(--lead)"/>`);
      out.push(`<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="34" rx="6"/>`);
      out.push(`<text x="${px + dx}" y="${y + 23}" text-anchor="middle" font-family="JetBrains Mono" font-size="17" font-weight="700" class="${cls}-t">${t}</text>`);
    },
    done() { svg.innerHTML = out.join(""); },
  };
  return api;
};

// The production line shared by every hero variant. opts.wall adds a factory back wall, opts.slab a floor slab.
window.drawLine = function (svg, opts = {}) {
  const I = Iso(svg, opts), L = 16, BZ = 1.2;
  if (opts.slab) {
    I.box(-1.6, -2.4, -0.5, L + 3.2, 6.4, 0.5, "slab");
    for (let x = -1.6; x <= L + 1.6 + 1e-6; x += 1.6) I.raw(`<polyline points="${[I.P(x, -2.4, 0), I.P(x, 4, 0)].map(p => p.join(",")).join(" ")}" stroke="var(--grid)" stroke-width="1.2" fill="none"/>`);
    for (let y = -2.4; y <= 4 + 1e-6; y += 1.6) I.raw(`<polyline points="${[I.P(-1.6, y, 0), I.P(L + 1.6, y, 0)].map(p => p.join(",")).join(" ")}" stroke="var(--grid)" stroke-width="1.2" fill="none"/>`);
    I.flat(-1.6, 3.3, 0.001, L + 3.2, 0.25, "var(--stripe)");
  }
  if (opts.wall) {
    const wy = -2.4, top = 4.2;
    I.side(-1.6, wy, 0, 6.4, top, "var(--wall-r)");
    I.front(-1.6, wy, 0, L + 3.2, top, "var(--wall-l)");
    // sawtooth roof line along the back wall
    for (let x = -1.6; x < L + 1.6 - 1e-6; x += 3.2) I.poly([I.P(x, wy, top), I.P(x + 3.2, wy, top), I.P(x + 3.2, wy, top + 1.3)], "var(--wall-l)");
    for (let x = -0.6; x < L + 1; x += 3.2) I.front(x, wy, 1.9, 1.4, 1.5, "var(--window)");
  }
  // shadow of the line on the floor
  I.flat(0.2, 0.4, 0.002, L, 2.2, "var(--shadow)");
  // back legs, then the conveyor frame and belt
  for (let x = 0.4; x < L; x += 2.6) I.box(x, 0.1, 0, 0.3, 0.3, BZ - 0.35, "steel");
  // press and gate back pillars sit behind the belt
  I.box(5.0, -0.9, 0, 0.6, 0.6, 4.6, "press");
  I.box(9.6, -0.8, 0, 0.4, 0.4, 3.9, "gate");
  I.box(0, 0, BZ - 0.35, L, 2, 0.35, "steel");
  I.flat(0, 0.12, BZ, L, 1.76, "var(--belt)");
  for (let x = 0.5; x < L; x += 0.8) I.raw(`<polyline points="${[I.P(x, 0.12, BZ), I.P(x, 1.88, BZ)].map(p => p.join(",")).join(" ")}" stroke="var(--belt-line)" stroke-width="1.5" fill="none"/>`);
  for (let x = 0.3; x < L; x += 0.55) { const [a, b] = I.P(x, 2, BZ - 0.18); I.raw(`<circle cx="${a}" cy="${b}" r="2.6" fill="var(--steel-t)"/>`); }
  for (let x = 0.4; x < L; x += 2.6) I.box(x, 1.6, 0, 0.3, 0.3, BZ - 0.35, "steel");

  // station 1: hopper on a stand, answer cards dropping in
  I.box(0.6, 0.2, BZ, 0.25, 0.25, 1.1, "steel"); I.box(2.15, 0.2, BZ, 0.25, 0.25, 1.1, "steel");
  I.hopper(0.4, -0.1, BZ + 1.1, 2.2, 2.2, 1.6, 0.6, "yellow");
  [[0.9, 0.6, 4.6, -1], [1.5, 0.3, 5.3, 1], [1.1, 1.0, 6.0, 0]].forEach(([x, y, z]) => { I.box(x, y, z, 0.9, 0.65, 0.06, "card"); I.flat(x + 0.15, y + 0.15, z + 0.061, 0.55, 0.06, "var(--card-line)"); I.flat(x + 0.15, y + 0.33, z + 0.061, 0.4, 0.06, "var(--card-line)"); });
  // parts leaving the hopper
  I.box(3.3, 0.55, BZ, 0.9, 0.9, 0.5, "card");

  // station 2: press gantry with piston
  I.box(5.0, -0.9, 4.6, 0.6, 3.6, 0.7, "press");
  I.box(5.15, 0.6, 3.2, 0.3, 0.3, 1.4, "steel");
  I.box(4.85, 0.35, 2.4, 0.9, 0.9, 0.8, "press");
  I.box(4.8, 0.3, BZ, 1.0, 1.0, 0.35, "yellow");
  I.box(5.0, 2.1, 0, 0.6, 0.6, 4.6, "press");
  I.sideText(5.61, 2.45, 4.78, "COPIER", 15, "var(--plate)");

  // repo crates between stations
  const crate = (x, y, w, h) => { I.box(x, y, BZ, w, w, h, "crate"); I.flat(x + w / 2 - 0.09, y, BZ + h + 0.001, 0.18, w, "var(--tape)"); };
  crate(7.1, 0.45, 1.1, 0.8);
  // station 3: test gate with scan beam
  I.raw(`<g opacity=".28">`); I.side(9.8, -0.4, BZ, 2.4, 2.7, "var(--gate-t)"); I.raw(`</g>`);
  crate(11.0, 0.45, 1.1, 0.8);
  I.box(9.6, 2.0, 0, 0.4, 0.4, 3.9, "gate");
  I.box(9.6, -0.8, 3.9, 0.4, 3.2, 0.4, "gate");
  // check badge on the gate beam
  const [ga, gb] = I.P(9.8, 2.4, 4.6); I.raw(`<g transform="translate(${ga + 18} ${gb - 6})"><circle r="15" fill="var(--gate-t)"/><path d="M-7 0 l5 5 l9 -10" stroke="var(--badge-ink)" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`);

  // output: pallet with the finished repository
  I.box(13.0, 0.15, BZ, 2.9, 1.7, 0.18, "pallet");
  I.box(13.15, 0.3, BZ + 0.18, 2.6, 1.4, 1.5, "repo");
  I.flat(14.3, 0.3, BZ + 1.681, 0.3, 1.4, "var(--tape)");
  I.front(13.3, 1.7, BZ + 0.5, 2.3, 0.7, "var(--label)");
  I.frontText(13.42, 1.7, BZ + 0.72, "&lt;repo_name&gt;", 10.5, "var(--label-ink)");

  // signs
  const sg = (x, y, z, dx, dy, t, cls) => { const [a, b] = I.P(x, y, z); I.sign(a, b, dx, dy, t, cls); };
  sg(1.5, -0.1, BZ + 2.9, -30, -70, "five answers");
  sg(5.3, -0.9, 5.3, 40, -40, "copier copy");
  sg(9.8, -0.8, 4.3, 60, -50, "pytest + ruff", "sign ok");
  sg(14.4, 0.3, BZ + 1.7, 60, -70, "tested repo", "sign ok");
  I.done();
};
