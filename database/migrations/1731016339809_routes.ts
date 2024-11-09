import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Routes extends BaseSchema {
  protected tableName = 'routes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('mine_id').notNullable().references('id').inTable('mines')
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.binary('map').nullable()
      table.string('difficulty').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
