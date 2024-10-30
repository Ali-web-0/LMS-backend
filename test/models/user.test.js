var expect = require('chai').expect;

var User = require('../../models/User');

describe('User Model test', function () {

    it('should be invalid if email is empty', function (done) {
        let m = new User();

        m.validate(function (err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });
    it('should be invalid if email is empty', function (done) {
        let m = new User();

        m.validate(function (err) {
            expect(err.errors.email).to.exist;
            done();
        });
    });
    it('should be invalid if password is empty', function (done) {
        let m = new User();

        m.validate(function (err) {
            expect(err.errors.password).to.exist;
            done();
        });
    });
    it('should be invalid if datepicker is empty', function (done) {
        let m = new User();

        m.validate(function (err) {
            expect(err.errors.datepicker).to.exist;
            done();
        });
    });

});