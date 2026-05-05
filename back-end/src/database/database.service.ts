import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private connection!: mysql.Connection;
  async onModuleInit() {
    this.connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Magasin_db',
    });
    console.log(' MySQL connecté');
  }

  async query(sql: string, params: any[] = []) {
    const [rows] = await this.connection.execute(sql, params);
    return rows;
  }
}