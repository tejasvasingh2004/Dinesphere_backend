export const up = async function(knex) {
  await knex.schema.table('users', (t) => {
    t.text('dietary_preferences');
    t.string('address', 500);
    t.text('bio');
    t.string('avatar_url', 500);
  });
};

export const down = async function(knex) {
  await knex.schema.table('users', (t) => {
    t.dropColumn('dietary_preferences');
    t.dropColumn('address');
    t.dropColumn('bio');
    t.dropColumn('avatar_url');
  });
};

