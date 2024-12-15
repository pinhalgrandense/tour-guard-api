import Database, {
  TransactionClientContract,
} from "@ioc:Adonis/Lucid/Database";
import Role from "App/Models/Role";
import User from "App/Models/User";

export enum Roles {
  ADMIN = "admin",
  MANAGER = "manager",
}

class UserHelper {
  public async getRoles(user: User) {
    const rolesUser = await Database.query()
      .select("slug as role")
      .from("role_users")
      .where("user_id", user.id)
      .innerJoin("roles", "roles.id", "role_users.role_id");
    return rolesUser.map((value) => value.role);
  }

  public async assignRole(
    user: User,
    roleSlug: Roles,
    trx: TransactionClientContract
  ): Promise<{ user: User; role: string }> {
    const role = await Role.findByOrFail("slug", roleSlug, { client: trx });
    await trx.insertQuery().table("role_users").insert({
      role_id: role.id,
      user_id: user.id,
    });

    return { user: user, role: role.slug };
  }
}

export default new UserHelper();
