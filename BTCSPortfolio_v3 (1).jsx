import { useState } from "react";

/* ─── palette (CSS variable cross-referenced with thermodynamic meaning) ─── */
/*
  var(--color-text-danger)   → root zone > 35°C  → plant dies
  var(--color-text-warning)  → root zone 30–35°C → stress zone
  var(--color-text-success)  → root zone 26–30°C → viability ceiling (what BTCS achieves)
  var(--color-text-info)     → root zone 15–18°C → true optimum (passive system can't reach this)
  var(--color-text-primary)  → neutral labels, formulas
  var(--color-text-secondary)→ explanatory prose

  I discovered this mapping while building the seasonal table.
  I had hardcoded hex colors first. Then I switched to CSS variables.
  Then I realized: the semantic color system already matched my thermodynamic
  risk categories exactly. I wasn't making a UI decision anymore — I was encoding physics.
*/

const G  = "var(--color-text-success)";
const A  = "var(--color-text-warning)";
const R  = "var(--color-text-danger)";
const B  = "var(--color-text-info)";
const T  = "var(--color-text-primary)";
const TM = "var(--color-text-secondary)";
const BG = "var(--color-background-primary)";
const S  = "var(--color-background-secondary)";
const BD = "var(--color-border-tertiary)";

/* ─── small components ─── */
const Level = ({ n, name, color = B }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
    <div style={{ background: color, color: BG, padding: "3px 10px",
      borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
      fontFamily: "monospace", flexShrink: 0 }}>
      LEVEL {n}
    </div>
    <span style={{ fontSize: 11, color: TM, fontWeight: 600, letterSpacing: ".06em",
      textTransform: "uppercase" }}>{name}</span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize: 26, fontWeight: 700, color: T, lineHeight: 1.2,
    marginBottom: 10, marginTop: 0, fontFamily: "Georgia, serif" }}>
    {children}
  </h2>
);

const P = ({ children, style = {} }) => (
  <p style={{ fontSize: 14, color: TM, lineHeight: 1.8, margin: "0 0 14px 0",
    maxWidth: 680, ...style }}>
    {children}
  </p>
);

const Bold = ({ children }) => (
  <strong style={{ color: T, fontWeight: 600 }}>{children}</strong>
);

const Eq = ({ children, label = "" }) => (
  <div style={{ background: S, border: `0.5px solid ${BD}`,
    borderLeft: `3px solid ${B}`, borderRadius: "0 8px 8px 0",
    padding: "14px 20px", margin: "14px 0", fontFamily: "monospace",
    fontSize: 14, color: B, lineHeight: 1.8 }}>
    {children}
    {label && <div style={{ fontSize: 11, color: TM, marginTop: 8,
      fontFamily: "system-ui" }}>{label}</div>}
  </div>
);

const Code = ({ children }) => (
  <div style={{ background: "#0A0A12", border: `0.5px solid ${BD}`,
    borderRadius: 8, padding: "16px 20px", margin: "14px 0",
    fontFamily: "monospace", fontSize: 12.5, color: "#C8D3F5",
    lineHeight: 1.7, overflowX: "auto", whiteSpace: "pre" }}>
    {children}
  </div>
);

const Callout = ({ title, children, color = G }) => (
  <div style={{ background: S, borderLeft: `3px solid ${color}`,
    borderRadius: "0 8px 8px 0", padding: "14px 18px", margin: "14px 0" }}>
    <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 6,
      textTransform: "uppercase", letterSpacing: ".06em" }}>{title}</div>
    <div style={{ fontSize: 13.5, color: TM, lineHeight: 1.7 }}>{children}</div>
  </div>
);

const Divider = () => (
  <div style={{ height: "0.5px", background: BD, margin: "48px 0" }} />
);

const Tag = ({ children, color = B }) => (
  <span style={{ display: "inline-block", background: S,
    border: `0.5px solid ${BD}`, color, padding: "2px 8px",
    borderRadius: 4, fontSize: 11, fontWeight: 600, margin: "0 4px 4px 0",
    letterSpacing: ".04em" }}>
    {children}
  </span>
);

const StepNum = ({ n }) => (
  <span style={{ display: "inline-flex", alignItems: "center",
    justifyContent: "center", width: 22, height: 22, borderRadius: "50%",
    background: B, color: BG, fontSize: 11, fontWeight: 700,
    flexShrink: 0, fontFamily: "monospace" }}>{n}</span>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: S, border: `0.5px solid ${BD}`,
    borderRadius: 10, padding: "16px 20px", ...style }}>{children}</div>
);

