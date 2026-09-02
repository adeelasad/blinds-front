// server/services/pricingMatrix.js

export const DEFAULT_WIDTH_BRACKETS = [24, 30, 36, 42, 48, 54, 60, 66, 72, 84, 96];
export const DEFAULT_HEIGHT_BRACKETS = [36, 48, 60, 72, 84, 96, 108];

// Baseline matrix price grid for Window Shades (Width columns x Height rows)
export const DEFAULT_SHADES_MATRIX = {
  24: { 36: 89, 48: 99, 60: 109, 72: 122, 84: 135, 96: 149, 108: 165 },
  30: { 36: 98, 48: 109, 60: 120, 72: 134, 84: 148, 96: 164, 108: 182 },
  36: { 36: 109, 48: 119, 60: 132, 72: 148, 84: 165, 96: 182, 108: 202 },
  42: { 36: 120, 48: 132, 60: 146, 72: 164, 84: 182, 96: 202, 108: 224 },
  48: { 36: 132, 48: 146, 60: 162, 72: 180, 84: 202, 96: 224, 108: 249 },
  54: { 36: 145, 48: 160, 60: 178, 72: 199, 84: 222, 96: 248, 108: 275 },
  60: { 36: 159, 48: 175, 60: 195, 72: 218, 84: 244, 96: 272, 108: 302 },
  66: { 36: 174, 48: 192, 60: 214, 72: 239, 84: 268, 96: 298, 108: 332 },
  72: { 36: 190, 48: 210, 60: 234, 72: 262, 84: 294, 96: 326, 108: 364 },
  84: { 36: 218, 48: 242, 60: 270, 72: 302, 84: 338, 96: 376, 108: 418 },
  96: { 36: 248, 48: 276, 60: 308, 72: 345, 84: 386, 96: 430, 108: 478 }
};

export const DEFAULT_OPTION_UPCHARGES = {
  lift_systems: [
    { id: 'cordless_spring', name: 'Cordless Spring System (Child Safe)', upcharge: 0, is_default: true, icon: '🪟' },
    { id: 'precision_cordless', name: 'Precision Smooth Cordless Glide', upcharge: 18.00, is_default: false, icon: '✨' },
    { id: 'continuous_loop', name: 'Heavy-Duty Stainless Steel Cord Loop', upcharge: 25.00, is_default: false, icon: '🔗' },
    { id: 'motorized_wand', name: 'Rechargeable Motorized Smart Wand', upcharge: 75.00, is_default: false, icon: '🪄' },
    { id: 'somfy_motorized', name: 'Somfy / PowerView Smart Motor with Remote', upcharge: 135.00, is_default: false, icon: '⚡' }
  ],
  cassettes: [
    { id: 'exposed_roller', name: 'Standard Exposed Roller Bar', upcharge: 0, is_default: true },
    { id: 'fabric_cassette', name: 'Fabric-Wrapped Curved Designer Cassette', upcharge: 35.00, is_default: false },
    { id: 'aluminum_fascia', name: 'Architectural Aluminum Square Fascia', upcharge: 45.00, is_default: false }
  ],
  roll_directions: [
    { id: 'standard_roll', name: 'Standard Roll (Closer to window glass)', upcharge: 0, is_default: true },
    { id: 'waterfall_roll', name: 'Reverse / Waterfall Roll (Conceals roller tube)', upcharge: 0, is_default: false }
  ],
  bottom_rails: [
    { id: 'fabric_pocket', name: 'Sewn-In Fabric Wrapped Pocket Bar', upcharge: 0, is_default: true },
    { id: 'aluminum_hem_bar', name: 'Exposed Architectural Aluminum Hem Bar', upcharge: 14.00, is_default: false }
  ],
  warranties: [
    { id: 'standard_warranty', name: 'Lifetime Craftsmanship Guarantee (Included)', upcharge: 0, is_default: true },
    { id: 'accident_protection', name: '5-Year No-Questions-Asked Accident & Remeasure Replacement', upcharge: 19.99, is_default: false }
  ]
};

