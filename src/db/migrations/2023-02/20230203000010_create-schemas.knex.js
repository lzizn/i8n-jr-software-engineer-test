'use strict';

exports.up = function (knex) {
  function addCommonFields(table) {
    const tableName = table._tableName;

    // TODO: change to PGSQL and use uuid here
    table.integer('id').notNullable().primary(`PK_${tableName}`);
    table.timestamp('createdAt', { useTz: true, precision: 3 }).notNullable();
    table.timestamp('updatedAt', { useTz: true, precision: 3 });
  }

  return knex.schema
    .createTable('material', (table) => {
      addCommonFields(table);

      table.string('name').notNullable();

      table.unique(['name'], 'UQ_material__name');
    })
    .then(() => {
      return knex.schema.createTable('department', (table) => {
        addCommonFields(table);

        table.string('name').notNullable();

        table.unique(['name'], 'UQ_department__name');
      });
    })
    .then(() => {
      return knex.schema.createTable('product', (table) => {
        addCommonFields(table);

        table.string('name').notNullable();
        table.string('description').notNullable();

        table.float('price').notNullable();

        table.string('materialId').notNullable();
        table.string('departmentId').notNullable();

        table
          .foreign(['materialId'], 'FK_product__materialId')
          .references('id')
          .inTable('material')
          .onUpdate('CASCADE')
          .onDelete('RESTRICT');

        table
          .foreign(['departmentId'], 'FK_product__departmentId')
          .references('id')
          .inTable('department')
          .onUpdate('CASCADE')
          .onDelete('RESTRICT');
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('product')
    .then(() => knex.schema.dropTable('department'))
    .then(() => knex.schema.dropTable('material'));
};
