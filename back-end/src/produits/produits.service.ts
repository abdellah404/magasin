import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as jwt from 'jsonwebtoken';

const SECRET = 'dukan_secret_key_2024';

@Injectable()
export class ProduitsService {

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
      `SELECT p.*, f.nom as fournisseur_nom
       FROM produits p
       LEFT JOIN fournisseurs f ON f.id = p.fournisseur_id
       WHERE p.user_id = ?
       ORDER BY p.nom ASC`,
      [userId]
    );
  }

  async create(body: any, authHeader: string) {
    const userId = this.getUserId(authHeader);
    await this.db.query(
      `INSERT INTO produits (user_id, fournisseur_id, nom, prix_unitaire, stock, seuil_alerte, unite, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        body.fournisseur_id || null,
        body.nom,
        body.prix_unitaire,
        body.stock        || 0,
        body.seuil_alerte || 0,
        body.unite,
        body.description  || null,
      ]
    );
    return { message: 'Produit ajouté avec succès' };
  }

  async update(id: number, body: any, authHeader: string) {
    const userId = this.getUserId(authHeader);
    await this.db.query(
      `UPDATE produits SET fournisseur_id=?, nom=?, prix_unitaire=?, stock=?, seuil_alerte=?, unite=?, description=?
       WHERE id=? AND user_id=?`,
      [
        body.fournisseur_id || null,
        body.nom,
        body.prix_unitaire,
        body.stock        || 0,
        body.seuil_alerte || 0,
        body.unite,
        body.description  || null,
        id,
        userId,
      ]
    );
    return { message: 'Produit modifié avec succès' };
  }

  async delete(id: number, authHeader: string) {
    const userId = this.getUserId(authHeader);
    await this.db.query(
      'DELETE FROM produits WHERE id=? AND user_id=?',
      [id, userId]
    );
    return { message: 'Produit supprimé' };
  }
}