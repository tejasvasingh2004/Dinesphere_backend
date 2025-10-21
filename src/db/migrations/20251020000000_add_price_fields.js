export const up = async function(knex) {
  // Add min_price and max_price columns to restaurants table
  await knex.schema.alterTable('restaurants', (table) => {
    table.decimal('min_price', 10, 2).defaultTo(0);
    table.decimal('max_price', 10, 2).defaultTo(0);
  });

  // Populate min_price and max_price from existing price_range data
  // This assumes price_range format like "₹2500-10000" or "₹₹₹"
  await knex.raw(`
    UPDATE restaurants
    SET
      min_price = CASE
        WHEN price_range ~ '^₹([0-9]+)-₹([0-9]+)$'
        THEN (regexp_match(price_range, '^₹([0-9]+)-₹([0-9]+)$'))[1]::decimal
        WHEN price_range ~ '^₹([0-9]+)$'
        THEN (regexp_match(price_range, '^₹([0-9]+)$'))[1]::decimal
        ELSE 0
      END,
      max_price = CASE
        WHEN price_range ~ '^₹([0-9]+)-₹([0-9]+)$'
        THEN (regexp_match(price_range, '^₹([0-9]+)-₹([0-9]+)$'))[2]::decimal
        WHEN price_range ~ '^₹([0-9]+)$'
        THEN (regexp_match(price_range, '^₹([0-9]+)$'))[1]::decimal
        ELSE 0
      END
  `);
};

export const down = async function(knex) {
  await knex.schema.alterTable('restaurants', (table) => {
    table.dropColumn('min_price');
    table.dropColumn('max_price');
  });
};
