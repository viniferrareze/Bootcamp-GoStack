import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/User';

const models = [User];

class Database {
   constructor() {
      this.init();
   }

   init() {
      this.connection = new Sequelize(databaseConfig);

      // cria todos os models e relacionado com o banco de dados
      models.map(model => model.init(this.connection));
   }
}

export default new Database();