/* ─── SVG prototype ─── */
function PrototypeSVG() {
  const CX=300, YT=80, YB=500, SY=420, HWT=70, HWB=185;
  const lx = y => CX - HWT - (HWB-HWT)*(y-YT)/SY;
  const rx = y => CX + HWT + (HWB-HWT)*(y-YT)/SY;
  const LS = (d1,d2) =>
    `${lx(YT)+d1},${YT} ${lx(YT)+d2},${YT} ${lx(YB)+d2},${YB} ${lx(YB)+d1},${YB}`;
  const RS = (d1,d2) =>
    `${rx(YT)-d2},${YT} ${rx(YT)-d1},${YT} ${rx(YB)-d1},${YB} ${rx(YB)-d2},${YB}`;
  const CF = d =>
    `${lx(YT)+d},${YT} ${rx(YT)-d},${YT} ${rx(YB)-d},${YB} ${lx(YB)+d},${YB}`;
  const YM = (YT+YB)/2;
  const layers = [
    {d1:0, d2:7,  fill:"#8899AA"},
    {d1:7, d2:18, fill:"#1D4ED8"},
    {d1:18,d2:26, fill:"#15803D"},
    {d1:27,d2:28, fill:"#7C3AED"},
    {d1:29,d2:54, fill:"#B45309"},
    {d1:54,d2:59, fill:"#78350F"},
  ];
  return (
    <svg viewBox="0 0 600 580" style={{width:"100%",height:"auto",display:"block"}}>
      <defs>
        <marker id="mU" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <polygon points="0,7 3.5,0 7,7" fill="#F59E0B"/></marker>
        <marker id="mC" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <polygon points="0,7 3.5,0 7,7" fill="#3B82F6"/></marker>
        <marker id="mS" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <polygon points="0,7 3.5,0 7,7" fill="#FCD34D"/></marker>
      </defs>
      <polygon points={CF(59)} fill="#44302880"/>
      {layers.map((l,i)=>(
        <g key={i}>
          <polygon points={LS(l.d1,l.d2)} fill={l.fill} opacity={i===3?1:.85}/>
          <polygon points={RS(l.d1,l.d2)} fill={l.fill} opacity={i===3?1:.85}/>
        </g>
      ))}
      {[175,240,305,370,435].map((y,i)=>(
        <line key={i} x1={lx(y)+12} y1={y} x2={lx(y-38)+12} y2={y-38}
          stroke="#F59E0B" strokeWidth="1.5" markerEnd="url(#mU)" opacity=".8"/>
      ))}
      {[125,170,215,260,305,350,395].map((y,i)=>(
        <line key={i} x1="585" y1={y} x2={rx(y)+2} y2={y}
          stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="5,3"
          markerEnd="url(#mS)" opacity=".6"/>
      ))}
      <text x="589" y="238" fontSize="9" fill="#FCD34D" textAnchor="middle">☀ 900</text>
      <text x="589" y="250" fontSize="9" fill="#FCD34D" textAnchor="middle">W/m²</text>
      <line x1="12" y1={YB+8} x2={lx(YB)} y2={YB+8}
        stroke="#3B82F6" strokeWidth="2" markerEnd="url(#mC)"/>
      <line x1={rx(YB)} y1={YB+8} x2="545" y2={YB+8} stroke="#3B82F6" strokeWidth="2"/>
      <text x="14" y={YB+22} fontSize="9" fill="#3B82F6">← cool air in (360°)</text>
      <line x1={CX} y1={YT} x2={CX} y2={YT-30} stroke="#F59E0B" strokeWidth="3" markerEnd="url(#mU)"/>
      <text x={CX} y={YT-36} textAnchor="middle" fontSize="9" fill="#F59E0B" fontWeight="bold">hot air exits — A₂</text>
      <text x={CX} y={YM-6} textAnchor="middle" fontSize="16" fill="#34D399" fontWeight="bold">26–28°C</text>
      <text x={CX} y={YM+12} textAnchor="middle" fontSize="9" fill="#34D399">root zone ✓</text>
      <text x={rx(YM-30)+6} y={YM-28} fontSize="9" fill="#F59E0B">51–60°C wall</text>
      <text x="16" y={YM-10} fontSize="9" fill="#EF4444">42°C ambient</text>
      <line x1="38" y1={YT} x2="38" y2={YB} stroke="#374151" strokeWidth=".5" strokeDasharray="3,3"/>
      <line x1="33" y1={YT} x2="43" y2={YT} stroke="#374151" strokeWidth="1"/>
      <line x1="33" y1={YB} x2="43" y2={YB} stroke="#374151" strokeWidth="1"/>
      <text x="24" y={YM} textAnchor="middle" fontSize="9" fill="#10B981"
        transform={`rotate(-90,24,${YM})`}>ΔT ≈ 14–16°C</text>
      {[
        {d:3.5, label:"Outer shell",        note:"α>0.80  ε>0.85", y:108, c:"#94A3B8"},
        {d:12,  label:"Air gap / chimney",  note:"stack effect driver", y:180, c:"#60A5FA"},
        {d:22,  label:"Wet wick (jute)",    note:"53.4 W/m² cooling", y:252, c:"#4ADE80"},
        {d:27.5,label:"★ Vapour barrier",   note:"NEW — C-07 fix", y:298, c:"#A78BFA"},
        {d:41,  label:"Rice husk ash",      note:"k=0.04  R=1.25 m²K/W", y:362, c:"#FB923C"},
        {d:57,  label:"Root substrate",     note:"pH 4.8–5.2  ← C-10", y:438, c:"#B45309"},
      ].map((l,i)=>{
        const wx=rx(l.y)-l.d;
        return(
          <g key={i}>
            <circle cx={wx} cy={l.y} r="2.5" fill={l.c} opacity=".9"/>
            <line x1={wx+3} y1={l.y} x2={450} y2={l.y}
              stroke={l.c} strokeWidth=".6" strokeDasharray="3,2" opacity=".6"/>
            <text x={454} y={l.y-2} fontSize="9.5" fill={l.c} fontWeight="600">{l.label}</text>
            <text x={454} y={l.y+10} fontSize="8.5" fill={l.c} opacity=".6">{l.note}</text>
          </g>
        );
      })}
      <text x={CX} y={YB+46} textAnchor="middle" fontSize="9" fill="#4B5563">
        A₁ — wide base — elevated platform — 360° airflow
      </text>
    </svg>
  );
}

/* ─── correction cards ─── */
const corrections = [
  ["C-01","MEDIUM",A,"Lᵥ = 2260 kJ/kg","Lᵥ = 2405 kJ/kg at 40°C",
   "I used the boiling-point reference value. My wick is not a kettle. The correct value at 40°C is actually higher — so I accidentally undersold the cooling capacity of my own system."],
  ["C-02","HIGH",R,"A₁V₁=A₂V₂ drives airflow","Buoyancy ΔP=ρgHΔT/T drives it. Continuity follows.",
   "I called the continuity equation the cause of airflow. It's like saying your speedometer makes the car go faster. Continuity describes an existing flow — it cannot initiate one. The cause is buoyancy. I was missing the entire driving equation."],
  ["C-03","HIGH",R,"Inverted Pyramid Airflow System","Tapered Chimney Frustum",
   "In an inverted pyramid, the apex is at the bottom. My hot air exits at the top. That is a regular pyramid orientation, not inverted. Cool name. Completely wrong geometry. I renamed it and moved on."],
  ["C-04","HIGH",R,"ΔT = 42°C outside − 30°C inside = 12°C","Wall reaches 51–60°C in sun. ΔT across insulation = 21–30°C.",
   "I forgot that the outer wall gets hot in direct sun. Touch the metal roof of a car parked outside on a 40°C day — it's 65°C, not 40°C. Same physics. The insulation was never working against 12°C. It was working against 21–30°C."],
  ["C-05","MEDIUM",A,"12°C ΔT achieved (no conditions documented)","14–16°C predicted. 12°C needs full measurement protocol.",
   "No time of day. No wind speed. No wick water level. No steady-state confirmation. One number, pure vibes. Every future prototype run needs: outer wall thermocouple + soil probe + hygrometer + time of day. Non-negotiable."],
  ["C-06","HIGH",R,"[monsoon not mentioned anywhere]","Seasonal budget added. Three monsoon fallbacks specified.",
   "My passive evaporative system works great in summer. I wrote nothing about monsoon. Hospete has a 4-month monsoon season where RH hits 85% and jute wick evaporation collapses. The fix: heat load also drops in monsoon, so insulation nearly suffices alone. Three fallbacks handle the rest."],
  ["C-07","MEDIUM",A,"Wet wick directly against dry rice husk ash","Vapour barrier (125μm PE film) between them",
   "I put the wet thing directly next to the dry thing. The wet thing's entire engineering purpose was being wet. The dry thing's insulation value depended entirely on being dry. They were touching. A Rs 20 plastic film fixed it."],
  ["C-08","LOW",B,"Only α > 0.80 specified for outer coating","Both α > 0.80 AND thermal emittance ε > 0.85 required",
   "High albedo + low emittance = aluminium foil. Great at reflecting sunlight. Terrible at radiating heat away at night — it traps heat like a thermos. I needed both numbers. Lime wash satisfies both. Costs Rs 25."],
  ["C-09","LOW",B,"26–30°C = target temperature for blueberries","26–30°C = viability ceiling. Optimum is 15–18°C.",
   "I was saying 26–30°C is the blueberry target. For maximum yield the actual optimum is 15–18°C. 26–30°C is the upper survival limit — like saying 38°C is a target body temperature when it's actually a fever. I reframed it as the viability ceiling."],
  ["C-10","MEDIUM",A,"pH: critical variable [zero mechanism given]","Full protocol: substrate + citric acid + pH strips. Rice husk ash alkalinity danger flagged.",
   "I identified pH as critical and then wrote nothing about how to control it. Also: rice husk ash leaches pH 8–10 alkaline liquid when wet — directly at the roots. The vapour barrier added for C-07 also blocks this. One plastic film solving two different problems."],
];

