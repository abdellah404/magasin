import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {

  constructor(
    private db: DatabaseService,
    private jwt: JwtService,
  ) {}

  async register(
    prenom: string,
    nom: string,
    shopName: string,
    city: string,
    email: string,
    password: string,
  ) {
    const existing = await this.db.query(
      'SELECT id FROM users WHERE email = ?', [email]
    ) as any[];

    if (existing.length > 0) {
      return { error: 'Cet email est déjà utilisé' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.db.query(
      `INSERT INTO users (prenom, nom, shop_name, city, email, password)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [prenom, nom, shopName, city, email, hashedPassword]
    );

    return { message: 'Compte créé avec succès' };
  }

  async login(email: string, password: string) {

    const users = await this.db.query(
      'SELECT * FROM users WHERE email = ?', [email]
    ) as any[];

    if (users.length === 0) {
      return { error: 'Email introuvable' };
    }

    const user = users[0];

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return { error: 'Mot de passe incorrect' };
    }

    const token = this.jwt.sign({
      user_id: user.id,
    });

    return {
      token,
      prenom: user.prenom,
      shopName: user.shop_name,
    };
  }
}