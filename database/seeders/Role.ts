import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import Role from 'App/Models/Role'

export default class RoleSeeder extends BaseSeeder {
  public async run() {
    const trx = await Database.transaction()
    try {
      await Role.firstOrCreate(
        { slug: 'admin' },
        { slug: 'admin', description: 'manage administrator privileges' },
        { client: trx }
      )
      await Role.firstOrCreate(
        { slug: 'manager' },
        { slug: 'manager', description: 'manage delivery manager privileges' },
        { client: trx }
      )

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      console.error(error)
      console.log('Erro ao criar roles')
    }
  }
}
