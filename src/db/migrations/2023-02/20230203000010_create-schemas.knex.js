'use strict';

exports.up = function (knex) {
  function addCommonFields(table) {
    const tableName = table._tableName;

    table.uuid('id').notNullable().primary(`PK_${tableName}`);
    table
      .timestamp('createdAt', { useTz: true, precision: 3 })
      .defaultTo(knex.fn.now(3))
      .notNullable();
    table.timestamp('updatedAt', { useTz: true, precision: 3 });
  }

  return knex.schema
    .createTable('material', (table) => {
      addCommonFields(table);

      table.text('name').notNullable();

      table.unique(['name'], 'UQ_material__name');
    })
    .then(() => {
      return knex.schema.createTable('department', (table) => {
        addCommonFields(table);

        table.text('name').notNullable();

        table.unique(['name'], 'UQ_department__name');
      });
    })
    .then(() => {
      return knex.schema.createTable('product', (table) => {
        addCommonFields(table);

        table.text('name').notNullable();
        table.text('description').notNullable();

        table.float('price').notNullable();

        table.uuid('materialId').notNullable();
        table.uuid('departmentId').nullable();

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
