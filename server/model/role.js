import sequelize from 'sequelize'
import psql from '../config/db'
import User from './user'


class RoleModel {
    role

    constructor() {
        this.role = psql.define('role', {
            id: {
                type: sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: sequelize.STRING,
                unique: true
            },
            permissions: {
                type: sequelize.ARRAY(sequelize.STRING),
                defaultValue: ['get']
            }
        }) 
        User.belongsTo(this.role, {foreignKey: 'role_id'})
        this.role.hasMany(User, {foreignKey: 'role_id'})
    }
}

export default new RoleModel().role