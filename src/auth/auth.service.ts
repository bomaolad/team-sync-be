import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import {
  RegisterDto,
  LoginDto,
  AuthResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  MessageResponseDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { firstName, lastName } = registerDto;

    return this.usersService
      .findByEmail(registerDto.email)
      .then((existingUser) => {
        if (existingUser) {
          throw new ConflictException('Email already registered');
        }
        return bcrypt.hash(registerDto.password, 10);
      })
      .then((hashedPassword) => {
        return this.usersService.create({
          email: registerDto.email,
          password: hashedPassword,
          firstName,
          lastName,
          username: registerDto.username,
          jobTitle: registerDto.jobTitle,
        });
      })
      .then((user) => {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
          accessToken: this.jwtService.sign(payload),
          message: 'Account created successfully!',
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        };
      });
  }

  login(loginDto: LoginDto): Promise<AuthResponseDto> {
    let foundUser: any;

    return this.usersService
      .findByEmail(loginDto.email)
      .then((user) => {
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
        foundUser = user;
        return bcrypt.compare(loginDto.password, user.password);
      })
      .then((isPasswordValid) => {
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
        const payload = {
          sub: foundUser.id,
          email: foundUser.email,
          role: foundUser.role,
        };
        return {
          accessToken: this.jwtService.sign(payload),
          message: 'Welcome back!',
          user: {
            id: foundUser.id,
            email: foundUser.email,
            firstName: foundUser.firstName,
            lastName: foundUser.lastName,
            role: foundUser.role,
          },
        };
      });
  }

  forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.usersService
      .findByEmail(forgotPasswordDto.email)
      .then((user) => {
        if (!user) {
          return {
            message:
              'If an account exists with this email, a password reset link has been sent.',
          };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000);

        return this.usersService
          .update(user.id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires,
          })
          .then(() => {
            console.log(
              `Password reset token for ${user.email}: ${resetToken}`,
            );
            return {
              message:
                'If an account exists with this email, a password reset link has been sent.',
            };
          });
      });
  }

  resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.usersService
      .findByResetToken(resetPasswordDto.token)
      .then((user) => {
        if (!user) {
          throw new BadRequestException('Invalid or expired reset token');
        }

        if (user.resetPasswordExpires < new Date()) {
          throw new BadRequestException('Reset token has expired');
        }

        return bcrypt
          .hash(resetPasswordDto.newPassword, 10)
          .then((hashedPassword) => {
            return this.usersService.update(user.id, {
              password: hashedPassword,
              resetPasswordToken: undefined,
              resetPasswordExpires: undefined,
            });
          });
      })
      .then(() => {
        return { message: 'Password reset successfully!' };
      });
  }

  validateUser(email: string, password: string): Promise<any> {
    return this.usersService.findByEmail(email).then((user) => {
      if (!user) {
        return null;
      }
      return bcrypt.compare(password, user.password).then((isPasswordValid) => {
        if (isPasswordValid) {
          const { password: _, ...result } = user;
          return result;
        }
        return null;
      });
    });
  }
}
