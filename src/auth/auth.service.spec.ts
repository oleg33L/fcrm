import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService;
  let mockJwtService;

  beforeEach(async () => {
    mockUserService = {
      findByEmail: jest.fn().mockImplementation((email) =>
        Promise.resolve({
          id: 1,
          email,
          password: bcrypt.hashSync('password', 10),
        }),
      ),
    };

    mockJwtService = {
      sign: jest.fn().mockImplementation((payload) => 'test-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate a user and return the user data', async () => {
    const result = await service.validateUser('test@example.com', 'password');
    expect(result).toEqual({ id: 1, email: 'test@example.com' });
  });

  it('should return null if password is invalid', async () => {
    const result = await service.validateUser(
      'test@example.com',
      'wrongpassword',
    );
    expect(result).toBeNull();
  });

  it('should return a JWT token for a valid user', async () => {
    const result = await service.login({ email: 'test@example.com', id: 1 });
    expect(result).toEqual({ access_token: 'test-jwt-token' });
  });
});
