const client = require('../lib/client');
// import our seed data:
const teas = require('./teas.js');
const usersData = require('./users.js');
const categoriesData = require('./categories.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );

    await Promise.all(
      categoriesData.map(category => {
        return client.query(`
                      INSERT INTO categories (name)
                      VALUES ($1)
                      RETURNING *;
                  `,
        [category.category]);
      })
    );  
    
    const user = users[0].rows[0];

    await Promise.all(
      teas.map(tea => {
        return client.query(`
        INSERT INTO teas (name, image, description, price, aged, category_id, owner_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
        [
          tea.name, 
          tea.image, 
          tea.description, 
          tea.price, 
          tea.aged, 
          tea.category_id, 
          user.id
        ]);
      })
    );
  
    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
