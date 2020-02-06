import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';

const models = [User, File];

class Database {
   constructor() {
      this.init();
   }

   init() {
      this.connection = new Sequelize(databaseConfig);

      // cria todos os models e relacionado com o banco de dados
      models
         .map(model => model.init(this.connection))
         .map(
            model => model.associate && model.associate(this.connection.models)
         );
   }
}

export default new Database();
