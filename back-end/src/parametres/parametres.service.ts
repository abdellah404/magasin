import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

const SECRET = 'dukan_secret_key_2024';

@Injectable()
export class ParametresService {

  constructor(private db: DatabaseService) {}

  private getUserId(authHeader: string): number {
    if (!authHeader) throw new UnauthorizedException('Token manquant');
    const token   = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, SECRET) as any;
    return decoded.user_id;
  }

  // Récupérer les infos du user connecté
  async findOne(authHeader: string) {
    const userId = this.getUserId(authHeader);
    const users  = await this.db.query(
      'SELECT id, prenom, nom, email, shop_name, city FROM users WHERE id = ?',
      [userId]
    ) as any[];

    if (users.length === 0) return { error: 'Utilisateur introuvable' };
    return users[0];
  }

  // Modifier les infos du user connecté
  async update(body: any, authHeader: string) {
    const userId = this.getUserId(authHeader);

    // Modifier les infos de base
    await this.db.query(
      `UPDATE users SET prenom=?, nom=?, shop_name=?, city=?
       WHERE id=?`,
      [body.prenom, body.nom, body.shop_name, body.city, userId]
    );

    // Si l'utilisateur veut changer le mot de passe
    if (body.nouveau_password) {

      // Vérifier l'ancien mot de passe
      const users = await this.db.query(
        'SELECT password FROM users WHERE id = ?', [userId]
      ) as any[];

      const isValid = await bcrypt.compare(body.ancien_password, users[0].password);
      if (!isValid) return { error: 'Ancien mot de passe incorrect' };

      // Hasher et sauvegarder le nouveau
      const hashed = await bcrypt.hash(body.nouveau_password, 10);
      await this.db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashed, userId]
      );
    }

    return { message: 'Paramètres enregistrés ' };
  }
}