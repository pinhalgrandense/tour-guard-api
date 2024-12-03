import { DateTime } from "luxon";
import { BaseModel, column, BelongsTo, belongsTo } from "@ioc:Adonis/Lucid/Orm";
import Region from "./Region";

export default class RegionFact extends BaseModel {
  public static table = "region_facts";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public region_id: number;

  @column()
  public title: string;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Region, {
    foreignKey: "region_id",
  })
  public region: BelongsTo<typeof Region>;
}
