import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';
import UserModel from '../database/models/Users.model';
import * as jwt from 'jsonwebtoken';
import { validLogin, invalidLoginEmail, invalidLoginPassword, notExistingUserBody, invalidLogin } from '../tests/mocks/login.mock';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Login Controller - Testes', function() {
  afterEach(() => {
    sinon.restore();
  });

  it('POST /login - deve fazer login com sucesso e retornar um token', async () => {
    sinon.stub(UserModel, 'findOne').resolves({
      id: 1,
      username: 'User',
      role: 'user',
      email: validLogin.email,
      password: validLogin.password,
    } as UserModel);

    sinon.stub(jwt, 'sign').callsFake((payload, secret, options, callback) => {
        if (typeof callback === 'function') {
          callback(null, 'valid_token'); 
        }
        return 'valid_token';
      });

    const response = await chai.request(app).post('/login').send(validLogin);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token', 'valid_token');
  });

  it('POST /login - deve retornar 400 quando o email não for enviado', async () => {
    const response = await chai.request(app).post('/login').send(invalidLoginEmail);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('POST /login - deve retornar 400 quando a senha não for enviada', async () => {
    const response = await chai.request(app).post('/login').send(invalidLoginPassword);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('POST /login - deve retornar 401 quando o usuário não for encontrado', async () => {
    sinon.stub(UserModel, 'findOne').resolves(null);

    const response = await chai.request(app).post('/login').send(notExistingUserBody);

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('POST /login - deve retornar 401 quando o email ou senha forem inválidos', async () => {
    sinon.stub(UserModel, 'findOne').resolves({
      id: 1,
      username: 'User',
      role: 'user',
      email: invalidLogin.email,
      password: invalidLogin.password,
    } as UserModel);

    const response = await chai.request(app).post('/login').send(invalidLogin);

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  });
});
