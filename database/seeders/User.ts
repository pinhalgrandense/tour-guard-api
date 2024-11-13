import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'
import Admin from 'App/Models/Admin'
import Role from 'App/Models/Role'
import Manager from 'App/Models/Manager'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        full_name: 'Alice Smith',
        email: 'alice.smith@example.com',
        password: 'password123',
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
      {
        full_name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        password: 'password123',
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
      {
        full_name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        password: 'password123',
        created_at: DateTime.now(),
        updated_at: DateTime.now(),
      },
    ])

    const trx = await Database.transaction()

    try {
      let adminUser = await User.findBy('email', Env.get('ADMIN_EMAIL'), trx)

      if (!adminUser) {
        adminUser = await User.create(
          {
            email: Env.get('ADMIN_EMAIL'),
            password: Env.get('ADMIN_PASSWORD'),
            full_name: 'Admin',
          },
          { client: trx }
        )
        const role = await Role.findByOrFail('slug', 'admin', trx)
        await trx.table('role_users').insert({
          role_id: role.id,
          user_id: adminUser.id,
        })
        await Admin.create(
          {
            user_id: adminUser.id,
          },
          { client: trx }
        )
      }

      let managerUser = await User.findBy('email', 'manager@mail.com', trx)

      if (!managerUser) {
        managerUser = await User.create(
          {
            email: 'manager@mail.com',
            password: '123456',
            full_name: 'Manager',
          },
          { client: trx }
        )
        const role = await Role.findByOrFail('slug', 'manager', trx)
        await trx.table('role_users').insert({
          role_id: role.id,
          user_id: managerUser.id,
        })

        await Manager.create(
          {
            user_id: managerUser.id,
          },
          { client: trx }
        )
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error(error)
    }
  }
}
