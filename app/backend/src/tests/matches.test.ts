import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { App } from '../app';
import MatchesModel from '../database/models/Match.model';
import { matchMock, matchesMock, newMatch, createdMatch, updateMatch } from './mocks/matches.mock';

chai.use(chaiHttp);

const { app } = new App();
const { expect } = chai;

describe('Matches Controller - Testes', function() {
  afterEach(() => {
    sinon.restore(); // Limpa todos os stubs após cada teste
  });

  it('GET /matches - deve retornar todas as partidas', async () => {
    sinon.stub(MatchesModel, 'findAll').resolves(matchesMock as unknown as MatchesModel[]);

    const response = await chai.request(app).get('/matches');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal(matchesMock);
  });

  it('POST /matches - deve criar uma nova partida', async () => {
    sinon.stub(MatchesModel, 'create').resolves(createdMatch as unknown as MatchesModel);

    const response = await chai.request(app).post('/matches').send(newMatch);

    expect(response.status).to.equal(201);
    expect(response.body).to.deep.equal(createdMatch);
  });

  it('PATCH /matches/:id - deve atualizar uma partida', async () => {
    sinon.stub(MatchesModel, 'update').resolves([1] as any); // Mock para simular a atualização bem-sucedida

    const response = await chai.request(app).patch('/matches/1').send(updateMatch);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ message: 'Updated successfully' });
  });

  it('DELETE /matches/:id - deve deletar uma partida', async () => {
    sinon.stub(MatchesModel, 'destroy').resolves(1 as any); // Mock para simular a deleção bem-sucedida

    const response = await chai.request(app).delete('/matches/1');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({ message: 'Deleted successfully' });
  });
});
