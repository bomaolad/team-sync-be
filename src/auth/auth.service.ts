import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, AuthResponseDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  register(registerDto: RegisterDto): Promise<AuthResponseDto> {
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
          ...registerDto,
          password: hashedPassword,
        });
      })
      .then((user) => {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
          accessToken: this.jwtService.sign(payload),
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
