import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';
import TeamsModel from '../database/models/Team.model';
import { teamsMock, teamMock } from '../tests/mocks/team.mock';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Teams Controller - Testes', function() {
  let findAllStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;

  // Restaurar os stubs após cada teste
  afterEach(() => {
    sinon.restore();
  });

  it('GET /teams - deve retornar todos os times com status 200', async () => {
    findAllStub = sinon.stub(TeamsModel, 'findAll').resolves(teamsMock as TeamsModel[]);

    const response = await chai.request(app).get('/teams');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(teamsMock);
  });

  it('GET /teams/:id - deve retornar um time específico com status 200', async () => {
    findByPkStub = sinon.stub(TeamsModel, 'findByPk').resolves(teamMock as TeamsModel);

    const response = await chai.request(app).get('/teams/1');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(teamMock);
  });

  it('GET /teams/:id - deve retornar 404 se o time não for encontrado', async () => {
    findByPkStub = sinon.stub(TeamsModel, 'findByPk').resolves(null);

    const response = await chai.request(app).get('/teams/999');

    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal({ message: 'Team not found' });
  });
});
