require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns all teas', async() => {

      const expectation = [
        {
          id: 1, 
          name: 'Da Hong Pao',
          image: 'dahongpao.jpg',
          description: 'roasted rock tea from Wuyi Mountain',
          category: 'Yancha',
          price: 35,
          aged: false,
          owner_id: 1
        },
        {
          id: 2, 
          name: 'Ali Shan',
          image: 'alishan.jpg',
          description: 'floral lightly oxidized from Ali Mountain',
          category: 'Taiwanese Oolong',
          price: 35,
          aged: false,
          owner_id: 1
        },
        {
          id: 3, 
          name: 'Gardenia Frangrence',
          image: 'gardenia.jpg',
          description: 'fruity and floral Phoenix single-bush',
          category: 'Dancong',
          price: 40,
          aged: false,
          owner_id: 1
        },
        {
          id: 4, 
          name: 'Huang Zhi Xiang',
          image: 'orange.jpg',
          description: 'fruity and floral Phoenix single-bush',
          category: 'Dancong',
          price: 45,
          aged: false,
          owner_id: 1
        },
        {
          id: 5, 
          name: 'Rou Gui',
          image: 'rougui.jpg',
          description: 'roated spicy cinnamon bark flavor',
          category: 'Yancha',
          price: 25,
          aged: false,
          owner_id: 1
        },
        {
          id: 6, 
          name: 'Jin Xuan',
          image: 'jinxuan.jpg',
          description: 'smooth and light roasting',
          category: 'Taiwanese Oolong',
          price: 40,
          aged: false,
          owner_id: 1
        },
        {
          id: 7, 
          name: 'Tieguanyin',
          image: 'tieguanyin.jpg',
          description: 'roasted grain followed by verdant notes',
          category: 'Rolled Oolong',
          price: 27,
          aged: false,
          owner_id: 1
        },
        {
          id: 8, 
          name: 'Jingmai Gushu',
          image: 'puerh.jpg',
          description: 'mellow, vegetal base, matcha',
          category: 'Pu\'erh',
          price: 20,
          aged: true,
          owner_id: 1
        },
        {
          id: 9, 
          name: 'Bingdao',
          image: 'bingdao.jpg',
          description: 'strawberry, bamboo shoots, beeswax',
          category: 'Pu\'erh',
          price: 40,
          aged: true,
          owner_id: 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/teas')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns a single tea with id of 2', async() => {

      const expectation = 
        {
          id: 2, 
          name: 'Ali Shan',
          image: 'alishan.jpg',
          description: 'floral lightly oxidized from Ali Mountain',
          category: 'Taiwanese Oolong',
          price: 35,
          aged: false,
          owner_id: 1
        };

      const data = await fakeRequest(app)
        .get('/teas/2')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns all teas with category of Yancha', async() => {

      const expectation = [
        {
          id: 1, 
          name: 'Da Hong Pao',
          image: 'dahongpao.jpg',
          description: 'roasted rock tea from Wuyi Mountain',
          category: 'Yancha',
          price: 35,
          aged: false,
          owner_id: 1
        },
        {
          id: 5, 
          name: 'Rou Gui',
          image: 'rougui.jpg',
          description: 'roated spicy cinnamon bark flavor',
          category: 'Yancha',
          price: 25,
          aged: false,
          owner_id: 1
        },
      ];

      const data = await fakeRequest(app)
        .get('/teas/category/Yancha')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

  });
});
