import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { SequelizeModule } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

describe('UserController (e2e)', () => {
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
  });

  it('/api/v1/add-user (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/add-user')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        password: 'securepassword',
        role: 'user',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John Doe');
    expect(bcrypt.compareSync('securepassword', response.body.password)).toBe(
      true,
    );
  });

  it('/api/v1/get-user/:id (GET)', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/get-user/1',
    );
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('John Doe');
  });

  afterAll(async () => {
    await app.close();
  });
});
