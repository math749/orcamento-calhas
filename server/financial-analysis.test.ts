import { describe, expect, it } from "vitest";

/**
 * Financial Analysis Calculation Tests
 * 
 * Order of calculation:
 * 1. Service Value (initial)
 * 2. - Material Cost
 * 3. - GCALHAS (30% of remaining)
 * 4. - Car (30% of remaining)
 * 5. - Nildo Mão de Obra (27% of remaining)
 * 6. - Matheus Mão de Obra (25% of remaining)
 * 7. = Company Cashbox (remaining)
 */

function calculateFinancialBreakdown(
  totalValue: number,
  materialCost: number
) {
  // Step 1: Service value
  let remaining = totalValue;

  // Step 2: Deduct material cost
  const material = materialCost;
  remaining -= material;

  // Step 3: 30% GCALHAS
  const gcalhas = remaining * 0.3;
  remaining -= gcalhas;

  // Step 4: 30% Car
  const car = remaining * 0.3;
  remaining -= car;

  // Step 5: 27% Nildo (Mão de obra)
  const nildo = remaining * 0.27;
  remaining -= nildo;

  // Step 6: 25% Matheus (Mão de obra)
  const matheus = remaining * 0.25;
  remaining -= matheus;

  // Step 7: Company cashbox (remaining)
  const cashbox = remaining;

  return {
    material,
    gcalhas,
    car,
    nildo,
    matheus,
    cashbox,
    totalValue,
  };
}

