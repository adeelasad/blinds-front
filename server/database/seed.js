import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { STARTER_PRODUCTS } from './starterProducts.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

async function seedDatabase() {
  console.log('🌱 Starting database seed for Lumina Window Treatments...');

  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️ SUPABASE_URL or SUPABASE_KEY not set in .env.');
    console.log(`📦 Loaded ${STARTER_PRODUCTS.length} starter products in local fallback memory.`);
    console.log('💡 When you have your Supabase project ready, paste schema.sql and seed.sql in the Supabase SQL Editor.');
    process.exit(0);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log(`📤 Seeding ${STARTER_PRODUCTS.length} starter products into Supabase...`);

    for (const product of STARTER_PRODUCTS) {
      const { error } = await supabase
        .from('products')
        .upsert(product, { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Error seeding ${product.name}:`, error.message);
      } else {
        console.log(`✅ Seeded product: ${product.name} ($${product.price_min}-$${product.price_max})`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed with unexpected error:', err.message);
  }
}

seedDatabase();
