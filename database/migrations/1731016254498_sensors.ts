import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Sensors extends BaseSchema {
  protected tableName = 'sensors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('region_id').notNullable().references('id').inTable('regions')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