describe("Financial Analysis", () => {
  it("should calculate financial breakdown correctly with R$ 1000", () => {
    const breakdown = calculateFinancialBreakdown(1000, 200);

    expect(breakdown.totalValue).toBe(1000);
    expect(breakdown.material).toBe(200);

    // After material: 1000 - 200 = 800
    // GCALHAS 30%: 800 * 0.3 = 240
    expect(breakdown.gcalhas).toBe(240);

    // After GCALHAS: 800 - 240 = 560
    // Car 30%: 560 * 0.3 = 168
    expect(breakdown.car).toBe(168);

    // After Car: 560 - 168 = 392
    // Nildo 27%: 392 * 0.27 = 105.84
    expect(breakdown.nildo).toBeCloseTo(105.84, 2);

    // After Nildo: 392 - 105.84 = 286.16
    // Matheus 25%: 286.16 * 0.25 = 71.54
    expect(breakdown.matheus).toBeCloseTo(71.54, 2);

    // Cashbox: 286.16 - 71.54 = 214.62
    expect(breakdown.cashbox).toBeCloseTo(214.62, 2);
  });

  it("should calculate financial breakdown correctly with R$ 5000", () => {
    const breakdown = calculateFinancialBreakdown(5000, 1000);

    expect(breakdown.totalValue).toBe(5000);
    expect(breakdown.material).toBe(1000);

    // After material: 5000 - 1000 = 4000
    // GCALHAS 30%: 4000 * 0.3 = 1200
    expect(breakdown.gcalhas).toBe(1200);

    // After GCALHAS: 4000 - 1200 = 2800
    // Car 30%: 2800 * 0.3 = 840
    expect(breakdown.car).toBe(840);

    // After Car: 2800 - 840 = 1960
    // Nildo 27%: 1960 * 0.27 = 529.2
    expect(breakdown.nildo).toBeCloseTo(529.2, 2);

    // After Nildo: 1960 - 529.2 = 1430.8
    // Matheus 25%: 1430.8 * 0.25 = 357.7
    expect(breakdown.matheus).toBeCloseTo(357.7, 2);

    // Cashbox: 1430.8 - 357.7 = 1073.1
    expect(breakdown.cashbox).toBeCloseTo(1073.1, 2);
  });

  it("should calculate financial breakdown correctly with R$ 500", () => {
    const breakdown = calculateFinancialBreakdown(500, 100);

    expect(breakdown.totalValue).toBe(500);
    expect(breakdown.material).toBe(100);

    // After material: 500 - 100 = 400
    // GCALHAS 30%: 400 * 0.3 = 120
    expect(breakdown.gcalhas).toBe(120);

    // After GCALHAS: 400 - 120 = 280
    // Car 30%: 280 * 0.3 = 84
    expect(breakdown.car).toBe(84);

    // After Car: 280 - 84 = 196
    // Nildo 27%: 196 * 0.27 = 52.92
    expect(breakdown.nildo).toBeCloseTo(52.92, 2);

    // After Nildo: 196 - 52.92 = 143.08
    // Matheus 25%: 143.08 * 0.25 = 35.77
    expect(breakdown.matheus).toBeCloseTo(35.77, 2);

    // Cashbox: 143.08 - 35.77 = 107.31
    expect(breakdown.cashbox).toBeCloseTo(107.31, 2);
  });

  it("should handle zero material cost", () => {
    const breakdown = calculateFinancialBreakdown(1000, 0);

    expect(breakdown.material).toBe(0);

    // After material: 1000 - 0 = 1000
    // GCALHAS 30%: 1000 * 0.3 = 300
    expect(breakdown.gcalhas).toBe(300);

    // After GCALHAS: 1000 - 300 = 700
    // Car 30%: 700 * 0.3 = 210
    expect(breakdown.car).toBe(210);

    // After Car: 700 - 210 = 490
    // Nildo 27%: 490 * 0.27 = 132.3
    expect(breakdown.nildo).toBeCloseTo(132.3, 2);

    // After Nildo: 490 - 132.3 = 357.7
    // Matheus 25%: 357.7 * 0.25 = 89.425
    expect(breakdown.matheus).toBeCloseTo(89.425, 2);

    // Cashbox: 357.7 - 89.425 = 268.275
    expect(breakdown.cashbox).toBeCloseTo(268.275, 2);
  });

  it("should sum all components equal to total value", () => {
    const breakdown = calculateFinancialBreakdown(1000, 200);

    const total =
      breakdown.material +
      breakdown.gcalhas +
      breakdown.car +
      breakdown.nildo +
      breakdown.matheus +
      breakdown.cashbox;

    expect(total).toBeCloseTo(breakdown.totalValue, 2);
  });

  it("should calculate percentages correctly", () => {
    const breakdown = calculateFinancialBreakdown(1000, 200);

    const materialPercentage = (breakdown.material / breakdown.totalValue) * 100;
    const gcalhasPercentage =
      (breakdown.gcalhas / breakdown.totalValue) * 100;
    const carPercentage = (breakdown.car / breakdown.totalValue) * 100;
    const nildoPercentage = (breakdown.nildo / breakdown.totalValue) * 100;
    const matheusPercentage =
      (breakdown.matheus / breakdown.totalValue) * 100;
    const cashboxPercentage =
      (breakdown.cashbox / breakdown.totalValue) * 100;

    const totalPercentage =
      materialPercentage +
      gcalhasPercentage +
      carPercentage +
      nildoPercentage +
      matheusPercentage +
      cashboxPercentage;

    expect(totalPercentage).toBeCloseTo(100, 2);
  });

  it("should handle large values correctly", () => {
    const breakdown = calculateFinancialBreakdown(50000, 10000);

    expect(breakdown.totalValue).toBe(50000);
    expect(breakdown.material).toBe(10000);

    // After material: 50000 - 10000 = 40000
    // GCALHAS 30%: 40000 * 0.3 = 12000
    expect(breakdown.gcalhas).toBe(12000);

    // After GCALHAS: 40000 - 12000 = 28000
    // Car 30%: 28000 * 0.3 = 8400
    expect(breakdown.car).toBe(8400);

    // After Car: 28000 - 8400 = 19600
    // Nildo 27%: 19600 * 0.27 = 5292
    expect(breakdown.nildo).toBeCloseTo(5292, 2);

    // After Nildo: 19600 - 5292 = 14308
    // Matheus 25%: 14308 * 0.25 = 3577
    expect(breakdown.matheus).toBeCloseTo(3577, 2);

    // Cashbox: 14308 - 3577 = 10731
    expect(breakdown.cashbox).toBeCloseTo(10731, 2);
  });

  it("should validate cashbox is always positive", () => {
    const breakdown = calculateFinancialBreakdown(1000, 200);
    expect(breakdown.cashbox).toBeGreaterThan(0);
  });

  it("should validate all components are non-negative", () => {
    const breakdown = calculateFinancialBreakdown(1000, 200);

    expect(breakdown.material).toBeGreaterThanOrEqual(0);
    expect(breakdown.gcalhas).toBeGreaterThanOrEqual(0);
    expect(breakdown.car).toBeGreaterThanOrEqual(0);
    expect(breakdown.nildo).toBeGreaterThanOrEqual(0);
    expect(breakdown.matheus).toBeGreaterThanOrEqual(0);
    expect(breakdown.cashbox).toBeGreaterThanOrEqual(0);
  });
});
