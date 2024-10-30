process.env.NODE_ENV = 'test';
const mongoose = require("mongoose")
const expect = require('chai').expect;
const request = require('supertest');
const testApp = require("../../config/keys").testApp
const app = require("../../app");

describe('LeaveType Api', () => {
    before((done) => {

        mongoose.connect(testApp, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log("connect to mongodb")
                done()
            }).catch(err => console.warn(err))

    })
    it('OK, creating a new leave', (done) => {
        request('http://localhost:5000/admin').post('/leave')
            .set('Content-Type', 'application/json')
            .send({ leaveType: 'sick', numberLeave: 12 })
            .then((res) => {
                const body = res.body
                if (res.status === 400) {
                    expect(body.errors[0].msg).to.equal('This Type Already Decleared')
                    done()

                } else {
                    expect(body.leaveType).to.equal('sick')
                    expect(body.numberLeave).to.equal(12)
                    done()
                }
            })
            .catch((err) => done(err));
    });
    it('Fail, fail create new leave', (done) => {
        request('http://localhost:5000/admin').post('/leave')
            .set('Content-Type', 'application/json')
            .send({ leaveType: 'casual leave' })
            .then((res) => {
                const body = res.body
                expect(body.message).to.equal('leavetype validation failed: numberLeave: Path `numberLeave` is required.')

                done()
            })
            .catch((err) => done(err));
    });
    it('OK, get All Leave', (done) => {
        request('http://localhost:5000/admin').get('/leave')
            .set('Content-Type', 'application/json')
            .then((res) => {
                const body = res.body
                expect(body.length).to.equal(1)
                done()
            })
            .catch((err) => done(err));
    });
    it('OK, get Leave By Id', (done) => {
        request('http://localhost:5000/admin').get('/leave/61d405f055b72a241bc4033d')
            .set('Content-Type', 'application/json')
            .then((res) => {
                const body = res.body
                expect(body.leaveType).to.equal('sick')
                expect(body.numberLeave).to.equal(12)
                done()
            })
            .catch((err) => done(err));
    });
    it('Fail,Fail get Leave By Id', (done) => {
        request('http://localhost:5000/admin').get('/leave/61d405f055b72a241bc4033a')
            .set('Content-Type', 'application/json')
            .then((res) => {
                const body = res.body
                expect(body).to.equal(null)
                done()
            })
            .catch((err) => done(err));
    });
    it('OK, Update Leave', (done) => {
        request('http://localhost:5000/admin').patch('/leave/61d405f055b72a241bc4033d')
            .set('Content-Type', 'application/json')
            .send({ _id: '61d405f055b72a241bc4033d', leaveType: 'sick', numberLeave: 12 })
            .then((res) => {
                const body = res.body
                expect(body.leaveType).to.equal('sick')
                done()
            })
            .catch((err) => done(err));
    });
    it('OK, Delete Leave', (done) => {
        request('http://localhost:5000/admin').delete('/leave/61d404c2cd10bf1f341e071c')
            .set('Content-Type', 'application/json')
            .then((res) => {
                const body = res.body
                expect(body).to.equal('User Deleted Successfully')
                done()
            })
            .catch((err) => done(err));
    });


})