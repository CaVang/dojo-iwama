/**
 * Supabase Data Seed Script
 * Run: node supabase/seed.js > supabase/seed.sql
 */

const fs = require("fs");
const path = require("path");

// Read JSON files
const techniquesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/techniques.json"), "utf8")
);
const dojosData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/dojos.json"), "utf8")
);
const eventsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/events.json"), "utf8")
);

// Generate SQL INSERT statements for techniques
function generateTechniquesSQL() {
  const rows = techniquesData.map((t) => {
    const variants = JSON.stringify(t.variants || []);
    const content = JSON.stringify(t.content);
    return `(
      '${t.id}',
      '${t.slug}',
      '${t.name_jp.replace(/'/g, "''")}',
      '${t.name_en.replace(/'/g, "''")}',
      '${t.category}',
      ${t.subcategory ? `'${t.subcategory}'` : "NULL"},
      '${t.difficulty}',
      '${(t.description || "").replace(/'/g, "''")}',
      '${variants.replace(/'/g, "''")}',
      '${content.replace(/'/g, "''")}'
    )`;
  });

  return `
-- Insert Techniques
INSERT INTO public.techniques (id, slug, name_jp, name_en, category, subcategory, difficulty, description, variants, content)
VALUES
${rows.join(",\n")}
ON CONFLICT (id) DO UPDATE SET
  name_jp = EXCLUDED.name_jp,
  name_en = EXCLUDED.name_en,
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  difficulty = EXCLUDED.difficulty,
  description = EXCLUDED.description,
  variants = EXCLUDED.variants,
  content = EXCLUDED.content,
  updated_at = NOW();
`;
}

// Generate SQL INSERT statements for dojos
function generateDojosSQL() {
  const rows = dojosData.map((d) => {
    return `(
      '${d.id}',
      '${d.name.replace(/'/g, "''")}',
      ${d.chief_instructor ? `'${d.chief_instructor.replace(/'/g, "''")}'` : "NULL"},
      ${d.address ? `'${d.address.replace(/'/g, "''")}'` : "NULL"},
      ${d.lat || "NULL"},
      ${d.lng || "NULL"},
      ${d.map_link ? `'${d.map_link}'` : "NULL"},
      ${d.phone ? `'${d.phone}'` : "NULL"},
      ${d.email ? `'${d.email}'` : "NULL"},
      ${d.image_url ? `'${d.image_url}'` : "NULL"},
      ${d.description ? `'${d.description.replace(/'/g, "''")}'` : "NULL"},
      'approved'
    )`;
  });

  return `
-- Insert Dojos
INSERT INTO public.dojos (id, name, chief_instructor, address, lat, lng, map_link, phone, email, image_url, description, status)
VALUES
${rows.join(",\n")}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  chief_instructor = EXCLUDED.chief_instructor,
  address = EXCLUDED.address,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng,
  map_link = EXCLUDED.map_link,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  image_url = EXCLUDED.image_url,
  description = EXCLUDED.description;
`;
}

// Generate SQL INSERT statements for events
function generateEventsSQL() {
  const rows = eventsData.map((e) => {
    const relatedBlogIds = JSON.stringify(e.related_blog_ids || []);
    return `(
      '${e.id}',
      '${e.title_key}',
      '${e.date}',
      ${e.end_date ? `'${e.end_date}'` : "NULL"},
      ${e.dojo_id ? `'${e.dojo_id}'` : "NULL"},
      ${e.description_key ? `'${e.description_key}'` : "NULL"},
      ${e.image_url ? `'${e.image_url}'` : "NULL"},
      ${e.event_type ? `'${e.event_type}'` : "NULL"},
      ${e.instructor ? `'${e.instructor.replace(/'/g, "''")}'` : "NULL"},
      '${relatedBlogIds}'
    )`;
  });

  return `
-- Insert Events
INSERT INTO public.events (id, title_key, date, end_date, dojo_id, description_key, image_url, event_type, instructor, related_blog_ids)
VALUES
${rows.join(",\n")}
ON CONFLICT (id) DO UPDATE SET
  title_key = EXCLUDED.title_key,
  date = EXCLUDED.date,
  end_date = EXCLUDED.end_date,
  dojo_id = EXCLUDED.dojo_id,
  description_key = EXCLUDED.description_key,
  image_url = EXCLUDED.image_url,
  event_type = EXCLUDED.event_type,
  instructor = EXCLUDED.instructor,
  related_blog_ids = EXCLUDED.related_blog_ids;
`;
}

// Main output
console.log("-- =============================================");
console.log("-- SUPABASE DATA SEED");
console.log("-- Copy and run in Supabase SQL Editor");
console.log("-- =============================================\n");

console.log(generateDojosSQL());
console.log(generateTechniquesSQL());
console.log(generateEventsSQL());
