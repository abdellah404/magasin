import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as jwt from 'jsonwebtoken';

const SECRET = 'dukan_secret_key_2024';

@Injectable()
export class ClientsService {

  constructor(private db: DatabaseService) {}

  private getUserId(authHeader: string): number {
    if (!authHeader) throw new UnauthorizedException('Token manquant');
    const token   = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, SECRET) as any;
    return decoded.user_id;
  }

  async findAll(authHeader: string) {
    const userId = this.getUserId(authHeader);
    return this.db.query(
      `SELECT c.*,
        COALESCE(SUM(v.credit), 0) as total_credit
       FROM clients c
       LEFT JOIN ventes v ON v.client_id = c.id
       WHERE c.user_id = ?
       GROUP BY c.id
       ORDER BY c.prenom ASC`,
      [userId]
    );
  }

  async create(body: any, authHeader: string) {
    const userId = this.getUserId(authHeader);
    await this.db.query(
      `INSERT INTO clients (user_id, prenom, nom, tel, adresse, limite_credit)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, body.prenom, body.nom, body.tel || null, body.adresse || null, body.limite_credit || 0]
    );
    return { message: 'Client ajouté avec succès' };
  }

  async update(id: number, body: any, authHeader: string) {
    const userId = this.getUserId(authHeader);
    await this.db.query(
      `UPDATE clients SET prenom=?, nom=?, tel=?, adresse=?, limite_credit=?
       WHERE id=? AND user_id=?`,
      [body.prenom, body.nom, body.tel || null, body.adresse || null, body.limite_credit || 0, id, userId]
    );
    return { message: 'Client modifié avec succès' };
  }

  async delete(id: number, authHeader: string) {
    const userId = this.getUserId(authHeader);
    await this.db.query(
      'DELETE FROM clients WHERE id=? AND user_id=?',
      [id, userId]
    );
    return { message: 'Client supprimé' };
  }
}