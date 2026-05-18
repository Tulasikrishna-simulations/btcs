# BTCS Corrections Log — v1.0 → v2.0

All ten technical errors identified in the original BTCS design brief,
with complete documentation of what was wrong, what is correct, and why it matters.

---

## C-01 · Latent Heat Value — Medium Severity

**Original (v1.0):** `Lv ≈ 2260 kJ/kg`  
**Corrected (v2.0):** `Lv ≈ 2405 kJ/kg at 40°C operating temperature`

**What was wrong:**  
The latent heat of vaporisation (Lv) is the energy absorbed per kilogram of water
that evaporates. The standard textbook reference value is 2260 kJ/kg — but this is
the value at **100°C (the boiling point)**. The BTCS wick operates at ambient
temperature (~35–42°C), where the correct value is approximately 2405 kJ/kg.

**Formula:**  
`Lv(T) = 2500.8 - 2.36T + 0.0016T² - 0.00006T³   [kJ/kg, T in °C]`  
At T = 40°C: `Lv = 2500.8 - 94.4 + 2.56 - 3.84 ≈ 2405 kJ/kg`

**Impact:**  
The correction makes the system look *better* — 6.4% more cooling capacity than
v1.0 stated. The system was inadvertently underselling itself.

---

## C-02 · Equation Driving Airflow — High Severity

**Original (v1.0):** "The continuity equation A₁V₁ = A₂V₂ drives airflow"  
**Corrected (v2.0):** "Buoyancy (stack pressure) drives airflow; continuity equation is a consequence"

**What was wrong:**  
The continuity equation is conservation of mass for an incompressible flow.
It tells you the velocity at different cross-sections **of an already-existing flow**.
It cannot initiate flow — it has no driving force.

A helpful analogy: a speedometer shows how fast a car is going. It does not make
the car move. Similarly, the continuity equation describes velocity but does not
cause flow.

**The correct driver — buoyancy (stack effect):**  
```
ΔP = ρ_ambient × g × H × (T_hot - T_cold) / T_cold
```

Hot air in the chimney gap is less dense than ambient air (ideal gas law: ρ ∝ 1/T).
This density difference creates a pressure difference. The pressure difference drives
airflow upward through the chimney. Only then does the continuity equation apply,
to describe how velocity changes as cross-section area changes.

**Impact:**  
Without the buoyancy equation, the system had no physical driver documented.
This was the most fundamental physics error in v1.0.

---

## C-03 · Geometry Name — High Severity

**Original (v1.0):** "Inverted Pyramid Airflow System"  
**Corrected (v2.0):** "Tapered Chimney Frustum"

**What was wrong:**  
In an inverted pyramid, the apex (the pointed end) is at the **bottom**.
But the described system has:
- Wide base at the **bottom** (for air intake)
- Narrow exit at the **top** (for hot air exhaust)

This is the geometry of a **regular pyramid** (or more precisely, a frustum —
a pyramid with the top cut off). Calling it "inverted" describes the opposite
of what was built.

**The correct name:**  
Tapered Chimney Frustum. Wide inlet at the bottom (A₁). Narrow exhaust at the top (A₂).
Hot air rises and exits at A₂. Cooler ambient air is drawn in at A₁.

**Impact:**  
Any engineer reading the v1.0 name would visualise the opposite geometry.
This is a credibility issue in any formal review.

---

## C-04 · Thermal Boundary Condition — High Severity

**Original (v1.0):** "ΔT = 42°C ambient - 30°C interior = 12°C across insulation"  
**Corrected (v2.0):** "Wall reaches 51–60°C in direct sun; insulation ΔT = 21–30°C"

**What was wrong:**  
The v1.0 calculation assumed the outer wall of the container is at ambient air
temperature (42°C). In reality, the wall is exposed to direct solar radiation
and heats to a temperature well above ambient.

Consider: touch the metal roof of a car parked in the sun on a 40°C day.
It is ~65°C — not 40°C. The air is 40°C but the surface in direct sun is much hotter.

**Corrected formula:**  
```
T_wall = T_ambient + G × (1 - α) / h_conv
```
- G = 900 W/m², α = 0.80, h_conv = 20 W/m²K (light wind)
- T_wall = 42 + (900 × 0.20) / 20 = 42 + 9 = **51°C**
- In still air (h = 10): T_wall = **60°C**

