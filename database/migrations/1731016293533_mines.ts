import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Mines extends BaseSchema {
  protected tableName = 'mines'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('admin_id').notNullable().references('id').inTable('users')
      table.string('type').notNullable()
      table.string('name').notNullable()
      table.string('location').notNullable()
      table.string('description').notNullable()
      table.binary('qr_code').nullable()
      table.string('instagram').nullable()
      table.string('facebook').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
