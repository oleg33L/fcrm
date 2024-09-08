import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let mockUserModel;

  beforeEach(async () => {
    mockUserModel = {
      create: jest
        .fn()
        .mockImplementation((user) => Promise.resolve({ id: 1, ...user })),
      findByPk: jest.fn().mockImplementation((id) =>
        Promise.resolve({
          id,
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          role: 'user',
        }),
      ),
      findOne: jest
        .fn()
        .mockImplementation(({ where: { email } }) =>
          Promise.resolve({ id: 1, email }),
        ),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user with hashed password', async () => {
    const userDto = {
      name: 'Test',
      email: 'test@example.com',
      phone: '+1234567890',
      password: 'password',
      role: 'user',
    };
    const result = await service.create(userDto);

    expect(mockUserModel.create).toHaveBeenCalled();
    expect(bcrypt.compareSync(userDto.password, result.password)).toBe(true);
  });

  it('should find a user by ID', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      role: 'user',
    });
  });

  it('should find a user by email', async () => {
    const result = await service.findByEmail('test@example.com');
    expect(result).toEqual({ id: 1, email: 'test@example.com' });
  });
});
