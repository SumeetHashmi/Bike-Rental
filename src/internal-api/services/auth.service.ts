import { Db } from '../../database/db';
import { AppError } from '../../helpers/errors';
import { Logger } from '../../helpers/logger';
import * as AuthModel from '../../model/auth.model';
import { Entities, Hash } from '../../helpers';
import * as Token from '../../helpers/token';
import { generateOTP } from '../../helpers/otp';
import { EmailService } from './email.service';

export class AuthService {
  private db: Db;
  private emailService: EmailService;

  constructor(args: { db: Db }) {
    Logger.info('AuthService initialized...');
    this.db = args.db;
    this.emailService = new EmailService();
  }

  public async CreateUser(user: AuthModel.RegisterUserBody): Promise<AuthModel.Tokens> {
    Logger.info('AuthService.CreateUser', { user });

    const hashedPassword = await Hash.hashPassword(user.password);
    user.password = hashedPassword;

    const fetchedUser = await this.db.User.CreateUser(user);

    const dataForToken = { id: fetchedUser };

    const accessToken = Token.createAccessToken(dataForToken);
    const refreshToken = Token.createRefreshToken(dataForToken);

    const token: AuthModel.Tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return token;
  }

  public async LoginUser(user: AuthModel.LoginUser): Promise<AuthModel.Tokens> {
    Logger.info('AuthService.LoginUser', { user });

    const fetchedUser = await this.db.User.GetUser({ email: user.email });
    if (!fetchedUser) {
      throw new AppError(400, 'Invalid email or password');
    }

    const isCorrectPassword = await Hash.verifyPassword(user.password, fetchedUser.password);
    if (!isCorrectPassword) throw new AppError(400, 'Invalid credentials');

    const dataForToken = { id: fetchedUser.id };
    const accessToken = Token.createAccessToken(dataForToken);
    const refreshToken = Token.createRefreshToken(dataForToken);

    const token: AuthModel.Tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    return token;
  }

  public async GenerateOTP(email: string): Promise<void> {
    Logger.info('AuthService.GenerateOTP', { email });

    const fetchedUser = await this.db.User.GetUser({ email });
    if (!fetchedUser) {
      throw new AppError(400, 'User not found');
    }

    const otp = generateOTP();

    await this.db.Auth.StoreOTP({ userId: fetchedUser.id, otp });
    await this.emailService.SentCodeToUserEmail(fetchedUser.email, otp);
  }

  async VerifyRecovery(email: string, otp: number): Promise<void> {
    Logger.info('AuthService.VerifyRecovery', { otp, email });

    const fetchedUser = await this.db.User.GetUser({ email });
    if (!fetchedUser) throw new AppError(400, 'User does not exist');

    const response = await this.db.Auth.GetRecoveryOtp({ userId: fetchedUser.id, otp: otp });
    if (!response) throw new AppError(400, 'Incorrect code try again or otp expired');
  }
}
