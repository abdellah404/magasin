import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as jwt from 'jsonwebtoken';

const SECRET = 'dukan_secret_key_2024';

@Injectable()
export class FournisseursService {

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
      `SELECT f.*,
        COALESCE(SUM(l.credit), 0) as total_dette
       FROM fournisseurs f
       LEFT JOIN livraisons l ON l.fournisseur_id = f.id
       WHERE f.user_id = ?
       GROUP BY f.id
       ORDER BY f.nom ASC`,
      [userId]
    );
  }

  async create(body: any, authHeader: string) {
    const userId = this.getUserId(authHeader);
    await this.db.query(
      `INSERT INTO fournisseurs (user_id, nom, ville, tel, email, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, body.nom, body.ville || null, body.tel || null, body.email || null, body.notes || null]
    );
    return { message: 'Fournisseur ajouté avec succès' };
  }

  async update(id: number, body: any, authHeader: string) {
    const userId = this.getUserId(authHeader);
    await this.db.query(
      `UPDATE fournisseurs SET nom=?, ville=?, tel=?, email=?, notes=?
       WHERE id=? AND user_id=?`,
      [body.nom, body.ville || null, body.tel || null, body.email || null, body.notes || null, id, userId]
    );
    return { message: 'Fournisseur modifié avec succès' };
  }

  async delete(id: number, authHeader: string) {
    const userId = this.getUserId(authHeader);
    await this.db.query(
      'DELETE FROM fournisseurs WHERE id=? AND user_id=?',
      [id, userId]
    );
    return { message: 'Fournisseur supprimé' };
  }
}