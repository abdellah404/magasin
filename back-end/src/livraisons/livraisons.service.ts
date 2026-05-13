import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as jwt from 'jsonwebtoken';

const SECRET = 'dukan_secret_key_2024';

@Injectable()
export class LivraisonsService {

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
      `SELECT l.*,
        f.nom as fournisseur_nom,
        p.nom as produit_nom,
        p.unite as produit_unite
       FROM livraisons l
       JOIN fournisseurs f ON f.id = l.fournisseur_id
       JOIN produits p     ON p.id = l.produit_id
       WHERE l.user_id = ?
       ORDER BY l.date_livraison DESC`,
      [userId]
    );
  }

  async create(body: any, authHeader: string) {
    const userId = this.getUserId(authHeader);


    const total   = body.quantite * body.prix_unitaire;
    const paye    = parseFloat(body.montant_paye) || 0;
    const credit  = Math.max(0, total - paye);


    await this.db.query(
      `INSERT INTO livraisons (user_id, fournisseur_id, produit_id, date_livraison, quantite, prix_unitaire, total, montant_paye, credit, echeance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        body.fournisseur_id,
        body.produit_id,
        body.date_livraison,
        body.quantite,
        body.prix_unitaire,
        total,
        paye,
        credit,
        body.echeance || null,
      ]
    );


    await this.db.query(
      `UPDATE produits SET stock = stock + ? WHERE id = ? AND user_id = ?`,
      [body.quantite, body.produit_id, userId]
    );

    return { message: 'Livraison enregistrée avec succès' };
  }

  async delete(id: number, authHeader: string) {
    const userId = this.getUserId(authHeader);


    const livraisons = await this.db.query(
      'SELECT * FROM livraisons WHERE id = ? AND user_id = ?',
      [id, userId]
    ) as any[];

    if (livraisons.length > 0) {
      const liv = livraisons[0];


      await this.db.query(
        `UPDATE produits SET stock = stock - ? WHERE id = ? AND user_id = ?`,
        [liv.quantite, liv.produit_id, userId]
      );
    }

    await this.db.query(
      'DELETE FROM livraisons WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    return { message: 'Livraison supprimée' };
  }
}