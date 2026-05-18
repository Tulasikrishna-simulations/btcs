# 🫐 BTCS — Blueberry Thermal Container System

<div align="center">

**Engineering a Passive Micro-Climate for High-Value Crop Viability in Extreme Heat**

*Hospete, Karnataka, India · Vaccinium corymbosum · Passive Thermal Engineering*

---

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)
![Status](https://img.shields.io/badge/Status-v2.0%20All%20Corrections%20Applied-2E7D32?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Zero Electricity](https://img.shields.io/badge/Electricity-Zero%20Required-00C853?style=flat-square)
![Unit Cost](https://img.shields.io/badge/Unit%20Cost-₹675--1185-FF8F00?style=flat-square)

</div>

---

## What is BTCS?

BTCS is a **passive, zero-electricity container** that keeps blueberry root-zone temperature at **26–28°C** even when it is **42°C outside**, using only:

- 🪨 **Rice husk ash** (free from local mills) — thermal insulation
- 🪡 **Wet jute wick** — evaporative cooling
- 🌬️ **Air gap chimney** — stack-effect ventilation
- 🤍 **Lime wash coating** — solar reflection + nighttime radiative cooling

No fans. No compressors. No electricity bills. Total build cost: **₹675–1,185**.

This makes premium blueberry cultivation viable for small-scale farmers in Hospete, Karnataka — where summer temperatures regularly exceed 42°C and air-conditioned greenhouses are economically out of reach.

---

## System Performance

| Metric | Value | Condition |
|---|---|---|
| Ambient temperature | 42°C+ | Hospete summer peak |
| Root-zone maintained at | **26–28°C** | Active wick + chimney |
| ΔT achieved (passive) | **14–16°C** | Model prediction |
| ΔT measured (prototype) | 12°C | Hospete field test |
| Net cooling surplus | **+51.6 W/m²** | Peak summer, light wind |
| Unit build cost | **₹675–1,185** | Locally sourced |
| Retail target | ₹1,000–1,500 | Validated |
| Electricity required | **Zero** | Always |

---

## How It Works — Three Passive Mechanisms

```
                    ↑ hot air exits (A₂ — narrow apex)
                   /|\
                  / | \
                 /  |  \          ☀ 900 W/m²  (90% blocked)
    air gap →   /   |   \  ← outer shell (lime wash: α>0.80 ε>0.85)
    chimney     | ░░|░░ |  ← wet wick (jute): 53.4 W/m² cooling
    effect      | ▓▓|▓▓ |  ← vapour barrier (PE film) ← NEW in v2.0
                | ████  |  ← rice husk ash 50mm (R = 1.25 m²K/W)
                | ████  |  ← inner liner
                | 🌱🌱🌱|  ← root zone: 26–28°C ✓
                |_______|
                ↓       ↓
          cool air in (360° elevated base — A₁ wide base)
```

| Mechanism | What it does | Output |
|---|---|---|
| **Radiation control** | Lime wash reflects 80%+ of solar radiation | Rejects ~720 W/m² before it enters |
| **Evaporative wick** | Wet jute absorbs latent heat as water evaporates | Removes **53.4 W/m²** (dry season) |
| **Stack effect chimney** | Buoyant hot air rises and exits; cool air drawn in | Removes **~15 W/m²** continuously |
| **Rice husk ash insulation** | Blocks conducted heat (k = 0.04 W/mK) | R-value = **1.25 m²K/W** |

---

## The Physics — Correct Version

### 1. Stack Effect (what actually drives the airflow)

The **buoyancy equation** — not the continuity equation — drives airflow:

```
ΔP = ρ_ambient × g × H × (T_hot - T_cold) / T_cold
```

At H = 0.8m, ΔT = 8K → **ΔP = 0.22 Pa → Q = 0.013 m³/s → 117W removed**

> The continuity equation (A₁V₁ = A₂V₂) describes velocity *after* flow exists.  
> It does not cause flow. Buoyancy causes flow.

### 2. Evaporative Cooling (corrected latent heat)

```
Lv(T) = 2500.8 - 2.36T + 0.0016T² - 0.00006T³   [kJ/kg]
```

At T = 40°C → **Lv = 2405 kJ/kg** (not 2260 kJ/kg at 100°C — that was the v1.0 error)

```
q_evap = ṁ_w × Lv(T) = (0.08 × 2,405,000) / 3600 = 53.4 W/m²
```

### 3. Wall Temperature (the critical boundary condition)

```
T_wall = T_ambient + G × (1 - α) / h_conv
```

With G=900 W/m², α=0.80, h_conv=20 W/m²K → **T_wall = 51°C** (not 42°C ambient)  
Insulation ΔT = 51 - 30 = **21°C** (v1.0 incorrectly used 12°C)

---

## Ten Corrections from v1.0 → v2.0

| ID | Severity | What was wrong | What's correct |
|---|---|---|---|
| C-01 | Medium | Lv = 2260 kJ/kg (100°C value) | Lv = 2405 kJ/kg at 40°C |
| C-02 | **HIGH** | Continuity eq. drives airflow | Buoyancy (stack pressure) drives it |
| C-03 | **HIGH** | "Inverted Pyramid" geometry | Tapered Chimney Frustum |
| C-04 | **HIGH** | ΔT = 12°C (ambient to interior) | Wall = 51–60°C; ΔT across insulation = 21°C |
| C-05 | Medium | 12°C ΔT — no conditions documented | Needs full measurement protocol |
| C-06 | **HIGH** | No mention of monsoon season | Seasonal budget + 3 monsoon fallbacks |
| C-07 | Medium | Wet wick touching dry ash | Vapour barrier (PE film) between them |
| C-08 | Low | Only albedo α > 0.80 specified | Both α > 0.80 AND emittance ε > 0.85 |
| C-09 | Low | 26–30°C called the "target" temp | It's the viability *ceiling* (optimum = 15–18°C) |
| C-10 | Medium | pH mentioned; zero mechanism given | Full protocol: substrate + citric acid + pH strips |

---

## Repository Structure

```
btcs/
├── README.md                    ← you are here
├── requirements.txt             ← Python dependencies
├── .gitignore
│
├── src/
│   ├── thermal_model.py         ← core physics calculations (importable module)
│   ├── generate_pdf.py          ← generates the research paper PDF
│   └── portfolio/
│       └── BTCSPortfolio.jsx    ← interactive MIT maker portfolio (React)
│
├── calculations/
│   ├── thermal_budget.md        ← step-by-step thermal budget walkthrough
│   └── corrections_log.md      ← full documentation of all 10 corrections
│
├── docs/
│   └── (PDFs — add after generating with generate_pdf.py)
│
└── assets/
    └── notebook_sketch.jpg      ← original hand-drawn design sketch
```

---

## Quick Start

### Run the thermal model

```bash
git clone https://github.com/YOUR_USERNAME/btcs.git
cd btcs
pip install -r requirements.txt
python src/thermal_model.py
```

This prints the complete validated thermal budget for BTCS under peak summer conditions.

### Generate the research paper PDF

```bash
python src/generate_pdf.py
# Output: docs/BTCS_Research_Paper.pdf
```

### Use as a Python module

```python
from src.thermal_model import BTCSSystem

# Create a system instance
system = BTCSSystem(
    ambient_temp=42,      # °C — Hospete peak summer
    solar_irradiance=900, # W/m²
    albedo=0.80,
    insulation_k=0.04,    # W/mK — rice husk ash
    insulation_d=0.05,    # m — 50mm
    wick_evap_rate=0.08,  # kg/m²h
    humidity_rh=30,       # % — dry season
    chimney_height=0.8,   # m
)

result = system.calculate()
print(result.summary())
```

---

## Seasonal Performance

| Season | Outside | RH | Wall temp | Net margin | Status |
|---|---|---|---|---|---|
| Peak summer (Apr–May) | 42°C | 25% | 51–60°C | **+36 W/m²** | ✅ Viable |
| Pre-monsoon (May–Jun) | 38°C | 55% | 48°C | **+10 W/m²** | ✅ Viable |
| Monsoon (Jun–Sep) | 30°C | 85% | 36°C | ~0 | ⚠️ Fallbacks used |
| Winter (Nov–Feb) | 24°C | 45% | 30°C | **+28 W/m²** | ✅ Excellent |

**Monsoon fallbacks (3 passive, zero extra cost):**
1. **Thermal mass** — 5kg substrate stores 18 kJ/K; takes 3+ hours to rise 1°C
2. **Ground coupling** — Hospete ground at 30cm: 23–26°C → passive heat sink
3. **Terracotta reservoir** — Clay sweats via capillary pressure; not stopped by high humidity

---

## Bill of Materials

| Component | Material | Cost (₹) |
|---|---|---|
| Outer shell | Recycled HDPE drum or GI sheet | 200–350 |
| Lime wash coating | Agricultural lime wash + white cement | 20–35 |
| **Rice husk ash** | **FREE from local rice mills** | **0–40** |
| Vapour barrier | Recycled PE film (125μm) | 10–25 |
| Jute wick | Jute cloth or coir mat | 35–60 |
| Water reservoir | HDPE bottle or terracotta pot | 40–70 |
| Root substrate | Coir + perlite + sulfur compost | 80–130 |
| pH kit | pH strips + citric acid | 35–60 |
| Root liner | Food-grade PE bag | 5–15 |
| Base frame | Bamboo or MS rod | 100–200 |
| Assembly labour | Local fabricator (2–3 hours) | 150–200 |
| **Total** | **All locally sourced in Hospete** | **₹675–1,185** |

> 💡 Rice husk ash is the key cost innovation — it's agricultural waste available free from every rice mill in Karnataka. Commercial insulation foam for the same volume costs ₹200–400.

---

## pH Management

Blueberries require **pH 4.5–5.5** (strongly acidic). Most Karnataka soils are pH 6.5–8.0.  
Rice husk ash leaches **pH 8–10** when wet — the vapour barrier (C-07) also isolates this.

**Simple three-step protocol:**
1. **Substrate**: 60% coir pith + 30% perlite + 10% sulfur compost → pH 4.8–5.2 naturally
2. **Irrigation**: 1–2ml food-grade citric acid per litre of water
3. **Monitor**: pH strip every 2 weeks (₹2 per strip)

---

## What's Next

- [ ] **URGENT** — Re-measure ΔT with full protocol: wall thermocouple + soil probe + hygrometer + time logged
- [ ] **HIGH** — Test monsoon fallbacks through June–September
- [ ] **HIGH** — Grow one Vaccinium plant through one full season in Hospete
- [ ] **HIGH** — Confirm ground temperature at 30cm depth through monsoon
- [ ] **MEDIUM** — Get 3 actual supplier quotes for BOM cost validation

**Digital farm roadmap:**
- Phase 1 (now): Physical container + manual pH + manual refill
- Phase 2: ₹300 soil temp probe + ₹200 hygrometer → Bluetooth to phone
- Phase 3: pH electrode + moisture sensor + microcontroller alerts
- Phase 4: Multi-farm network, AI predictions, SMS alerts

---

## Design Origin

This project began with a hand-drawn sketch in a notebook. The sketch — included in the research paper as Figure 1 — correctly identified the buoyancy formula, the tapered frustum geometry, and the airflow direction before any formal analysis was done.

The formal document (v1.0) then introduced 10 errors while formalising the intuition. The corrections process was as valuable as the original design.

---

## Documents

| Document | Description |
|---|---|
| [thermal_model.py](thermal_model.py) | Core physics calculation module — run it directly |
| [corrections_log.md](corrections_log.md) | All 10 corrections fully documented |
| [thermal_budget.md](thermal_budget.md) | 15-step thermal budget walkthrough |
| [ETPT Framework](https://tulasikrishna-simulations.github.io/etpt-portfolio) | The parent theory behind BTCS |

## License

GPL-3.0 — see [LICENSE](LICENSE)

---

<div align="center">

**Hospete, Karnataka, India · May 2026**  
*Passive thermal engineering for agricultural resilience*

*"The purpose of engineering is not to demonstrate what we know, but to use what we know in service of what we need."*

</div>
