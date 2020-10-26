if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null

  // the application is executed on Heroku ... use the postgres database
  sequelize = new Sequelize(process.env.databaseUrl, {
    dialect:  'postgres',
    protocol: 'postgres',
    port:     5432,
    host:     process.env.databaseHost,
    ssl: true,
    "dialectOptions":{ "ssl": {"require":true } },
    logging:  true //false
  });

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Product:      sequelize.import(__dirname + '/product') 
    // add your other models here
  }
  /*
    Associations can be defined here. E.g. like this:
    global.db.User.hasMany(global.db.SomethingElse)
  */
}

module.exports = global.db
