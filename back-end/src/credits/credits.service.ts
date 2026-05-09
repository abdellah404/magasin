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

    // Crédits clients — ventes avec crédit > 0
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

    // Dettes fournisseurs — livraisons avec crédit > 0
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

  // Enregistrer un paiement client
  async payerClient(venteId: number, montant: number, authHeader: string) {
    const userId = this.getUserId(authHeader);

    // Récupérer la vente
    const ventes = await this.db.query(
      'SELECT * FROM ventes WHERE id = ? AND user_id = ?',
      [venteId, userId]
    ) as any[];

    if (ventes.length === 0) return { error: 'Vente introuvable' };

    const vente = ventes[0];

    // Vérifier que le montant ne dépasse pas le crédit restant
    if (montant > vente.credit) {
      return { error: 'Montant supérieur au crédit restant' };
    }

    // Mettre à jour la vente
    const nouveauPaye   = parseFloat(vente.montant_paye) + montant;
    const nouveauCredit = Math.max(0, parseFloat(vente.credit) - montant);

    await this.db.query(
      'UPDATE ventes SET montant_paye = ?, credit = ? WHERE id = ? AND user_id = ?',
      [nouveauPaye, nouveauCredit, venteId, userId]
    );

    return { message: 'Paiement enregistré ✅' };
  }

  // Enregistrer un paiement fournisseur
  async payerFourn(livId: number, montant: number, authHeader: string) {
    const userId = this.getUserId(authHeader);

    // Récupérer la livraison
    const livraisons = await this.db.query(
      'SELECT * FROM livraisons WHERE id = ? AND user_id = ?',
      [livId, userId]
    ) as any[];

    if (livraisons.length === 0) return { error: 'Livraison introuvable' };

    const liv = livraisons[0];

    // Vérifier que le montant ne dépasse pas la dette restante
    if (montant > liv.credit) {
      return { error: 'Montant supérieur à la dette restante' };
    }

    // Mettre à jour la livraison
    const nouveauPaye   = parseFloat(liv.montant_paye) + montant;
    const nouveauCredit = Math.max(0, parseFloat(liv.credit) - montant);

    await this.db.query(
      'UPDATE livraisons SET montant_paye = ?, credit = ? WHERE id = ? AND user_id = ?',
      [nouveauPaye, nouveauCredit, livId, userId]
    );

    return { message: 'Paiement enregistré ✅' };
  }
}