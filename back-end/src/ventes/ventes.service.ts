import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as jwt from 'jsonwebtoken';

const SECRET = 'dukan_secret_key_2024';

@Injectable()
export class VentesService {

  constructor(private db: DatabaseService) {}

  private getUserId(authHeader: string): number {
    if (!authHeader) throw new UnauthorizedException('Token manquant');
    const token   = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, SECRET) as any;
    return decoded.user_id;
  }

  async findAll(authHeader: string) {
    const userId = this.getUserId(authHeader);


    const ventes = await this.db.query(
      `SELECT v.*,
        CONCAT(c.prenom, ' ', c.nom) as client_nom,
        c.tel as client_tel
       FROM ventes v
       LEFT JOIN clients c ON c.id = v.client_id
       WHERE v.user_id = ?
       ORDER BY v.date_vente DESC`,
      [userId]
    ) as any[];


    for (const vente of ventes) {
      vente.lignes = await this.db.query(
        `SELECT lv.*, p.nom as produit_nom
         FROM lignes_vente lv
         JOIN produits p ON p.id = lv.produit_id
         WHERE lv.vente_id = ?`,
        [vente.id]
      );
    }

    return ventes;
  }

  async create(body: any, authHeader: string) {
    const userId = this.getUserId(authHeader);


    const lignes       = body.lignes || [];
    const total        = lignes.reduce((s: number, l: any) => s + (l.quantite * l.prix_unitaire), 0);
    const mode         = body.mode_paiement;
    const montantPaye  = mode === 'comptant' ? total : mode === 'credit' ? 0 : parseFloat(body.montant_paye) || 0;
    const credit       = Math.max(0, total - montantPaye);


    const result: any = await this.db.query(
      `INSERT INTO ventes (user_id, client_id, date_vente, total, montant_paye, credit, mode_paiement, echeance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        body.client_id || null,
        body.date_vente,
        total,
        montantPaye,
        credit,
        mode,
        body.echeance || null,
      ]
    );

    const venteId = result.insertId;


    for (const ligne of lignes) {
      const sousTotal = ligne.quantite * ligne.prix_unitaire;

      await this.db.query(
        `INSERT INTO lignes_vente (vente_id, produit_id, quantite, prix_unitaire, sous_total)
         VALUES (?, ?, ?, ?, ?)`,
        [venteId, ligne.produit_id, ligne.quantite, ligne.prix_unitaire, sousTotal]
      );


      await this.db.query(
        `UPDATE produits SET stock = stock - ? WHERE id = ? AND user_id = ?`,
        [ligne.quantite, ligne.produit_id, userId]
      );
    }

    return { message: 'Vente enregistrée avec succès', venteId };
  }

  async delete(id: number, authHeader: string) {
    const userId = this.getUserId(authHeader);


    const lignes = await this.db.query(
      'SELECT * FROM lignes_vente WHERE vente_id = ?', [id]
    ) as any[];


    for (const ligne of lignes) {
      await this.db.query(
        `UPDATE produits SET stock = stock + ? WHERE id = ? AND user_id = ?`,
        [ligne.quantite, ligne.produit_id, userId]
      );
    }


    await this.db.query('DELETE FROM lignes_vente WHERE vente_id = ?', [id]);
    await this.db.query('DELETE FROM ventes WHERE id = ? AND user_id = ?', [id, userId]);

    return { message: 'Vente supprimée' };
  }
}