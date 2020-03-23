import sequelize from 'sequelize'
import cred from './constant'
// import logger from '../util/logger'

class postgresql {
    psql

    constructor() {
        this.psql = new sequelize(cred().db.postgres.name, cred().db.postgres.username, cred().db.postgres.password, {
            host: cred().db.postgres.host,
            port: cred().db.postgres.port,
            dialect: cred().db.postgres.dialect,
            dialectOptions: {
                useUTC: true
            },
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            timezone: 'UTC',
            operatorsAliases: false,
            logging: false,
            define: {  // Please don't remove it
                timestamps: true,
                underscored: true,
                freezeTableName: true,
            }
        }) 

        this.psql.sync({force: cred().db.postgres.seed})
            .then((connected) => {
                if (cred().db.postgres.seed) {
                    require('../seed').seed()
                }
                console.log(`Database connection established`)
            })
            .catch((err) => {    
                // logger.error(`There was an error while connecting to the database`)
                console.log(err)
                process.exit(1)
            })
    }
}

export default new postgresql().psql