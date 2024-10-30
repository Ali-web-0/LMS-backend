var expect = require('chai').expect;

var LeaveTypes = require('../../models/LeaveTypes');

describe('LeaveType Model test', function () {

    it('should be invalid if leaveType is empty', function (done) {
        let m = new LeaveTypes();

        m.validate(function (err) {
            expect(err.errors.leaveType).to.exist;
            done();
        });
    });
    it('should be invalid if numberLeave is empty', function (done) {
        let m = new LeaveTypes();

        m.validate(function (err) {
            expect(err.errors.numberLeave).to.exist;
            done();
        });
    });
});