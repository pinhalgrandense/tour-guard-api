import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RegionFacts extends BaseSchema {
  protected tableName = 'region_facts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('region_id').notNullable().references('id').inTable('regions')
      table.string('title').notNullable()
      table.string('description').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

