import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as jwt from 'jsonwebtoken';

const SECRET = 'dukan_secret_key_2024';

@Injectable()

export class CreditsService {

  constructor(private db: DatabaseService) {}

  private getUserId(authHeader: string): number {
    if (!authHeader) throw new UnauthorizedException('Token manquant');
    const token   = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, SECRET) as any;
    return decoded.user_id;
  }

  async findAll(authHeader: string) {
    const userId = this.getUserId(authHeader);


    const creditsClients = await this.db.query(
      `SELECT v.*,
        CONCAT(c.prenom, ' ', c.nom) as client_nom,
        c.tel as client_tel
       FROM ventes v
       LEFT JOIN clients c ON c.id = v.client_id
       WHERE v.user_id = ? AND v.credit > 0
       ORDER BY v.echeance ASC`,
      [userId]
    );


    const dettesFourn = await this.db.query(
      `SELECT l.*,
        f.nom as fournisseur_nom,
        p.nom as produit_nom
       FROM livraisons l
       JOIN fournisseurs f ON f.id = l.fournisseur_id
       JOIN produits p     ON p.id = l.produit_id
       WHERE l.user_id = ? AND l.credit > 0
       ORDER BY l.echeance ASC`,
      [userId]
    );

    return { creditsClients, dettesFourn };
  }


  async payerClient(venteId: number, montant: number, authHeader: string) {
    const userId = this.getUserId(authHeader);


    const ventes = await this.db.query(
      'SELECT * FROM ventes WHERE id = ? AND user_id = ?',
      [venteId, userId]
    ) as any[];

    if (ventes.length === 0) return { error: 'Vente introuvable' };

    const vente = ventes[0];


    if (montant > vente.credit) {
      return { error: 'Montant supérieur au crédit restant' };
    }


    const nouveauPaye   = parseFloat(vente.montant_paye) + montant;
    const nouveauCredit = Math.max(0, parseFloat(vente.credit) - montant);

    await this.db.query(
      'UPDATE ventes SET montant_paye = ?, credit = ? WHERE id = ? AND user_id = ?',
      [nouveauPaye, nouveauCredit, venteId, userId]
    );

    return { message: 'Paiement enregistré ✅' };
  }


  async payerFourn(livId: number, montant: number, authHeader: string) {
    const userId = this.getUserId(authHeader);


    const livraisons = await this.db.query(
      'SELECT * FROM livraisons WHERE id = ? AND user_id = ?',
      [livId, userId]
    ) as any[];

    if (livraisons.length === 0) return { error: 'Livraison introuvable' };

    const liv = livraisons[0];


    if (montant > liv.credit) {
      return { error: 'Montant supérieur à la dette restante' };
    }


    const nouveauPaye   = parseFloat(liv.montant_paye) + montant;
    const nouveauCredit = Math.max(0, parseFloat(liv.credit) - montant);

    await this.db.query(
      'UPDATE livraisons SET montant_paye = ?, credit = ? WHERE id = ? AND user_id = ?',
      [nouveauPaye, nouveauCredit, livId, userId]
    );

    return { message: 'Paiement enregistré ✅' };
  }
}