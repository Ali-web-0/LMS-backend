process.env.NODE_ENV = 'test';
const mongoose = require("mongoose")
const expect = require('chai').expect;
const request = require('supertest');
const testApp = require("../../config/keys").testApp
const app = require("../../app");

describe('UserRequest Api', () => {
    before((done) => {

        mongoose.connect(testApp, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log("connect to mongodb")
                done()
            }).catch(err => console.warn(err))

    })
    // POST TEST
    describe('USER REQUEST POST TEST', () => {
        it('OK, creating a new leave Request', (done) => {
            request('http://localhost:5000/users').post('/request')
                .set('Content-Type', 'application/json')
                .send({ name: 'ali', leaveDate: '01 / 01 / 2022', leaveCategory: 'sick', leaveDescription: 'sick', userid: '61d405f055b72a241bc4033d', manager: '61d405f055b72a241bc4033d' })
                .then((res) => {
                    const body = res.body
                    if (res.status === 201) {
                        expect(body.name).to.equal('ali')
                        expect(body.leaveDate).to.equal('1970-01-01T00:00:00.000Z')
                        expect(body.leaveCategory).to.equal('sick')
                        expect(body.leaveDescription).to.equal('sick')
                        expect(body.status).to.equal('Pending')
                        expect(body.userid).to.equal('61d405f055b72a241bc4033d')
                        expect(body.manager).to.equal('61d405f055b72a241bc4033d')
                        expect(body._id).to.equal('61d432d206625080d969b80e')
                        done()

                    }
                    else {
                        expect(body.errors[0].msg).to.equal('your leave request has been send')
                        done()
                    }

                })
                .catch((err) => done(err));
        });

        it('Fail Fail to new Leave Request', (done) => {
            request('http://localhost:5000/users').post('/request')
                .set('Content-Type', 'application/json')
                .send({ name: 'ali', leaveCategory: 'sick', leaveDescription: 'sick', userid: '61d405f055b72a241bc4033d', manager: '61d405f055b72a241bc4033d' })
                .then((res) => {
                    const body = res.body
                    expect(body.errors[0].msg).to.equal('Date is required')
                    done()

                })
                .catch((err) => done(err));

        })

    })
    // GET TEST
    describe('GET LEAVE REQUEST TEST', () => {
        it('Ok Get User Request', (done) => {
            request('http://localhost:5000/users').get('/request')
                .set('Content-Type', 'application/json')
                .then((res) => {
                    const body = res.body
                    expect(body.length).to.equal(1)
                    done()
                })
                .catch((err) => done(err));
        })
        it('Ok Get User By Id Request', (done) => {
            request('http://localhost:5000/users').get('/request/userleave/61d405f055b72a241bc4033d')
                .set('Content-Type', 'application/json')
                .then((res) => {
                    const body = res.body
                    expect(body.length).to.not.equal(0)

                    done()
                })
                .catch((err) => done(err));
        })
        it('Ok Get User By manager Id', (done) => {
            request('http://localhost:5000/users').get('/request/manageleave/61d405f055b72a241bc4033d')
                .set('Content-Type', 'application/json')
                .then((res) => {
                    const body = res.body
                    expect(body.length).to.not.equal(0)
                    done()
                })
                .catch((err) => done(err));
        })
    })
    // PATCH TEST
    describe('UPDATE LEAVE REQUEST TEST', () => {
        it('Ok Update User Request', (done) => {
            request('http://localhost:5000/users').patch('/request/61d432d206625080d969b80e')
                .send({ _id: '61d432d206625080d969b80e', name: 'ali', leaveCategory: 'casual leave', leaveDescription: 'sick', userid: '61d405f055b72a241bc4033d', manager: '61d405f055b72a241bc4033d' })
                .set('Content-Type', 'application/json')
                .then((res) => {
                    const body = res.body
                    expect(body.leaveCategory).to.equal('casual leave')
                    done()
                })
                .catch((err) => done(err));
        })

    })
    //  DELETE TEST
    describe('DELETE LEAVE REQUEST TEST', () => {
        it('Ok DELETE User Request', (done) => {
            request('http://localhost:5000/users').delete('/request/61d41e694fff9c35fa2399b6')
                .set('Content-Type', 'application/json')
                .then((res) => {
                    const body = res.body
                    expect(body).to.equal('User Deleted Successfully')
                    done()
                })
                .catch((err) => done(err));
        })

    })
})