export function calculateMatrixPrice(params, matrixGrid = DEFAULT_SHADES_MATRIX, upchargesConfig = DEFAULT_OPTION_UPCHARGES) {
  const {
    width = 36,
    height = 60,
    lift_id = 'cordless_spring',
    cassette_id = 'exposed_roller',
    roll_direction_id = 'standard_roll',
    bottom_rail_id = 'fabric_pocket',
    warranty_id = 'standard_warranty',
    quantity = 1,
    discount_percent = 25
  } = params || {};

  const w = parseFloat(width) || 36;
  const h = parseFloat(height) || 60;
  const qty = Math.max(1, parseInt(quantity, 10) || 1);

  const sortedWidths = Object.keys(matrixGrid).map(Number).sort((a, b) => a - b);
  const matchedWidth = sortedWidths.find(bracket => bracket >= w) || sortedWidths[sortedWidths.length - 1];

  const heightRow = matrixGrid[matchedWidth] || matrixGrid[sortedWidths[0]];
  const sortedHeights = Object.keys(heightRow).map(Number).sort((a, b) => a - b);
  const matchedHeight = sortedHeights.find(bracket => bracket >= h) || sortedHeights[sortedHeights.length - 1];

  const baseMatrixPrice = heightRow[matchedHeight] || 119;

  const lift = (upchargesConfig.lift_systems || []).find(l => l.id === lift_id);
  const liftUpcharge = lift ? lift.upcharge : 0;

  const cassette = (upchargesConfig.cassettes || []).find(c => c.id === cassette_id);
  const cassetteUpcharge = cassette ? cassette.upcharge : 0;

  const roll = (upchargesConfig.roll_directions || []).find(r => r.id === roll_direction_id);
  const rollUpcharge = roll ? roll.upcharge : 0;

  const bottom = (upchargesConfig.bottom_rails || []).find(b => b.id === bottom_rail_id);
  const bottomUpcharge = bottom ? bottom.upcharge : 0;

  const warranty = (upchargesConfig.warranties || []).find(w => w.id === warranty_id);
  const warrantyUpcharge = warranty ? warranty.upcharge : 0;

  const totalUpchargesPerUnit = liftUpcharge + cassetteUpcharge + rollUpcharge + bottomUpcharge;
  const regularUnitPrice = baseMatrixPrice + totalUpchargesPerUnit;
  
  const discountMultiplier = (100 - (discount_percent || 0)) / 100;
  const saleUnitPrice = Math.round((regularUnitPrice * discountMultiplier) * 100) / 100;

  const subtotalBeforeWarranty = saleUnitPrice * qty;
  const totalWarranty = warrantyUpcharge * qty;
  const finalTotalPrice = Math.round((subtotalBeforeWarranty + totalWarranty) * 100) / 100;
  const deposit50 = Math.round((finalTotalPrice * 0.5) * 100) / 100;
  const balanceDue = Math.round((finalTotalPrice - deposit50) * 100) / 100;

  return {
    matched_width_bracket: matchedWidth,
    matched_height_bracket: matchedHeight,
    base_matrix_price: baseMatrixPrice,
    itemized_upcharges: {
      lift: { name: lift?.name || 'Standard Cordless', upcharge: liftUpcharge },
      cassette: { name: cassette?.name || 'Exposed Roller', upcharge: cassetteUpcharge },
      roll_direction: { name: roll?.name || 'Standard Roll', upcharge: rollUpcharge },
      bottom_rail: { name: bottom?.name || 'Fabric Pocket', upcharge: bottomUpcharge },
      warranty: { name: warranty?.name || 'Lifetime Craftsmanship', upcharge: warrantyUpcharge }
    },
    regular_unit_price: regularUnitPrice,
    discount_percent,
    sale_unit_price: saleUnitPrice,
    quantity: qty,
    subtotal: subtotalBeforeWarranty,
    warranty_total: totalWarranty,
    final_total: finalTotalPrice,
    deposit_50_percent: deposit50,
    balance_due: balanceDue
  };
}
