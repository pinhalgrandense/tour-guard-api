import Database from "@ioc:Adonis/Lucid/Database"
import User from "App/Models/User"


class UserHelper {
  public async getRoles(user: User) {
    const rolesUser = await Database.query()
      .select('slug as role')
      .from('role_users')
      .where('user_id', user.id)
      .innerJoin('roles', 'roles.id', 'role_users.role_id')
    return rolesUser.map((value) => value.role)
  }
}

export default new UserHelper()