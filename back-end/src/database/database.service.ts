import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';//mariadb ? => 

@Injectable()
export class DatabaseService implements OnModuleInit {
  private connection!: mysql.Connection;
  async onModuleInit() {
    this.connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1516',
      database: 'magasin_db',
    });
    console.log(' MySQL connecté');
  }

  async query(sql: string, params: any[] = []) {
    const [rows] = await this.connection.execute(sql, params);
    return rows;
  }
}