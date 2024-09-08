import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { SequelizeModule } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          autoLoadModels: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const userService = app.get('UserService');
    await userService.create({
      name: 'Admin',
      email: 'admin@example.com',
      phone: '1234567890',
      password: bcrypt.hashSync('admin_password', 10),
      role: 'admin',
    });
  });

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', password: 'admin_password' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
  });

  afterAll(async () => {
    await app.close();
  });
});
