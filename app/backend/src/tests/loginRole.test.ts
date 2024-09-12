import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';
import * as jwt from 'jsonwebtoken';
import { validToken, invalidToken, userRole, invalidTokenError, tokenNotFoundError } from '../tests/mocks/loginRole.mock';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Login Role Controller - Testes', function() {
  afterEach(() => {
    sinon.restore();
  });

  it('GET /login/role - deve retornar a role do usuário com token válido', async () => {
    sinon.stub(jwt, 'verify').callsFake(() => ({ role: userRole.role }));

    const response = await chai.request(app).get('/login/role').set('Authorization', validToken);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(userRole);
  });

  it('GET /login/role - deve retornar 401 quando o token não for enviado', async () => {
    const response = await chai.request(app).get('/login/role');

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal(tokenNotFoundError);
  });

  it('GET /login/role - deve retornar 401 quando o token for inválido', async () => {
    sinon.stub(jwt, 'verify').throws(new Error(invalidTokenError.message));

    const response = await chai.request(app).get('/login/role').set('Authorization', invalidToken);

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal(invalidTokenError);
  });
});
