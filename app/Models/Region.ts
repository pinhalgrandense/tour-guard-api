// app/Models/Region.ts
import { DateTime } from "luxon";
import { BaseModel, column, BelongsTo, belongsTo } from "@ioc:Adonis/Lucid/Orm";
import Mine from "./Mine";

export default class Region extends BaseModel {
  public static table = "regions";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public mine_id: number;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  // Relação belongsTo com Mine
  @belongsTo(() => Mine, {
    foreignKey: "mine_id",
  })
  public mine: BelongsTo<typeof Mine>;
}
