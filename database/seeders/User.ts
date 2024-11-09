import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

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
  }
}
