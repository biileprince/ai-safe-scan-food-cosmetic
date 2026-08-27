/**
 * SafeScan — Ingredients Database Seeder
 * 
 * Run with: node scripts/seed-ingredients.js
 * 
 * Populates the Appwrite 'ingredients' collection with known food and cosmetic
 * ingredients, their risk levels, regulatory status, and evidence sources.
 * 
 * Requires environment variables:
 *   APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY
 */

const { Client, Databases, ID } = require('node-appwrite');

// ── Config ──────────────────────────────────────────────────────────

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '6a8b501c000c7f0210e6';
const API_KEY = process.env.APPWRITE_API_KEY || '';

const DB_ID = 'safescan_db';
const COLLECTION_ID = 'ingredients';

// ── Ingredient Data ─────────────────────────────────────────────────

const FOOD_INGREDIENTS = [
  // Preservatives
  {
    name: 'Sodium Benzoate',
    canonicalName: 'sodium_benzoate',
    category: 'preservative',
    productType: 'food',
    riskLevel: 'low',
    description: 'Common preservative used in acidic foods and beverages.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'GRAS', maxLevel: '0.1%' },
      EU: { status: 'Permitted (E211)', maxLevel: '150-2000 mg/kg' },
      NAFDAC: { status: 'Permitted', maxLevel: 'Codex limits' },
    }),
    evidenceSources: JSON.stringify([
      'FDA GRAS List', 'EFSA Opinion 2016', 'Codex Alimentarius GSFA'
    ]),
    allergenPotential: 'none',
    isBeneficial: false,
  },
  {
    name: 'Potassium Sorbate',
    canonicalName: 'potassium_sorbate',
    category: 'preservative',
    productType: 'food',
    riskLevel: 'none',
    description: 'Widely used preservative effective against molds and yeasts.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'GRAS' },
      EU: { status: 'Permitted (E202)' },
      NAFDAC: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['FDA GRAS List', 'EFSA Panel on Food Additives']),
    allergenPotential: 'none',
    isBeneficial: false,
  },
  {
    name: 'Sodium Nitrite',
    canonicalName: 'sodium_nitrite',
    category: 'preservative',
    productType: 'food',
    riskLevel: 'moderate',
    description: 'Used in cured meats. Can form nitrosamines which are potential carcinogens when heated.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Permitted', maxLevel: '200 ppm' },
      EU: { status: 'Permitted (E250)', maxLevel: '150 mg/kg' },
      NAFDAC: { status: 'Permitted with limits' },
    }),
    evidenceSources: JSON.stringify(['IARC Group 2A (processed meat)', 'FDA CFR 172.175']),
    allergenPotential: 'none',
    isBeneficial: false,
  },
  // Sweeteners
  {
    name: 'Aspartame',
    canonicalName: 'aspartame',
    category: 'sweetener',
    productType: 'food',
    riskLevel: 'low',
    description: 'Artificial sweetener ~200x sweeter than sugar. Contains phenylalanine.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Approved', ADI: '50 mg/kg/day' },
      EU: { status: 'Approved (E951)', ADI: '40 mg/kg/day' },
      NAFDAC: { status: 'Approved' },
    }),
    evidenceSources: JSON.stringify(['FDA', 'EFSA 2013 Re-evaluation', 'JECFA']),
    allergenPotential: 'phenylalanine',
    isBeneficial: false,
  },
  {
    name: 'Sucralose',
    canonicalName: 'sucralose',
    category: 'sweetener',
    productType: 'food',
    riskLevel: 'none',
    description: 'Non-caloric artificial sweetener ~600x sweeter than sugar.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Approved' },
      EU: { status: 'Approved (E955)' },
      NAFDAC: { status: 'Approved' },
    }),
    evidenceSources: JSON.stringify(['FDA', 'EFSA', 'JECFA']),
    allergenPotential: 'none',
    isBeneficial: false,
  },
  {
    name: 'Stevia (Steviol Glycosides)',
    canonicalName: 'stevia',
    category: 'sweetener',
    productType: 'food',
    riskLevel: 'none',
    description: 'Natural non-caloric sweetener derived from the Stevia rebaudiana plant.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'GRAS' },
      EU: { status: 'Approved (E960)' },
      NAFDAC: { status: 'Approved' },
    }),
    evidenceSources: JSON.stringify(['FDA GRAS Notice', 'EFSA', 'JECFA']),
    allergenPotential: 'none',
    isBeneficial: true,
  },
  // Colorants
  {
    name: 'Tartrazine',
    canonicalName: 'tartrazine',
    category: 'colorant',
    productType: 'food',
    riskLevel: 'moderate',
    description: 'Yellow azo dye (FD&C Yellow No. 5). May cause allergic reactions in sensitive individuals.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Certified color', note: 'Must declare on label' },
      EU: { status: 'Permitted (E102)', note: 'Southampton warning label required' },
      NAFDAC: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['FDA CFR 74.1705', 'EFSA 2009 Re-evaluation']),
    allergenPotential: 'aspirin_sensitivity',
    isBeneficial: false,
  },
  {
    name: 'Sunset Yellow FCF',
    canonicalName: 'sunset_yellow',
    category: 'colorant',
    productType: 'food',
    riskLevel: 'moderate',
    description: 'Orange azo dye (FD&C Yellow No. 6). Associated with hyperactivity in children (Southampton study).',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Certified color' },
      EU: { status: 'Permitted (E110)', note: 'Southampton warning label' },
      NAFDAC: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['McCann et al., 2007', 'EFSA 2014']),
    allergenPotential: 'aspirin_sensitivity',
    isBeneficial: false,
  },
  // Emulsifiers & Stabilizers
  {
    name: 'Lecithin (Soy)',
    canonicalName: 'soy_lecithin',
    category: 'emulsifier',
    productType: 'food',
    riskLevel: 'none',
    description: 'Natural emulsifier derived from soybeans. Common allergen source.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'GRAS' },
      EU: { status: 'Permitted (E322)' },
      NAFDAC: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['FDA GRAS List', 'Codex GSFA']),
    allergenPotential: 'soy',
    isBeneficial: false,
  },
  {
    name: 'Carrageenan',
    canonicalName: 'carrageenan',
    category: 'stabilizer',
    productType: 'food',
    riskLevel: 'low',
    description: 'Seaweed-derived thickener. Some studies suggest GI effects at high intake.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'GRAS' },
      EU: { status: 'Permitted (E407)' },
      NAFDAC: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['FDA', 'JECFA re-evaluation', 'NTP 2018']),
    allergenPotential: 'none',
    isBeneficial: false,
  },
  // Beneficial / Nutritional
  {
    name: 'Vitamin C (Ascorbic Acid)',
    canonicalName: 'ascorbic_acid',
    category: 'vitamin',
    productType: 'food',
    riskLevel: 'none',
    description: 'Essential nutrient and antioxidant. Also used as a preservative.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'GRAS' },
      EU: { status: 'Permitted (E300)' },
      NAFDAC: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['FDA', 'EFSA NDA Panel']),
    allergenPotential: 'none',
    isBeneficial: true,
  },
  {
    name: 'Iron (Ferrous Sulfate)',
    canonicalName: 'ferrous_sulfate',
    category: 'mineral',
    productType: 'food',
    riskLevel: 'none',
    description: 'Essential mineral commonly added for iron fortification.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'GRAS' },
      EU: { status: 'Permitted' },
      NAFDAC: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['WHO Fortification Guidelines', 'FDA']),
    allergenPotential: 'none',
    isBeneficial: true,
  },
  {
    name: 'Folic Acid',
    canonicalName: 'folic_acid',
    category: 'vitamin',
    productType: 'food',
    riskLevel: 'none',
    description: 'B vitamin essential for DNA synthesis. Mandatory fortification in many countries.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Mandatory in enriched grains' },
      EU: { status: 'Permitted' },
      NAFDAC: { status: 'Mandatory in wheat flour' },
    }),
    evidenceSources: JSON.stringify(['FDA CFR 137.165', 'WHO Guidelines']),
    allergenPotential: 'none',
    isBeneficial: true,
  },
  // High-Risk
  {
    name: 'Trans Fat (Partially Hydrogenated Oil)',
    canonicalName: 'trans_fat',
    category: 'fat',
    productType: 'food',
    riskLevel: 'high',
    description: 'Industrial trans fats are strongly linked to cardiovascular disease. Banned in many jurisdictions.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Banned (not GRAS since 2018)' },
      EU: { status: 'Restricted to <2% of fat' },
      NAFDAC: { status: 'Restricted' },
    }),
    evidenceSources: JSON.stringify(['WHO REPLACE guidance', 'FDA 2015 determination']),
    allergenPotential: 'none',
    isBeneficial: false,
  },
  {
    name: 'Monosodium Glutamate (MSG)',
    canonicalName: 'msg',
    category: 'flavor_enhancer',
    productType: 'food',
    riskLevel: 'low',
    description: 'Flavor enhancer. Considered safe by major agencies but some individuals report sensitivity.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'GRAS' },
      EU: { status: 'Permitted (E621)', ADI: '30 mg/kg/day' },
      NAFDAC: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['FDA', 'EFSA 2017 Re-evaluation']),
    allergenPotential: 'msg_sensitivity',
    isBeneficial: false,
  },
];

