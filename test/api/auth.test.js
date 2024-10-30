process.env.NODE_ENV = 'test';
const mongoose = require("mongoose")
const expect = require('chai').expect;
const request = require('supertest');
const testApp = require("../../config/keys").testApp
const app = require("../../app");

describe('auth api', () => {
    before((done) => {

        mongoose.connect(testApp, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log("connect to mongodb")
                done()
            }).catch(err => console.warn(err))

    })
    it('OK, creating a new user', (done) => {
        request('http://localhost:5000/users').post('/')
            .set('Content-Type', 'application/json')
            .send({ name: "Ali", email: "ali01122@gmail.com", password: "12345678", datepicker: "01/01/2022", manager: "61cb0a29768247bf71b02e59" })
            .then((res) => {
                const body = res.body
                if (res.status == 400) {
                    expect(res.body.errors[0].msg).to.equal('User already exists')
                    done();
                }
                else {
                    expect(body).to.contain.property('token');
                    done();
                }

            })
            .catch((err) => done(err));
    });
    it('Fail, registration fail', (done) => {
        request('http://localhost:5000/users').post('/')
            .set('Content-Type', 'application/json')
            .send({ name: "Ali", email: "ali01122@gmail.com", datepicker: "01/01/2022", manager: "61cb0a29768247bf71b02e59" })
            .then((res) => {
                const body = res.body
                if (body.errors.length > 0) {
                    expect(body.errors[0].msg).to.equal('Please enter password with 6 or more characters');
                    done()
                }

            })
            .catch((err) => done(err));
    });
    it('OK, should be back auth user status', (done) => {
        request('http://localhost:5000/users').get('/auth')
            .set('Content-Type', 'application/json')
            .then((res) => {
                const body = res.body;
                expect(body.msg).to.equal('No token, authorization denied')
                done()

            })
            .catch((err) => done(err));
    });
    // it('OK, get All user', (done) => {
    //     request('http://localhost:5000/users').get('/auth/alluser')
    //         .set('Content-Type', 'application/json')
    //         .then((res) => {
    //             const body = res.body;
    //             console.log(body.length)
    //             expect(body.length).to.equal(1)
    //             done()

    //         })
    //         .catch((err) => done(err));
    // });

    it('OK, Login Test', (done) => {
        request('http://localhost:5000/users').post('/auth')
            .set('Content-Type', 'application/json')
            .send({ email: "ali01122@gmail.com", password: "12345678" })
            .then((res) => {
                const body = res.body
                expect(body.token).to.exist;
                done()
            })
            .catch((err) => done(err));
    });
    it('OK, Login Fail', (done) => {
        request('http://localhost:5000/users').post('/auth')
            .set('Content-Type', 'application/json')
            .send({ email: "ali01122@gmail.com" })
            .then((res) => {
                const body = res.body
                expect(body.errors[0].msg).to.equal('Password is required')
                done()
            })
            .catch((err) => done(err));
    });


})