import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import UserModel from '../database/models/Users.model';

const secret = process.env.JWT_SECRET || 'seuSegredoJWT';

class AuthController {
  public static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    // Valida se todos os campos estão preenchidos
    if (!AuthController.areFieldsFilled(email, password)) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    // Valida o formato do email e o tamanho da senha
    if (!AuthController.isEmailValid(email) || !AuthController.isPasswordValid(password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    try {
      const user = await UserModel.findOne({ where: { email } });

      // Valida a existência do usuário e se a senha está correta
      if (!user || !AuthController.isPasswordCorrect(password, user.password)) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Gera e retorna o token JWT
      const token = AuthController.generateToken(user.id, user.role);
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  private static areFieldsFilled(email: string, password: string): boolean {
    return !!email && !!password;
  }

  private static isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isPasswordValid(password: string): boolean {
    return password.length >= 6;
  }

  private static isPasswordCorrect(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  private static generateToken(id: number, role: string): string {
    return jwt.sign({ id, role }, secret, { expiresIn: '1d' });
  }
}

export default AuthController;
