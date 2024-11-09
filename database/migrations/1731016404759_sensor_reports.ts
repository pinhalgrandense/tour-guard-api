import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SensorReports extends BaseSchema {
  protected tableName = 'sensor_reports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('sensor_id').notNullable().references('id').inTable('sensors')
      table.boolean('in').notNullable()
      table.timestamp('timestamp').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

