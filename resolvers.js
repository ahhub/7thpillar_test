const { Pool } = require('pg');
const { ApolloError } = require('apollo-server');

const pool = new Pool({
  connectionString: 'postgres://postgres:123ajith@localhost:5432/restaurants',
});

module.exports = {
  Query: {
    restaurants: async (_, filters) => {
      try {
        const restaurants = await getRestaurants(filters);
        return restaurants;
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
};

const getRestaurants = async (filters) => {
  let num = 1;
  let values = [];
  let tempString = 'WHERE ';
  for (const each in filters) {
    tempString += each + '=' + `($${num})` + ' AND ';
    values.push(filters[each]);
    num++;
  }
  let queryString = tempString.slice(0, -5);
  try {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM propono_places ${queryString}`,
        values
      );
      // console.log(rows.length);
      return rows;
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    throw new Error('Error fetching restaurants from the database');
  }
};