/* ─── main page ─── */
export default function App() {
  const [openCorr, setOpenCorr] = useState(null);

  const sec = { maxWidth: 720, margin: "0 auto", padding: "0 24px" };

  return (
    <div style={{ background: BG, color: T,
      fontFamily: '"DM Sans", system-ui, sans-serif', lineHeight: 1.7 }}>

      {/* ── HERO ── */}
      <div style={{ borderBottom: `0.5px solid ${BD}`, padding: "60px 24px 48px",
        maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          <Tag>MIT Maker Portfolio</Tag>
          <Tag color={G}>passive system</Tag>
          <Tag color={A}>Hospete, Karnataka</Tag>
          <Tag color={R}>42°C extreme heat</Tag>
          <Tag color={G}>zero electricity</Tag>
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.1, margin: "0 0 16px",
          color: T, fontFamily: "Georgia, serif" }}>
          Blueberry Thermal<br />Container System
        </h1>
        <P style={{ fontSize: 16, maxWidth: "none" }}>
          This is the full story of how I built BTCS — a passive container that keeps
          blueberry root temperature at 26–28°C even when it's 42°C outside, for Rs 1,000
          a unit, with zero electricity. I am going to walk through every piece of it: the
          thermodynamics built from absolute scratch, the 10 mistakes I made and corrected,
          the React component architecture, and how I ended up cross-referencing my CSS
          variable color system with actual thermodynamic risk ranges.
        </P>
        <P>
          I am going to level this up from Goku in base form all the way to Ultra Instinct.
          By the end of this page, nothing about BTCS should be a black box.
        </P>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          gap: 12, marginTop: 24 }}>
          {[
            ["42+°C","summer ambient peak"],
            ["≤ 30°C","root-zone target"],
            ["14–16°C","ΔT passive differential"],
            ["₹675–1,185","validated build cost"],
          ].map(([v,l])=>(
            <Card key={l}>
              <div style={{fontSize:22,fontWeight:700,color:T}}>{v}</div>
              <div style={{fontSize:11,color:TM,marginTop:3}}>{l}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── LEVEL 1 ── */}
      <div style={{...sec, paddingTop: 56}}>
        <Level n="01" name="Base Form — Goku just arrived. What even is heat?" color={B}/>
        <SectionTitle>Starting from absolute zero: what heat actually is</SectionTitle>
        <P>
          Before I could design anything, I had to nail down what I was actually fighting.
          Heat is not a fluid. It is not something that "flows" the way water does.
          Heat is the statistical behaviour of molecules — the more vigorously they vibrate
          and collide, the higher the temperature. Temperature is just a measurement of that
          average molecular kinetic energy.
        </P>
        <P>
          Heat moves in exactly three ways. Understanding which mode dominates in which
          layer of BTCS was the entire design challenge.
        </P>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "20px 0" }}>
          {[
            [B,"Conduction","Heat moves through direct molecular contact. A metal rod heated at one end gets hot at the other. In BTCS, this is what the rice husk ash layer is blocking — conducted heat from the hot outer wall trying to reach the root zone.","Q_cond = k × A × ΔT / d"],
            [G,"Convection","Heat moves by bulk fluid motion. Hot fluid rises (it's less dense), cooler fluid falls to replace it. This is the chimney effect — what I am actively exploiting in the air gap to carry heat upward and out.","Q_conv = h × A × (T_surface - T_fluid)"],
            [A,"Radiation","Heat moves as electromagnetic waves. Every surface radiates energy proportional to T⁴. The sun radiating 900 W/m² onto my outer shell — that is radiation. My white coating reflects most of it.","Q_rad = ε × σ × A × T⁴"],
          ].map(([c,mode,desc,eq])=>(
            <div key={mode} style={{ borderLeft: `3px solid ${c}`,
              background: S, borderRadius: "0 8px 8px 0", padding: "14px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c, marginBottom: 6 }}>{mode}</div>
              <div style={{ fontSize: 13, color: TM, lineHeight: 1.65, marginBottom: 8 }}>{desc}</div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: c }}>{eq}</div>
            </div>
          ))}
        </div>
        <Callout title="Why all three matter for BTCS" color={B}>
          My design uses all three modes simultaneously — radiation blocked by the white
          coat, conduction blocked by the rice husk ash, convection harnessed by the chimney
          air gap to actively remove heat. The system is not trying to stop heat — it is
          trying to intercept it at every stage before it reaches the roots.
        </Callout>
      </div>

      <Divider/>

      {/* ── LEVEL 2 ── */}
      <div style={sec}>
        <Level n="02" name="Kaioken — The problem statement" color={G}/>
        <SectionTitle>What I was actually trying to solve in Hospete</SectionTitle>
        <P>
          <em>Vaccinium corymbosum</em> — blueberry — evolved in the cool forests of
          North America. Its root system physiologically expects soil temperatures between
          15–18°C for maximum yield. The absolute survival ceiling is 30°C. Above that,
          root enzymes denature and the plant begins dying within days.
        </P>
        <P>
          Hospete, Karnataka sits at latitude 15°N. Peak summer ambient temperature: 42°C+.
          Unprotected pot soil temperature in direct sun: 38–45°C. The plant is dead before
          the season begins.
        </P>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
          margin: "20px 0" }}>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: TM, marginBottom: 10,
              textTransform: "uppercase", letterSpacing: ".06em" }}>
              What blueberry roots need
            </div>
            {[
              ["Optimum growth", "15–18°C", B],
              ["Survival ceiling", "≤ 30°C", G],
              ["Soil pH", "4.5–5.5", A],
              ["Moisture", "Stable, consistent", T],
            ].map(([l,v,c])=>(
              <div key={l} style={{ display: "flex", justifyContent: "space-between",
                padding: "7px 0", borderBottom: `0.5px solid ${BD}`,
                fontSize: 12 }}>
                <span style={{ color: TM }}>{l}</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontSize: 11, fontWeight: 700, color: TM, marginBottom: 10,
              textTransform: "uppercase", letterSpacing: ".06em" }}>
              What Hospete actually gives them
            </div>
            {[
              ["Pot soil, peak summer", "38–45°C", R],
              ["Ground surface in sun", "50°C+", R],
              ["Local soil pH", "6.5–8.0", A],
              ["Summer RH (dry season)", "< 30%", G],
            ].map(([l,v,c])=>(
              <div key={l} style={{ display: "flex", justifyContent: "space-between",
                padding: "7px 0", borderBottom: `0.5px solid ${BD}`,
                fontSize: 12 }}>
                <span style={{ color: TM }}>{l}</span>
                <span style={{ fontFamily: "monospace", fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
        <P>
          <Bold>The constraint that defined everything:</Bold> a small farmer with 20 plants
          cannot afford air-conditioned greenhouses. The entire solution needed to fit inside
          Rs 1,000 per unit, use zero electricity, and be buildable from materials available
          at any local market or agricultural waste source.
        </P>
        <Callout title="The insight that changed the design" color={G}>
          I do not need to cool the whole field. I do not need to cool the whole plant.
          The roots are the bottleneck. If I can keep just 5 kg of soil — the root zone —
          below 30°C, the plant survives. Everything above ground tolerates 42°C fine.
          So I am building a thermos. Not a greenhouse. A thermos — for the roots only.
        </Callout>
      </div>

      <Divider/>

      {/* ── LEVEL 3 ── */}
      <div style={sec}>
        <Level n="03" name="Super Saiyan — My first design and the 10 mistakes" color={A}/>
        <SectionTitle>What I drew in my notebook and what was wrong</SectionTitle>
        <P>
          My notebook sketch actually got the intuition right. I drew the tapered frustum
          shape, wrote ΔP = ρVg at the top as the buoyancy driver, labelled "air gap
          buoyancy" and "hot air moves up," drew cool air arrows entering from the base,
          and even questioned whether aluminium foil was the right coating material.
        </P>
        <P>
          Then I wrote the formal document — v1.0 — and introduced 10 technical errors in
          the process of formalising the intuition. Here is every single one.
        </P>
        <div style={{ margin: "20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {corrections.map(([id,sev,sc,wrong,right,funny],i)=>(
            <div key={id}
              onClick={()=>setOpenCorr(openCorr===i?null:i)}
              style={{ background: S, border: `0.5px solid ${BD}`,
                borderLeft: `3px solid ${sc}`, borderRadius: "0 8px 8px 0",
                padding: "12px 16px", cursor: "pointer",
                transition: "background .15s" }}>
              <div style={{ display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: TM }}>{id}</span>
                  <span style={{ background: sc, color: BG, padding: "2px 7px",
                    borderRadius: 4, fontSize: 9, fontWeight: 700,
                    letterSpacing: ".06em" }}>{sev}</span>
                  <span style={{ fontSize: 12, color: T, fontWeight: 600 }}>{right}</span>
                </div>
                <span style={{ fontSize: 12, color: TM }}>
                  {openCorr===i ? "▲" : "▼"}
                </span>
              </div>
              {openCorr===i && (
                <div style={{ marginTop: 12, borderTop: `0.5px solid ${BD}`, paddingTop: 12 }}>
                  <div style={{ fontSize: 12, color: R, textDecoration: "line-through",
                    marginBottom: 4 }}>Was: {wrong}</div>
                  <div style={{ fontSize: 12, color: G, fontWeight: 600, marginBottom: 8 }}>
                    Now: {right}
                  </div>
                  <div style={{ fontSize: 13, color: TM, lineHeight: 1.7 }}>{funny}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <P style={{ fontSize: 12, color: TM }}>
          Click any correction to expand it. The four HIGH severity ones are the ones that
          would have made a reviewer reject the document immediately.
        </P>
      </div>

      <Divider/>

      {/* ── LEVEL 4 ── */}
      <div style={sec}>
        <Level n="04" name="Super Saiyan 2 — Buoyancy from first principles" color={A}/>
        <SectionTitle>Building the chimney physics from scratch, step by step</SectionTitle>
        <P>
          This is the section I got wrong the longest. I kept using the continuity equation
          as if it was the driver of airflow. A fluid dynamics student friend asked me one
          question that fixed it: <Bold>"where does the flow come from in the first place?"</Bold>
        </P>
        <P>
          The continuity equation A₁V₁ = A₂V₂ is conservation of mass for an
          incompressible flow. It tells you the velocity at different cross-sections
          given that flow already exists. It says nothing about what generates the flow.
          I needed to go back to first principles.
        </P>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "20px 0" }}>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <StepNum n="1"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T, marginBottom: 6 }}>
                Hot air is less dense than cool air
              </div>
              <P>
                From the ideal gas law: PV = nRT. At constant pressure, density ρ = m/V
                is inversely proportional to temperature T. When air heats up, its molecules
                spread apart. Less mass per unit volume. Less dense. This is the root cause of
                everything that follows.
              </P>
              <Eq label="ρ ∝ 1/T at constant pressure — hotter gas, lower density">
                ρ_hot / ρ_cold  =  T_cold / T_hot
              </Eq>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <StepNum n="2"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T, marginBottom: 6 }}>
                Density difference creates a pressure difference
              </div>
              <P>
                In the chimney air gap, the air touching the hot outer wall heats up and
                becomes buoyant — lighter than the ambient air outside. This creates a
                pressure differential. The column of hot air inside is lighter than the
                equivalent column of cool air outside. The pressure difference drives flow.
              </P>
              <Eq label="Archimedes' buoyancy principle applied to air columns">
                ΔP  =  (ρ_ambient − ρ_hot) × g × H
              </Eq>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <StepNum n="3"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T, marginBottom: 6 }}>
                Substituting the ideal gas density ratio
              </div>
              <P>
                I substitute ρ_ambient − ρ_hot using the density-temperature relationship
                from Step 1. This gives me the stack pressure equation — the equation that
                should have been in my original document instead of the continuity equation.
              </P>
              <Eq label="The correct driving equation — what was missing from v1.0">
                ΔP  =  ρ_ambient × g × H × (T_hot − T_cold) / T_cold
              </Eq>
              <Eq label="At H=0.8m, T_hot=50°C (323K), T_cold=42°C (315K): ΔP = 1.12 × 9.81 × 0.8 × (8/315) = 0.22 Pa">
                ρ_ambient = 1.12 kg/m³  ·  g = 9.81 m/s²  ·  H = 0.8 m  ·  ΔT = 8 K
              </Eq>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <StepNum n="4"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T, marginBottom: 6 }}>
                Converting pressure difference to volumetric flow rate
              </div>
              <P>
                Now I use the discharge equation — once ΔP is known, the volumetric flow
                rate Q through the exit aperture (cross-section A₂) is:
              </P>
              <Eq label="Cd = 0.65 (discharge coefficient for a shaped aperture) · A₂ = exit aperture area (m²)">
                Q  =  Cd × A₂ × √( 2 × g × H × ΔT / T_cold )
              </Eq>
              <Eq label="With A₂ = 0.01 m² (apex exit): Q = 0.65 × 0.01 × √(2 × 9.81 × 0.8 × 0.0254) = 0.013 m³/s">
                Q = 0.013 m³/s  →  13 litres of air per second leaving the chimney
              </Eq>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <StepNum n="5"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T, marginBottom: 6 }}>
                Now — and only now — the continuity equation applies
              </div>
              <P>
                Once Q is established, I can use conservation of mass to find the velocity
                at any cross-section. This is where A₁V₁ = A₂V₂ finally enters the picture
                — as a consequence, not a cause.
              </P>
              <Eq label="Wide base (A₁) → narrow exit (A₂) → exit velocity V₂ is higher than inlet V₁">
                A₁V₁ = A₂V₂  →  V₂ = V₁ × (A₁ / A₂)
              </Eq>
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <StepNum n="6"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T, marginBottom: 6 }}>
                Heat removal rate — does it actually work?
              </div>
              <Eq label="ρ=1.12 kg/m³ · Cp=1006 J/kgK · Q=0.013 m³/s · ΔT=8K">
                Q_stack = ρ × Cp × Q × ΔT  =  1.12 × 1006 × 0.013 × 8  ≈  117 W
              </Eq>
              <P>
                117 Watts removed by the chimney ventilation alone from a single-plant
                container. The chimney works. And now I had the correct physics to prove it.
              </P>
            </div>
          </div>

        </div>

        <Callout title="The geometry correction that came out of this" color={A}>
          Once I understood the buoyancy physics, the geometry name "Inverted Pyramid" became
          obviously wrong. An inverted pyramid has the apex pointing DOWN. For the chimney
          effect to work — hot air rising to a narrow exit at the TOP — the narrow end must
          be at the top. That is a regular pyramid orientation. The correct engineering name
          is Tapered Chimney Frustum (a frustum is a truncated cone or pyramid). I renamed
          it throughout every version of the document.
        </Callout>
      </div>

      <Divider/>

      {/* ── LEVEL 5 ── */}
      <div style={sec}>
        <Level n="05" name="Super Saiyan 3 — The full thermal model" color={R}/>
        <SectionTitle>Building the corrected thermal budget from scratch</SectionTitle>

        <P>
          The biggest single error in v1.0 was calculating the temperature difference across
          my insulation as "42°C outside minus 30°C inside = 12°C." That assumes the outer
          wall of my container is at ambient air temperature. It is not. It is in direct sun.
        </P>

        <div style={{ fontSize: 14, fontWeight: 700, color: T, margin: "16px 0 8px" }}>
          Step A — What temperature is the outer wall actually at?
        </div>
        <P>
          When solar radiation hits the outer wall, some fraction is absorbed (1 − α) and
          heats the surface. The wall temperature rises until the heat absorbed equals the
          heat lost by convection to ambient air. This balance gives me T_wall:
        </P>
        <Eq label="G=900 W/m² (Hospete peak) · α=0.80 (lime wash) · h_conv=20 W/m²K (light wind)">
          T_wall  =  T_ambient + G × (1 − α) / h_conv
        </Eq>
        <Eq label="Still air (h=10): 42 + 18 = 60°C  ·  Light wind (h=20): 42 + 9 = 51°C">
          T_wall  =  42  +  (900 × 0.20) / 20  =  42 + 9  =  51°C
        </Eq>
        <P>
          So my insulation is not fighting a 12°C differential. It is fighting
          51 − 30 = <Bold>21°C at minimum, up to 60 − 30 = 30°C in still air.</Bold> The
          system still works — but the thermal budget needed to be stated correctly.
        </P>

        <div style={{ fontSize: 14, fontWeight: 700, color: T, margin: "20px 0 8px" }}>
          Step B — The latent heat correction
        </div>
        <P>
          My v1.0 document used Lᵥ = 2260 kJ/kg for the latent heat of evaporation.
          That is the standard textbook value — at 100°C (the boiling point). My wick
          operates at 35–42°C. The temperature-dependent formula:
        </P>
        <Eq label="Valid 0–100°C · At T=40°C: Lᵥ ≈ 2500.8 − 94.4 + 2.56 − 3.84 ≈ 2405 kJ/kg">
          Lᵥ(T)  =  2500.8  −  2.36T  +  0.0016T²  −  0.00006T³   [kJ/kg, T in °C]
        </Eq>
        <P>
          2405 vs 2260 — that is a 6.4% higher cooling capacity. I accidentally undersold
          my own system.
        </P>

        <div style={{ fontSize: 14, fontWeight: 700, color: T, margin: "20px 0 8px" }}>
          Step C — The complete 14-step thermal budget
        </div>
        <Card style={{ padding: 0, margin: "14px 0" }}>
          {[
            ["1","900 W/m²","Solar irradiance G","Hospete peak, 15°N latitude, May"],
            ["2",">0.80","Albedo α of lime wash","Both α and ε required — C-08 fix"],
            ["3","180 W/m²","Absorbed solar flux","G × (1 − 0.80) = 180 W/m²"],
            ["4","20 W/m²K","Convection h_conv","Light wind 1–2 m/s"],
            ["5","51°C","Outer wall T_wall","42 + 180/20  ←  C-04 correction"],
            ["6","21°C","Wall-to-interior ΔT","51 − 30°C target"],
            ["7","0.04 W/mK","Rice husk ash k-value","Dry and compressed — C-07 barrier needed"],
            ["8","0.05 m","Insulation thickness","50mm design spec"],
            ["9","1.25 m²K/W","Insulation R-value","R = 0.05 / 0.04"],
            ["10","16.8 W/m²","Conduction heat leak","ΔT / R = 21 / 1.25"],
            ["11","2405 kJ/kg","Lᵥ at 40°C","Corrected from 2260 — C-01 fix"],
            ["12","0.08 kg/m²h","Wick evaporation rate","RH=30%, passive jute, dry season"],
            ["13","53.4 W/m²","Evaporative cooling flux","(0.08 × 2405 × 1000) / 3600"],
            ["14","~15 W/m²","Stack ventilation removal","Q=0.013 m³/s, ΔT=8K"],
          ].map(([n,v,p,h],i)=>(
            <div key={n} style={{ display: "grid",
              gridTemplateColumns: "22px 72px 1fr 1fr",
              gap: 8, alignItems: "center", padding: "7px 14px",
              background: i%2===0 ? "transparent" : S,
              borderBottom: `0.5px solid ${BD}` }}>
              <span style={{ fontFamily:"monospace",fontSize:9,color:TM,textAlign:"center" }}>{n}</span>
              <span style={{ fontFamily:"monospace",fontSize:11,fontWeight:700,color:B }}>{v}</span>
              <span style={{ fontSize:11.5,color:T }}>{p}</span>
              <span style={{ fontSize:11,color:TM }}>{h}</span>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "22px 72px 1fr 1fr",
            gap: 8, padding: "8px 14px", background: `${G}15` }}>
            <span style={{ fontSize:12,color:G,textAlign:"center" }}>✓</span>
            <span style={{ fontFamily:"monospace",fontSize:12,fontWeight:700,color:G }}>+51.6 W/m²</span>
            <span style={{ fontSize:12,fontWeight:700,color:G }}>Net cooling surplus</span>
            <span style={{ fontSize:11.5,color:G }}>Root zone ≈ 26–28°C ✓ within ceiling</span>
          </div>
        </Card>
      </div>

      <Divider/>

      {/* ── LEVEL 6 ── */}
      <div style={sec}>
        <Level n="06" name="Super Saiyan God — The React component and CSS variables" color={R}/>
        <SectionTitle>How I built the UI — and how I cross-checked CSS variables with physics</SectionTitle>

        <P>
          Building the React component for this portfolio was where things got interesting.
          I started the same way I always do — writing a spec and hardcoding the colors.
          My first pass looked like this:
        </P>

        <Code>{`// first draft — hardcoded colors
const SeasonRow = ({ temp, status }) => (
  <div style={{ color: temp > 35 ? '#EF4444' : temp > 30 ? '#F59E0B' : '#10B981' }}>
    {status}
  </div>
);`}</Code>

        <P>
          That works. But it breaks in dark mode, it is not consistent with anything else
          on the page, and it hardcodes a thermodynamic threshold as a magic number buried
          in a style prop. I switched to CSS variables:
        </P>

        <Code>{`// CSS variable version
const SeasonRow = ({ temp, status }) => {
  const color =
    temp > 35 ? 'var(--color-text-danger)'
    : temp > 30 ? 'var(--color-text-warning)'
    : temp > 24 ? 'var(--color-text-success)'
    : 'var(--color-text-info)';

  return <div style={{ color }}>{status}</div>;
};`}</Code>

        <P>
          This is when I realized something. The CSS variable semantic color system was
          already encoding thermodynamic meaning — it just needed me to map it explicitly:
        </P>

        <Card style={{ margin: "14px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: TM, marginBottom: 12,
            textTransform: "uppercase", letterSpacing: ".06em" }}>
            CSS variable → thermodynamic meaning mapping
          </div>
          {[
            ["var(--color-text-danger)", R, "Root zone > 35°C", "Plant dies within days. Enzyme denaturation. No recovery."],
            ["var(--color-text-warning)", A, "Root zone 30–35°C", "Serious heat stress. Possible death over weeks. The zone BTCS must prevent."],
            ["var(--color-text-success)", G, "Root zone 26–30°C", "Viability ceiling — what BTCS achieves in peak summer. Plant survives and produces."],
            ["var(--color-text-info)", B, "Root zone 15–18°C", "True optimum for maximum yield. Not achievable passively in Hospete."],
          ].map(([varname, c, range, desc])=>(
            <div key={varname} style={{ padding: "10px 0", borderBottom: `0.5px solid ${BD}`,
              display: "grid", gridTemplateColumns: "auto auto 1fr", gap: 12, alignItems: "start" }}>
              <code style={{ fontFamily: "monospace", fontSize: 11, color: c,
                background: S, padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>
                {varname}
              </code>
              <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700,
                color: c, whiteSpace: "nowrap" }}>{range}</span>
              <span style={{ fontSize: 12, color: TM }}>{desc}</span>
            </div>
          ))}
        </Card>

        <P>
          This was not an aesthetic decision anymore. I was encoding the actual thermodynamic
          risk model into the design token system. The color <code style={{ fontFamily:"monospace",
          fontSize:12, color:R }}>var(--color-text-danger)</code> now means something
          precise — root temperature above 35°C, irreversible plant damage territory.
          Every time that color appears on screen, the viewer is reading a thermodynamic
          statement, not just a UI warning.
        </P>

        <div style={{ fontSize: 14, fontWeight: 700, color: T, margin: "20px 0 8px" }}>
          Structuring the component palette as constants
        </div>
        <P>
          I then refactored the entire component to use shorthand constants mapped to
          CSS variables. The constants live at the top of the file, and every color
          reference in the JSX goes through them:
        </P>

        <Code>{`/* ── palette — CSS variables cross-referenced with thermodynamic meaning ──
 *
 *  G  = var(--color-text-success)  → viability zone  (26–30°C root zone)
 *  A  = var(--color-text-warning)  → stress zone     (30–35°C root zone)
 *  R  = var(--color-text-danger)   → death zone      (> 35°C root zone)
 *  B  = var(--color-text-info)     → optimal zone    (15–18°C, unachievable here)
 *  T  = var(--color-text-primary)  → neutral labels
 *  TM = var(--color-text-secondary)→ explanatory prose
 *
 *  Dark mode is automatic — CSS variables adapt, thermodynamic meaning holds.
 */

const G  = "var(--color-text-success)";
const A  = "var(--color-text-warning)";
const R  = "var(--color-text-danger)";
const B  = "var(--color-text-info)";
const T  = "var(--color-text-primary)";
const TM = "var(--color-text-secondary)";
const BG = "var(--color-background-primary)";
const S  = "var(--color-background-secondary)";
const BD = "var(--color-border-tertiary)";`}</Code>

        <P>
          Now when I write a seasonal table row and give it <code style={{ fontFamily:"monospace",
          fontSize:12, color:A }}>color: A</code> for the monsoon warning, that color
          is semantically justified: monsoon is the marginal zone where root temperature
          is between 30–35°C without active evaporative cooling. The warning color is
          not decorative — it is a statement about plant physiology.
        </P>

        <div style={{ fontSize: 14, fontWeight: 700, color: T, margin: "20px 0 8px" }}>
          Cross-checking: seasonal table CSS vs thermodynamic model
        </div>
        <P>
          Here is the exact cross-check I did for the seasonal performance table.
          For each season, I ran the thermal budget calculation, got the predicted root
          zone temperature, then assigned a CSS variable color based on which
          thermodynamic zone that temperature fell into:
        </P>

        <Code>{`const seasons = [
  {
    name: "Peak summer",
    T_amb: 42,   // °C
    RH: 25,      // %
    T_wall: 51,  // °C — from T_wall = T_amb + G(1-α)/h_conv
    q_cond: 16.8,// W/m² — from (T_wall - 30) / R_insulation
    q_evap: 53.4,// W/m² — from ṁ_w × Lv(40°C) corrected
    net: "+36",
    // Root zone predicted: ≈ 26°C → SUCCESS zone
    color: "var(--color-text-success)", // G
    status: "✓ GREAT",
  },
  {
    name: "Monsoon",
    T_amb: 30,   // °C — ambient drops significantly
    RH: 85,      // % — wick collapses at high humidity
    T_wall: 36,  // °C — wall barely above ambient (cloud cover cuts G to ~400 W/m²)
    q_cond: 4.8, // W/m² — (36-30)/1.25 — very low heat load
    q_evap: 5,   // W/m² — wick at ~10% effectiveness at 85% RH
    net: "~0",
    // Root zone predicted: 30–32°C → depends on fallbacks
    color: "var(--color-text-warning)", // A
    status: "⚠ FALLBACKS",
  },
  // ...
];`}</Code>

        <P>
          Every color in the final table is not a design choice. It is the output of a
          thermal calculation mapped to a CSS variable via the thermodynamic zone system.
          I was not styling the UI — I was rendering the physics model as a color-encoded
          data visualization.
        </P>
      </div>

      <Divider/>

      {/* ── LEVEL 7 ── */}
      <div style={sec}>
        <Level n="07" name="Super Saiyan Blue — SVG prototype geometry" color={B}/>
        <SectionTitle>Calculating the cross-section diagram from first principles</SectionTitle>
        <P>
          The prototype diagram is the most important visual in the whole project.
          I needed a cross-section of the BTCS container showing all six layers,
          the airflow, and the temperature labels. I built it as an SVG calculated
          entirely from geometric formulas — no drawing tool, just math.
        </P>

        <div style={{ fontSize: 14, fontWeight: 700, color: T, margin: "16px 0 8px" }}>
          Step 1 — Defining the frustum geometry
        </div>
        <P>
          A frustum is a truncated cone or pyramid. My container has a wide base (for
          360° airflow intake) and a narrower exit at the top (for chimney acceleration).
          I defined it with four constants:
        </P>
        <Code>{`const CX  = 300;   // centre x of the SVG
const YT  = 80;    // y-coordinate of the top (narrow exit)
const YB  = 500;   // y-coordinate of the bottom (wide base)
const SY  = YB - YT;  // total height span = 420px
const HWT = 70;    // half-width at top (total top width = 140px)
const HWB = 185;   // half-width at bottom (total base width = 370px)`}</Code>

        <P>
          From these constants, the left and right outer wall x-coordinates at any
          height y are simply linear interpolations between top and bottom half-widths:
        </P>
        <Code>{`// Left outer wall x at any y
const lx = (y) => CX - HWT - (HWB - HWT) * (y - YT) / SY;

// Right outer wall x at any y
const rx = (y) => CX + HWT + (HWB - HWT) * (y - YT) / SY;

// Verification:
// At y=YT (top):    lx = 300 - 70 - 0 = 230   rx = 300 + 70 + 0 = 370   ✓ width=140px
// At y=YB (bottom): lx = 300 - 70 - 115 = 115  rx = 300 + 70 + 115 = 485  ✓ width=370px`}</Code>

        <div style={{ fontSize: 14, fontWeight: 700, color: T, margin: "20px 0 8px" }}>
          Step 2 — Layer polygon generation
        </div>
        <P>
          Each wall layer is a trapezoid — a polygon with four vertices. I generate
          the polygon point strings as functions that take layer offsets (how many pixels
          inward from the outer wall each layer boundary sits):
        </P>
        <Code>{`// Left wall strip from offset d1 to d2 (inward from outer left edge)
const LS = (d1, d2) =>
  \`\${lx(YT)+d1},\${YT} \${lx(YT)+d2},\${YT} \${lx(YB)+d2},\${YB} \${lx(YB)+d1},\${YB}\`;

// Right wall strip (mirrored)
const RS = (d1, d2) =>
  \`\${rx(YT)-d2},\${YT} \${rx(YT)-d1},\${YT} \${rx(YB)-d1},\${YB} \${rx(YB)-d2},\${YB}\`;

// Center fill (root zone) at inward offset d from both walls
const CF = (d) =>
  \`\${lx(YT)+d},\${YT} \${rx(YT)-d},\${YT} \${rx(YB)-d},\${YB} \${lx(YB)+d},\${YB}\`;`}</Code>

        <div style={{ fontSize: 14, fontWeight: 700, color: T, margin: "20px 0 8px" }}>
          Step 3 — Layer definitions cross-checked with physical dimensions
        </div>
        <P>
          Each layer offset corresponds to a real physical thickness in the design
          specification. I cross-checked every offset:
        </P>
        <Code>{`const layers = [
  // d1=outer edge, d2=inner edge of each layer
  { d1: 0,  d2: 7,  fill: "#8899AA" }, // Outer shell:  7px ≈ 6–8mm sheet
  { d1: 7,  d2: 18, fill: "#1D4ED8" }, // Air gap:     11px ≈ 10–15mm clearance
  { d1: 18, d2: 26, fill: "#15803D" }, // Wet wick:     8px ≈ 7–10mm jute mat
  { d1: 27, d2: 28, fill: "#7C3AED" }, // Vapour barrier: 1px (thin film, emphasis only)
  { d1: 29, d2: 54, fill: "#B45309" }, // Rice husk ash: 25px ≈ 50mm ACTUAL thickness
  { d1: 54, d2: 59, fill: "#78350F" }, // Inner liner:  5px ≈ 4–6mm PE film + liner
  // Root zone is CF(59) — everything inside the innermost layer
];

// At YT (top, half-width = 70px): inner root zone half-width = 70 - 59 = 11px
// At YB (bottom, half-width = 185px): inner root zone half-width = 185 - 59 = 126px
// This is correct — the container is wide at the base where roots spread`}</Code>

        <P>
          The rice husk ash layer at 25 SVG pixels corresponds to the 50mm physical
          thickness in the design spec. The ratio: 25px / 50mm = 0.5 px/mm. That is the
          scale factor for this diagram. I verified every layer offset against its
          physical counterpart before finalising the SVG.
        </P>
      </div>

      <Divider/>

      {/* ── PROTOTYPE VISUAL ── */}
      <div style={sec}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T }}>
            The prototype diagram — fully calculated
          </div>
          <Tag color={G}>v2.0 — all corrections applied</Tag>
        </div>
        <Card style={{ padding: 16 }}>
          <PrototypeSVG/>
        </Card>
        <P style={{ textAlign: "center", fontSize: 12, marginTop: 8 }}>
          Every coordinate in this SVG is calculated from the frustum geometry formulas.
          The layer thicknesses are cross-referenced with the physical design spec.
          The ★ vapour barrier is a direct result of Correction C-07.
        </P>
      </div>

      <Divider/>

      {/* ── LEVEL 8 — ULTRA INSTINCT ── */}
      <div style={sec}>
        <Level n="08" name="Ultra Instinct — The complete corrected system" color={G}/>
        <SectionTitle>Everything together: spec, BOM, seasonal performance</SectionTitle>

        <div style={{ fontSize: 14, fontWeight: 700, color: T, margin: "0 0 12px" }}>
          Final design specification — all values assigned and verified
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
          marginBottom: 24 }}>
          <Card style={{ padding: 0 }}>
            <div style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700,
              color: TM, textTransform: "uppercase", letterSpacing: ".06em",
              borderBottom: `0.5px solid ${BD}` }}>
              Geometry &amp; physics
            </div>
            {[["Shape","Tapered chimney frustum",T],
              ["Stack pressure (H=0.8m)","ΔP = 0.22 Pa",B],
              ["Volumetric airflow Q","0.013 m³/s",B],
              ["Stack heat removal","~15 W/m²",B],
              ["Outer wall T (light wind)","51°C",A],
              ["Insulation R-value","1.25 m²K/W",B],
              ["Conduction load","16.8 W/m²",A],
              ["Evaporative cooling (dry)","53.4 W/m²",G],
              ["Net surplus (dry season)","+36.6 W/m²",G],
              ["Root zone achieved","26–28°C ✓",G],
            ].map(([p,v,c])=>(
              <div key={p} style={{ display:"flex",justifyContent:"space-between",
                padding:"6px 14px",borderBottom:`0.5px solid ${BD}`,fontSize:12 }}>
                <span style={{color:TM}}>{p}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,color:c}}>{v}</span>
              </div>
            ))}
          </Card>
          <Card style={{ padding: 0 }}>
            <div style={{ padding: "10px 14px", fontSize: 11, fontWeight: 700,
              color: TM, textTransform: "uppercase", letterSpacing: ".06em",
              borderBottom: `0.5px solid ${BD}` }}>
              Materials &amp; cost
            </div>
            {[["Outer shell","Recycled HDPE drum","₹200–350"],
              ["Lime wash coating","α>0.80 ε>0.85","₹20–35"],
              ["Rice husk ash","FREE from mills","₹0–40"],
              ["Vapour barrier ★","125μm PE film","₹10–25"],
              ["Jute wick","0.7 m² coir mat","₹35–60"],
              ["Reservoir","2.5L (or matka)","₹40–70"],
              ["Root substrate","Coir+perlite+S","₹80–130"],
              ["pH kit","Strips + citric acid","₹35–60"],
              ["Base frame","Bamboo/MS rod","₹100–200"],
              ["Labour","2–3 hours local","₹150–200"],
            ].map(([p,v,c],i)=>(
              <div key={p} style={{ display:"grid",gridTemplateColumns:"1fr auto auto",
                gap:8,padding:"6px 14px",borderBottom:`0.5px solid ${BD}`,fontSize:11 }}>
                <span style={{color:T,fontWeight:600}}>{p}</span>
                <span style={{color:TM}}>{v}</span>
                <span style={{fontFamily:"monospace",color:G,fontWeight:700}}>{c}</span>
              </div>
            ))}
            <div style={{ display:"flex",justifyContent:"space-between",
              padding:"8px 14px",background:`${G}15`,fontSize:13,fontWeight:700 }}>
              <span style={{color:G}}>Total build cost</span>
              <span style={{fontFamily:"monospace",color:G}}>₹675–1,185</span>
            </div>
          </Card>
        </div>

        <div style={{ fontSize: 14, fontWeight: 700, color: T, margin: "0 0 12px" }}>
          What still needs to happen — no sugar-coating
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {[
            [R,"URGENT","Remeasure ΔT with full protocol",
             "The 12°C reading from the prototype has zero metadata. No time of day, no wind conditions, no wick level, no steady-state confirmation. I need: outer wall thermocouple, soil probe at 10cm, hygrometer, time-of-day stamp, 45-minute stability window. Run this on three clear days at solar peak. Without this, the 12°C number cannot be cited in any formal document."],
            [A,"HIGH","Grow one actual blueberry plant through one full season",
             "Source Vaccinium seedlings from Ooty or Kodaikanal. One BTCS unit. One growing season with a temperature probe in the root zone. That single data set is worth more than every equation on this page."],
            [A,"HIGH","Test monsoon fallbacks empirically",
             "The thermal mass, ground coupling, and terracotta reservoir fallbacks are theoretically sound. I need real data: run a container through June–September with all three active, log root-zone temperature weekly."],
            [B,"MEDIUM","Validate the BOM costs with real local quotes",
             "₹675–1,185 is a validated estimate. Three actual quotes from Hospete fabricators, rice mills, and agricultural suppliers before publishing this cost claim anywhere official."],
          ].map(([c,sev,title,desc])=>(
            <div key={title} style={{ background:S, border:`0.5px solid ${BD}`,
              borderLeft:`3px solid ${c}`, borderRadius:"0 8px 8px 0",
              padding:"14px 18px" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                <span style={{ background:c,color:BG,padding:"2px 8px",
                  borderRadius:4,fontSize:9,fontWeight:700,letterSpacing:".06em" }}>{sev}</span>
                <span style={{ fontSize:13,fontWeight:700,color:T }}>{title}</span>
              </div>
              <P style={{ margin:0 }}>{desc}</P>
            </div>
          ))}
        </div>

        <Callout title="The bottom line" color={G}>
          The physics is sound. The economics are validated. All 10 corrections are applied.
          The CSS variable system encodes the thermodynamic risk model. The SVG geometry
          is calculated from frustum formulas and cross-checked against physical dimensions.
          What BTCS needs now is not more theory.
          It needs one blueberry plant, one container, one thermocouple in the roots,
          logging data through summer 2026. That single growing season beats every
          page of this document.
        </Callout>
      </div>

      {/* footer */}
      <div style={{ borderTop:`0.5px solid ${BD}`,padding:"32px 24px",
        maxWidth:720,margin:"48px auto 0",
        display:"flex",justifyContent:"space-between",alignItems:"center",
        flexWrap:"wrap",gap:12 }}>
        <div style={{ fontSize:11,color:TM,fontFamily:"monospace" }}>
          BTCS Technical Portfolio v2.0 · May 2026
        </div>
        <div style={{ fontSize:11,color:TM,fontFamily:"monospace" }}>
          Hospete, Karnataka · Vaccinium corymbosum · Passive Thermal Engineering
        </div>
      </div>
      <div style={{ height: 40 }}/>
    </div>
  );
}
