var expect = require('chai').expect;

var UserRequest = require('../../models/UserRequest');

describe('UserRequest Model test', function () {

    it('should be invalid if name is empty', function (done) {
        let m = new UserRequest();

        m.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
    it('should be invalid if name is empty', function (done) {
        let m = new UserRequest();

        m.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
    it('should be invalid if leaveDate is empty', function (done) {
        let m = new UserRequest();

        m.validate(function (err) {
            expect(err.errors.leaveDate).to.exist;
            done();
        });
    });
    it('should be invalid if leaveCategory is empty', function (done) {
        let m = new UserRequest();

        m.validate(function (err) {
            expect(err.errors.leaveCategory).to.exist;
            done();
        });
    });
    it('should be invalid if leaveDescription is empty', function (done) {
        let m = new UserRequest();

        m.validate(function (err) {
            expect(err.errors.leaveDescription).to.exist;
            done();
        });
    });
    it('should be invalid if userid is empty', function (done) {
        let m = new UserRequest();

        m.validate(function (err) {
            expect(err.errors.userid).to.exist;
            done();
        });
    });
});