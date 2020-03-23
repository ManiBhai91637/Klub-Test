export default function cred() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev') {
        return {
            port: 2000,
            db: {
                postgres: {
                    name: 'klub-test',
                    dialect: 'postgres',
                    username: 'postgres',
                    password: 'password',
                    host: 'localhost',
                    port: 5432,
                    seed: false
                }
            },
        }
    } else if (process.env.NODE_ENV === 'stage') {
        return {
            port: 80,
            db: {
                postgres: {
                    name: 'klub-test-stage',
                    dialect: 'postgres',
                    username: 'postgres',
                    password: 'stage-password',
                    host: 'localhost',
                    port: 5432,
                }
            },
        }
    } else if (process.env.NODE_ENV === 'prod') {
        return {
            port: 80,
            db: {
                postgres: {
                    name: 'klub-test-prod',
                    dialect: 'postgres',
                    username: 'postgres',
                    password: 'prod-password',
                    host: 'localhost',
                    port: 5432,
                    backup: true
                }
            },
        }
    }
}
