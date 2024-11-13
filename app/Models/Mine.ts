import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Mine extends BaseModel {
  public static table = 'mines'  // Especifica o nome da tabela

  @column({ isPrimary: true })
  public id: number

  @column()
  public admin_id: number

  @column()
  public type: string

  @column()
  public name: string

  @column()
  public location: string

  @column()
  public description: string

  @column()
  public qr_code: Buffer | null

  @column()
  public instagram: string | null

  @column()
  public facebook: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
