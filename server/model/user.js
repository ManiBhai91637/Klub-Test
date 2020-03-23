import sequelize from 'sequelize'
import psql from '../config/db'
import crypto from 'crypto';


class UserModel {
    user

    constructor() {
        this.user = psql.define('user', {
            id: {
                type: sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            first_name: {
                type: sequelize.STRING,
                allowNull: false
            },
            last_name: {
                type: sequelize.STRING,
            },
            email: {
                type: sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: sequelize.STRING,
            },
            is_active: {
                type: sequelize.BOOLEAN,
                defaultValue: true
            },
            salt: {
                type: sequelize.STRING,
            }
        }) 

        this.user.beforeCreate((user, options) => {
            return new Promise ((resolve, reject) =>{
                return user.updatePassword()
                .then(updted =>{
                    return resolve(user, options)
                })
                .catch(err =>{
                    return reject(err)
                })

            })
            
        });

        this.user.beforeUpdate((user, options)=> {
            if(user.changed('password')) {
                return new Promise ((resolve, reject) =>{
                    return user.updatePassword()
                    .then(updted =>{
                        return resolve(user, options)
                    })
                    .catch(err =>{
                        return reject(err)
                    })
                })
            }
        })

        this.user.associate = function () {

        }

        this.user.prototype.authenticate = function(password, callback)  {
            if(!callback)
                return this.password=== this.encryptPassword(password);
            let _this= this;
            this.encryptPassword(password, (err, pwdGen) => {
                if(err)
                    callback(err);
                if(_this.password== pwdGen) {
                    callback(null, true);
                }
                else {
                    callback(null, false);
                }
            })
        }

        this.user.prototype.makeSalt = function(byteSize, callback) {
            let defaultByteSize= 16;
            if(typeof arguments[0] === 'function'){
                callback= arguments[0];
                byteSize= defaultByteSize;
            }

            if(!byteSize)
                byteSize = defaultByteSize;

            if(!callback)
                return crypto.randomBytes(byteSize).toString('base64');

            return crypto.randomBytes(byteSize, (err, salt)=> {
                if(err)
                    callback(err);
                return callback(null, salt.toString('base64'));
            })

        }

        this.user.prototype.encryptPassword = function(password, callback)  {
            if(!password)
                return null
            if(typeof arguments[0] === 'function'){
                callback= arguments[0];
                callback("No password", null);
            }
            if(!this.salt)
                callback(null, password)
            let defaultIterations = 10000;
            let defaultKeyLength = 64;
            let salt = new Buffer(this.salt, 'base64');

            if (!callback)
                return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength).toString('base64');
            crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha1', (err, key) => {
                if(err)
                    callback(err);
                callback(null, key.toString('base64'));
            })

        }

        this.user.prototype.updatePassword = function(cb) {
            return new Promise ((resolve, reject) =>{
                if(this.password){

                     // Make salt with a callback
                    var _this = this;
                    this.makeSalt(function(saltErr, salt)  {
                        if(saltErr)
                            return reject(saltErr)
                        _this.salt = salt;
                        _this.encryptPassword(_this.password, function(encryptErr, hashedPassword) {
                            if(encryptErr)
                                return reject(encryptErr)
                            _this.password = hashedPassword;
                            return resolve({success: true, message: 'Password hashed'})
                        })
                    })
                } else {
                    return resolve ({success: true, message: 'Empty Password hashed'})
                }
            })
        }
    }
}

export default new UserModel().user