**Impact:**  
The insulation works against 21–30°C differential, not 12°C. The system still
performs well (net surplus of +51.6 W/m²), but the thermal budget needed
to be stated correctly. The 12°C prototype measurement was ambient-to-interior
(a different quantity from wall-to-interior).

---

## C-05 · Measurement Conditions — Medium Severity

**Original (v1.0):** "ΔT ≈ 12°C achieved passively" (no conditions documented)  
**Corrected (v2.0):** "14–16°C predicted; 12°C prototype needs full measurement protocol"

**What was missing:**  
The 12°C reading from the prototype had no associated:
- Time of day (solar irradiance varies from ~200 W/m² at 8am to 900 W/m² at noon)
- Wind conditions (determines T_wall)
- Wick water level (partial depletion reduces evaporation rate)
- Whether reading was at steady state (45+ min stable)
- Whether it was root-zone soil temp or interior air temp

**Required measurement protocol for future tests:**

| Measurement | Instrument | Why |
|---|---|---|
| Time of day | Phone clock | Allows calculation of approximate G |
| Ambient air temperature | Thermometer in shade | Baseline reference |
| Outer wall temperature | Infrared thermometer | Actual thermal boundary |
| Root-zone soil temperature | Soil probe at 10cm | Primary performance metric |
| Relative humidity | Digital hygrometer | Controls wick rate |
| Wind conditions | Beaufort scale | Determines h_conv |
| Reservoir water level | Visual mark | Partial depletion → lower wick |
| Steady state | 5-min readings for 45min | Confirms equilibrium |

---

## C-06 · Monsoon Season Missing — High Severity

**Original (v1.0):** No mention of monsoon season  
**Corrected (v2.0):** Full four-season analysis; three monsoon fallbacks specified

**What was wrong:**  
Hospete has a four-month monsoon season (June–September) when relative humidity
regularly exceeds 80–85%. At this humidity, jute wick evaporation drops by ~90%.
The v1.0 document did not acknowledge this season existed.

**Why it's not actually a failure:**  
The same weather that collapses the wick also dramatically reduces the thermal load:
- Cloud cover reduces G from 900 to ~400 W/m²
- Ambient temperature drops from 42°C to ~30°C
- Wall temperature drops to ~36°C (barely above ambient)
- Conduction load drops from 17 W/m² to ~5 W/m²

Three passive fallbacks handle the remaining load:
1. **Thermal mass** — 5kg substrate stores ~18 kJ/K; takes 3+ hours to rise 1°C
2. **Ground coupling** — Ground at 30cm: 23–26°C → passive heat sink (place on soil, not concrete)
3. **Terracotta reservoir** — Clay sweats by capillary pressure (not stopped by high RH)

---

## C-07 · Moisture Ingress into Insulation — Medium Severity

**Original (v1.0):** Wet wick layer placed directly against rice husk ash  
**Corrected (v2.0):** Vapour barrier (125μm PE film) between wick and ash

**What was wrong:**  
Rice husk ash has excellent thermal insulation properties when dry (k = 0.04 W/mK).
When it absorbs moisture, k rises to 0.10–0.15 W/mK — effectively tripling the
heat leak through the insulation layer.

In the v1.0 design, the wet jute wick was placed directly adjacent to the ash.
Over time, moisture would have migrated from the wick into the ash, progressively
degrading insulation performance.

**Fix:**  
A thin polyethylene film (125μm minimum, available as recycled packaging) placed
between the wick and ash layers prevents moisture ingress while adding negligible
thickness and cost (~₹10–25).

**Bonus:**  
The same vapour barrier also physically isolates the rice husk ash alkaline leachate
(pH 8–10) from the root substrate — preventing the pH damage described in C-10.
One component, two problems solved.

---

## C-08 · Incomplete Coating Specification — Low Severity

**Original (v1.0):** "High-albedo coating (α > 0.80)"  
**Corrected (v2.0):** "Solar reflectance α > 0.80 AND thermal emittance ε > 0.85"

**What was wrong:**  
Solar reflectance (albedo, α) governs how much sunlight the surface reflects during
the day. But thermal emittance (ε) governs how much heat the surface radiates away
as infrared at night.