const COSMETIC_INGREDIENTS = [
  {
    name: 'Parabens (Methylparaben)',
    canonicalName: 'methylparaben',
    category: 'preservative',
    productType: 'cosmetic',
    riskLevel: 'moderate',
    description: 'Widely used cosmetic preservative. Weak estrogenic activity detected in some studies.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Permitted (FDA)' },
      EU: { status: 'Permitted, max 0.4% single / 0.8% mix', note: 'Banned in products for under-3' },
      SAHPRA: { status: 'Permitted with EU limits' },
    }),
    evidenceSources: JSON.stringify(['SCCS Opinion 2013', 'FDA Cosmetics Safety']),
    allergenPotential: 'none',
    isBeneficial: false,
  },
  {
    name: 'Hydroquinone',
    canonicalName: 'hydroquinone',
    category: 'skin_lightening',
    productType: 'cosmetic',
    riskLevel: 'high',
    description: 'Potent skin bleaching agent. Can cause ochronosis with prolonged use. Banned OTC in some regions.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'OTC up to 2%, Rx above' },
      EU: { status: 'Banned in cosmetics' },
      NAFDAC: { status: 'Banned in cosmetics' },
      SAHPRA: { status: 'Restricted to prescription' },
      KEBS: { status: 'Banned in cosmetics' },
    }),
    evidenceSources: JSON.stringify(['EU Cosmetics Regulation Annex II', 'NAFDAC Guidelines']),
    allergenPotential: 'none',
    isBeneficial: false,
  },
  {
    name: 'Mercury / Mercury Compounds',
    canonicalName: 'mercury',
    category: 'skin_lightening',
    productType: 'cosmetic',
    riskLevel: 'prohibited',
    description: 'Toxic heavy metal sometimes found in illegal skin-lightening creams. Causes kidney and neurological damage.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Banned' },
      EU: { status: 'Banned (Annex II)' },
      NAFDAC: { status: 'Banned' },
      WHO: { status: 'Prohibited in cosmetics globally' },
    }),
    evidenceSources: JSON.stringify(['Minamata Convention', 'WHO Mercury in Skin Lightening Products']),
    allergenPotential: 'none',
    isBeneficial: false,
  },
  {
    name: 'Lead Compounds',
    canonicalName: 'lead',
    category: 'contaminant',
    productType: 'cosmetic',
    riskLevel: 'prohibited',
    description: 'Toxic heavy metal. Sometimes found as contaminant in traditional cosmetics (e.g. kohl/surma).',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Banned as intentional ingredient', maxContaminant: '10 ppm' },
      EU: { status: 'Banned (Annex II)' },
      NAFDAC: { status: 'Banned' },
    }),
    evidenceSources: JSON.stringify(['FDA Guidance for Lead in Cosmetics', 'EU Cosmetics Reg']),
    allergenPotential: 'none',
    isBeneficial: false,
  },
  {
    name: 'Retinol (Vitamin A)',
    canonicalName: 'retinol',
    category: 'active',
    productType: 'cosmetic',
    riskLevel: 'low',
    description: 'Anti-aging active. Effective for wrinkles and hyperpigmentation. Can cause irritation and photosensitivity.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Permitted' },
      EU: { status: 'Permitted, max 0.3% in face, 0.05% body' },
      SAHPRA: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['SCCS Opinion 2016', 'Journal of Dermatological Treatment']),
    allergenPotential: 'none',
    isBeneficial: true,
  },
  {
    name: 'Hyaluronic Acid',
    canonicalName: 'hyaluronic_acid',
    category: 'moisturizer',
    productType: 'cosmetic',
    riskLevel: 'none',
    description: 'Natural humectant that retains skin moisture. Excellent safety profile.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Permitted' },
      EU: { status: 'Permitted' },
      SAHPRA: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['CIR Safety Assessment', 'SCCS']),
    allergenPotential: 'none',
    isBeneficial: true,
  },
  {
    name: 'Sodium Lauryl Sulfate (SLS)',
    canonicalName: 'sls',
    category: 'surfactant',
    productType: 'cosmetic',
    riskLevel: 'low',
    description: 'Common foaming agent in shampoos and cleansers. Can cause skin irritation at high concentrations.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Permitted' },
      EU: { status: 'Permitted' },
      SAHPRA: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['CIR 2005 Re-evaluation', 'SCCS']),
    allergenPotential: 'none',
    isBeneficial: false,
  },
  {
    name: 'Formaldehyde Releasers (DMDM Hydantoin)',
    canonicalName: 'dmdm_hydantoin',
    category: 'preservative',
    productType: 'cosmetic',
    riskLevel: 'high',
    description: 'Formaldehyde-releasing preservative. Classified as carcinogen when inhaled (IARC Group 1).',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Permitted with labeling' },
      EU: { status: 'Permitted, max 0.6% free formaldehyde', note: 'Must label >0.05%' },
      NAFDAC: { status: 'Restricted' },
    }),
    evidenceSources: JSON.stringify(['IARC Monograph Vol 100F', 'SCCS Opinion on Formaldehyde']),
    allergenPotential: 'formaldehyde',
    isBeneficial: false,
  },
  {
    name: 'Niacinamide (Vitamin B3)',
    canonicalName: 'niacinamide',
    category: 'active',
    productType: 'cosmetic',
    riskLevel: 'none',
    description: 'Brightening and anti-inflammatory active. Reduces pore appearance and strengthens skin barrier.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Permitted' },
      EU: { status: 'Permitted' },
      SAHPRA: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['CIR Safety Assessment', 'British Journal of Dermatology']),
    allergenPotential: 'none',
    isBeneficial: true,
  },
  {
    name: 'Titanium Dioxide',
    canonicalName: 'titanium_dioxide',
    category: 'sunscreen',
    productType: 'cosmetic',
    riskLevel: 'low',
    description: 'Physical sunscreen and colorant. Safe topically; inhalation risk for nano-particles.',
    regulatoryStatus: JSON.stringify({
      US: { status: 'Approved OTC sunscreen active' },
      EU: { status: 'Permitted (CI 77891)', note: 'Banned as food additive E171 since 2022' },
      SAHPRA: { status: 'Permitted' },
    }),
    evidenceSources: JSON.stringify(['FDA OTC Monograph', 'SCCS 2020 Opinion on Nano TiO2']),
    allergenPotential: 'none',
    isBeneficial: true,
  },
];

const ALL_INGREDIENTS = [...FOOD_INGREDIENTS, ...COSMETIC_INGREDIENTS];

// ── Seeder ──────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY) {
    console.error('❌ APPWRITE_API_KEY is required. Set it in your environment.');
    console.log('Usage: APPWRITE_API_KEY=your_key node scripts/seed-ingredients.js');
    process.exit(1);
  }

  const client = new Client();
  client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  const databases = new Databases(client);

  console.log(`\n🌱 SafeScan Ingredient Seeder`);
  console.log(`   Database: ${DB_ID}`);
  console.log(`   Collection: ${COLLECTION_ID}`);
  console.log(`   Ingredients to seed: ${ALL_INGREDIENTS.length}\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const ingredient of ALL_INGREDIENTS) {
    try {
      await databases.createDocument(
        DB_ID,
        COLLECTION_ID,
        ID.unique(),
        ingredient
      );
      created++;
      console.log(`  ✅ ${ingredient.name}`);
    } catch (err) {
      if (err.code === 409) {
        skipped++;
        console.log(`  ⏭️  ${ingredient.name} (already exists)`);
      } else {
        errors++;
        console.error(`  ❌ ${ingredient.name}: ${err.message}`);
      }
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors:  ${errors}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);
