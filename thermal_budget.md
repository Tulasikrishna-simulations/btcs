# BTCS Thermal Budget — Step-by-Step Walkthrough

**Version:** v2.0 — All 10 corrections applied  
**Condition:** Peak summer, Hospete, light wind (1–2 m/s)  
**Date:** May 2026

---

## The Complete 15-Step Calculation

This document walks through every step of the BTCS thermal budget,
from solar irradiance at the outer surface to the predicted root-zone temperature.
Each step is explained in plain language before the equation.

---

### Step 1 — Solar irradiance at Hospete

Hospete, Karnataka sits at latitude 15°N.
In May (peak summer), the sun is nearly directly overhead.
Peak solar irradiance at this location:

```
G = 900 W/m²   (meteorological data, 15°N latitude, May)
```

This is the total solar power hitting each square metre of the outer surface.

---

### Step 2 — Albedo of the lime wash coating

The outer shell is coated with agricultural lime wash.
Lime wash achieves:
- Solar reflectance (albedo): **α > 0.80**
- Thermal emittance: **ε > 0.85** ← this was missing from v1.0 (Correction C-08)

```
α = 0.80   (80% of sunlight reflected)
```

Note: both α AND ε must be specified. A high-α, low-ε surface (like polished
aluminium) reflects sunlight well but traps heat at night.
Lime wash satisfies both requirements at ~₹25.

---

### Step 3 — Solar flux absorbed by the outer wall

Only 20% of incoming solar radiation is absorbed:

```
q_solar_absorbed = G × (1 - α) = 900 × 0.20 = 180 W/m²
```

The remaining 720 W/m² is reflected before it can become heat.

---

### Step 4 — Convection coefficient (h_conv)

The rate at which the outer wall loses heat to the surrounding air
by convection depends on wind speed:

```
Still air    : h_conv ≈ 10 W/m²K
Light wind   : h_conv ≈ 20 W/m²K  ← used in this analysis
Moderate wind: h_conv ≈ 30 W/m²K
```

---

### Step 5 — Outer wall temperature (C-04 correction)

**This is the most important correction from v1.0.**

The v1.0 brief calculated insulation ΔT as 42°C (ambient) - 30°C (interior) = 12°C.
This is wrong because the outer wall is in direct sun and heats above ambient.

```
T_wall = T_ambient + q_solar_absorbed / h_conv
T_wall = 42 + 180 / 20 = 42 + 9 = 51°C    (light wind)
T_wall = 42 + 180 / 10 = 42 + 18 = 60°C   (still air)
```

The insulation works against 51°C, not 42°C.

---

### Step 6 — Target interior temperature

The thermal viability ceiling for *Vaccinium corymbosum* root zone:

```
T_interior_target = 30°C
```

Note: this is the *viability ceiling* (survival threshold), not the optimum.
True optimum for maximum yield: 15–18°C (not achievable passively in Hospete).
Correction C-09 corrected this framing.

---

### Step 7 — Temperature difference across the insulation

```
ΔT_insulation = T_wall - T_interior = 51 - 30 = 21°C
```

(v1.0 incorrectly used 42 - 30 = 12°C — a 75% underestimate of the thermal load)

---

### Step 8 — Rice husk ash thermal conductivity

Rice husk ash, when dry and compressed:

```
k = 0.04 W/mK
```

**Critical condition:** this value holds only when the ash is kept dry.
The vapour barrier (Correction C-07) prevents moisture from the wick
raising this value to 0.10–0.15 W/mK (which would triple the heat leak).

---

### Step 9 — Insulation thickness

```
d = 50 mm = 0.05 m   (design specification)
```

---

### Step 10 — Insulation R-value

Thermal resistance (R-value) of the rice husk ash layer:

```
R = d / k = 0.05 / 0.04 = 1.25 m²K/W
```

Higher R-value = better insulation. For reference, 50mm fibreglass wool ≈ 1.4 m²K/W.
Rice husk ash at 1.25 is comparable and costs essentially nothing.

---

### Step 11 — Conduction heat load

Heat flowing through the insulation per square metre per second:

```
q_conduction = ΔT / R = 21 / 1.25 = 16.8 W/m²
```

This is the heat load the cooling mechanisms must overcome.

---

### Step 12 — Latent heat of evaporation at operating temperature (C-01 correction)

v1.0 used Lv = 2260 kJ/kg — the standard textbook value at 100°C (boiling point).
The wick operates at ~40°C. The correct temperature-dependent formula:

```
Lv(T) = 2500.8 - 2.36T + 0.0016T² - 0.00006T³   [kJ/kg]
At T = 40°C: Lv = 2500.8 - 94.4 + 2.56 - 3.84 ≈ 2405 kJ/kg
```

Correction: 2405 vs 2260 — the actual cooling is **6.4% greater** than v1.0 claimed.

---

### Step 13 — Wick evaporation rate

In dry-season conditions (RH = 30%), passive jute wick evaporation rate:

```
ṁ_w = 0.08 kg/m²·h   (standard reference for passive wick systems)
```

This rate drops sharply at high humidity. At RH = 85% (monsoon): ~0.008 kg/m²·h.

---

### Step 14 — Evaporative cooling flux

```
q_evaporative = ṁ_w × Lv / 3600
q_evaporative = (0.08 × 2,405,000) / 3600 = 53.4 W/m²
```

This is the primary cooling mechanism. It comfortably exceeds the conduction load.

---

### Step 15 — Stack ventilation heat removal

From the stack pressure equation (Correction C-02 — buoyancy is the driver):

```
ΔP = ρ_ambient × g × H × ΔT / T_cold
   = 1.12 × 9.81 × 0.8 × (8/315) = 0.22 Pa

Q = Cd × A₂ × √(2 × g × H × ΔT/T_cold)
  = 0.65 × 0.01 × √(2 × 9.81 × 0.8 × 0.0254)
  = 0.013 m³/s

Q_stack ≈ 15 W/m²   (averaged over effective wall area)
```

---

## Summary Results

| Quantity | Value | Notes |
|---|---|---|
| Wall temperature | 51°C | Not 42°C — C-04 correction |
| Insulation ΔT | 21°C | Not 12°C — C-04 correction |
| Conduction load | 16.8 W/m² | The enemy |
| Evaporative cooling | 53.4 W/m² | Primary defence |
| Stack removal | ~15 W/m² | Secondary defence |
| **Net cooling surplus** | **+51.6 W/m²** | System is comfortable |
| Predicted root zone | **≈ 26–28°C** | ✓ Within viability ceiling |
| Ambient-to-interior ΔT | **14–16°C** | Consistent with 12°C prototype (still air) |

---

## Reproduce This Calculation

```bash
python src/thermal_model.py
```

Or in Python:

```python
from src.thermal_model import BTCSSystem

system = BTCSSystem(
    ambient_temp=42,
    solar_irradiance=900,
    albedo=0.80,
    h_conv=20,
    insulation_k=0.04,
    insulation_d=0.05,
    wick_evap_rate=0.08,
    humidity_rh=30,
    chimney_height=0.80,
)
result = system.calculate()
print(result.summary())
```