A surface with high α but low ε (e.g. polished aluminium: α=0.85, ε=0.05)
reflects sunlight well but traps heat after sunset — acting like a thermos.

**The correct spec:**  
- Solar reflectance α > 0.80 (300–2500nm)
- Thermal emittance ε > 0.85 (8–14μm longwave)

**Recommended material:**  
Agricultural lime wash (α > 0.82, ε > 0.90) — available at any hardware shop, ~₹25.

---

## C-09 · Framing of Temperature Target — Low Severity

**Original (v1.0):** "Target root-zone temperature: 26–30°C"  
**Corrected (v2.0):** "26–30°C is the thermal viability ceiling; true optimum is 15–18°C"

**What was wrong:**  
The v1.0 brief described 26–30°C as the design "target" for blueberry cultivation.
In Vaccinium physiology, the true optimum for maximum yield and fruit quality
is 15–18°C. At 26–30°C, the plant survives and produces fruit, but yield and
anthocyanin accumulation are below optimum.

26–30°C is more accurately the **thermal viability ceiling** — the upper boundary
below which the plant does not die. Like saying 38°C is a "target" body temperature
when it is actually a mild fever.

**Why honest framing matters:**  
Overstating the capability creates credibility issues with reviewers who know
blueberry physiology. The honest framing is actually more compelling:
"BTCS is the difference between ZERO crop and a VIABLE crop." That is a
strong agricultural and economic argument even without claiming optimality.

---

## C-10 · pH Management Missing — Medium Severity

**Original (v1.0):** "pH stability: critical variable" [no mechanism provided]  
**Corrected (v2.0):** Full substrate protocol + citric acid irrigation + pH monitoring + ash hazard flagged

**What was wrong:**  
The brief correctly identified pH as a critical variable but provided zero
mechanism for achieving or maintaining it. Additionally, it did not flag that
rice husk ash (the primary insulation material) produces an alkaline leachate
(pH 8–10) when wet — directly harmful to blueberry roots if not isolated.

**Blueberry pH requirement:**  
*Vaccinium corymbosum* requires strongly acidic root media: **pH 4.5–5.5**.
Most Karnataka soils are pH 6.5–8.0. At higher pH, the plant cannot absorb
iron and manganese even when those minerals are physically present.
The resulting chlorosis (leaf yellowing) can be misidentified as heat stress.

**Three-step protocol:**

1. **Substrate:** 60% aged coir pith + 30% perlite + 10% sulfur-amended compost  
   → Thiobacillus bacteria convert sulfur to mild acid over 4–6 weeks → pH 4.8–5.2

2. **Irrigation:** 1–2ml food-grade citric acid per litre of water  
   → Maintains water at pH 5.5–6.0 → prevents alkaline drift (~₹30 per sachet)

3. **Monitoring:** pH strip every 2 weeks (~₹2 per strip)  
   → If pH > 6.0, increase citric acid dose; if < 4.5, reduce

**The rice husk ash hazard:**  
Wet ash leachate pH 8–10 → would kill roots if contacted.  
The vapour barrier (C-07) also blocks this leachate. Both problems solved simultaneously.

---

## Correction Summary

| ID | Severity | Category | Status |
|---|---|---|---|
| C-01 | Medium | Equation value | ✓ Fixed — 2260→2405 kJ/kg |
| C-02 | **High** | Physics framework | ✓ Fixed — buoyancy equation added |
| C-03 | **High** | Geometry naming | ✓ Fixed — "Tapered Chimney Frustum" |
| C-04 | **High** | Thermal boundary | ✓ Fixed — wall temp 51–60°C, not 42°C |
| C-05 | Medium | Measurement protocol | ✓ Fixed — full protocol documented |
| C-06 | **High** | Seasonal analysis | ✓ Fixed — 4-season budget + 3 fallbacks |
| C-07 | Medium | Material interaction | ✓ Fixed — vapour barrier added |
| C-08 | Low | Coating specification | ✓ Fixed — both α and ε specified |
| C-09 | Low | Performance framing | ✓ Fixed — viability ceiling vs. optimum |
| C-10 | Medium | pH mechanism | ✓ Fixed — full protocol added |
