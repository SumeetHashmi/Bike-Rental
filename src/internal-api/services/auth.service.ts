import { Db } from '../../database/db';
import { AppError } from '../../helpers/errors';
import { Logger } from '../../helpers/logger';
import * as AuthModel from '../../model/auth.model';
import { Entities, Hash } from '../../helpers';
import * as Token from '../../helpers/token';
import { generateOTP } from '../../helpers/otp';

export class AuthService {
  private db: Db;

  constructor(args: { db: Db }) {
    Logger.info('AuthService initialized...');
    this.db = args.db;
  }

  public async CreateUser(user: AuthModel.RegisterUserBody): Promise<AuthModel.Tokens> {
    /////////
    Logger.info('AuthService.CreateUser', { user });

    const hashedPassword = await Hash.hashPassword(user.password);
    user.password = hashedPassword;

    const fetchedUser = await this.db.User.CreateUser(user); ///////////////

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

    // Check if the user exists
    const fetchedUser = await this.db.User.GetUser({ email: user.email }, true); ////////////
    if (!fetchedUser) {
      throw new AppError(400, 'Invalid email or password');
    }

    // Verify the password
    if (!fetchedUser.password) throw new AppError(400, 'User not found');
    const isCorrectPassword = await Hash.verifyPassword(user.password, fetchedUser.password); /////////////
    if (!isCorrectPassword) throw new AppError(400, 'Invalid credentials');

    // Generate tokens
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

    // Check if the user exists
    const fetchedUser = await this.db.User.GetUser({ email });
    if (!fetchedUser) {
      throw new AppError(400, 'User not found');
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in the database or a cache with an expiration time
    await this.db.Auth.StoreOTP({ userId: fetchedUser.id, otp });

    // Send OTP to the user (email/SMS)
    //await EmailService.sendOTP(email, otp); // Assuming you have an EmailService to handle sending emails
  }
}
