const Request = require('request');
const userService =  require('../../server/api/services/user');
const config = require("../../server/config/index.js")
const baseUrl = `http://localhost:3000`
import authService from "../../server/auth/auth.service.js";
const faker = require('faker');
const token = `Bearer ${authService.signToken(1)}`;

describe('User Management : -', () => {

    const data = {};

    describe('Sign up', () => {
        const newRequestObj = {
            url: `${baseUrl}/auth/user`,
            headers: { 'content-type': 'application/json' },
            json: true,
            body: {
                "email": faker.internet.email(),
                "password": "password",
                "first_name": "Manish",
                "last_name": "Srivastava"
            }
        }
        beforeAll((done) => {
            Request.post(newRequestObj, (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        it('should return 200 and service function called with correct body', () => {
            expect(data.status).toBe(200);
        });
    })

    describe('Sign up failure, email already exist', () => {
        const newRequestObj = {
            url: `${baseUrl}/auth/user`,
            headers: { 'content-type': 'application/json' },
            json: true,
            body: {
                "email": "superadmin@klub.com",
                "password": "password",
                "first_name": "Manish",
                "last_name": "Srivastava"
            }
        }
        beforeAll((done) => {
            Request.post(newRequestObj, (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        it('Should throw a conflict error with email already exist', () => {
            expect(data.status).toBe(409);
        });
    })

    describe('User login failure, Email Not Registered', () => {

        const requestObj = {
            url: `${baseUrl}/auth/local`,
            headers: { 'content-type': 'application/json' },
            json: true,
            body: {
                "email": "manikfbcks8638sh1@cronj.com",
                "password": "password",
            }
        }
        beforeAll((done) => {
            Request.post(requestObj, (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        it('should return 401 as email Not Registered', () => {
            expect(data.status).toBe(401);
        });
    })

    describe('User login failure, User not approved', () => {

        const requestObj = {
            url: `${baseUrl}/auth/local`,
            headers: { 'content-type': 'application/json' },
            json: true,
            body: {
                "email": "manish1@cronj.com",
                "password": "password",
            }
        }
        beforeAll((done) => {
            Request.post(requestObj, (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        it('should return 401, User not approved yet', () => {
            expect(data.status).toBe(401);
        });
    })

    describe('User login success', () => {

        const requestObj = {
            url: `${baseUrl}/auth/local`,
            headers: { 'content-type': 'application/json' },
            json: true,
            body: {
                "email": "superadmin@klub.com",
                "password": "password",
            }
        }
        beforeAll((done) => {
            Request.post(requestObj, (error, response, body) => {
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        it('should return 200, login success', () => {
            console.log('data.status', data.status)
            expect(data.status).toBe(200);
        });
    })
})


