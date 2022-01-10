const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('POST /api/solve, OK input', function (done) {
        const payload = {
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            output: '769235418851496372432178956174569283395842761628713549283657194516924837947381625'
        };

        chai
            .request(server)
            .post(`/api/solve`)
            .send({ puzzle: payload.puzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'solution');
                assert.equal(res.body.solution, payload.output);
                done();
            });
    });

    test('POST /api/solve, missing required fields', function (done) {
        const payload = {
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            output: 'Required field missing'
        };

        chai
            .request(server)
            .post(`/api/solve`)
            .send({ wrongpuzzle: payload.puzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, payload.output);
                done();
            });
    });

    test('POST /api/solve, invalid chars', function (done) {
        const payload = {
            puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            output: 'Invalid characters in puzzle'
        };

        chai
            .request(server)
            .post(`/api/solve`)
            .send({ puzzle: payload.puzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, payload.output);
                done();
            });
    });

    test('POST /api/solve, invalid length', function (done) {
        const payload = {
            puzzle: '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            output: 'Expected puzzle to be 81 characters long'
        };

        chai
            .request(server)
            .post(`/api/solve`)
            .send({ puzzle: payload.puzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, payload.output);
                done();
            });
    });

    test('POST /api/solve, puzzle cant be solved', function (done) {
        const payload = {
            puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            output: 'Puzzle cannot be solved'
        };

        chai
            .request(server)
            .post(`/api/solve`)
            .send({ puzzle: payload.puzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, payload.output);
                done();
            });
    });

    test('POST /api/check, OK input', function (done) {
        const payload = {
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: '7'
        };

        chai
            .request(server)
            .post(`/api/check`)
            .send({ puzzle: payload.puzzle, coordinate: payload.coordinate, value: payload.value})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'valid');
                assert.isTrue(res.body.valid);
                done();
            });
    });

    test('POST /api/check, invalid placement', function (done) {
        const payload = {
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            output: ['row', 'column'],
            coordinate: 'A1',
            value: '1'
        };

        chai
            .request(server)
            .post(`/api/check`)
            .send({ puzzle: payload.puzzle, coordinate: payload.coordinate, value: payload.value})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'valid');
                assert.isFalse(res.body.valid);
                assert.property(res.body, 'conflict');
                assert.isArray(res.body.conflict);
                assert.equal(res.body.conflict.length, payload.output.length);

                for (let [index, elem] of Object.entries(payload.output)) {
                    assert.include(payload.output, res.body.conflict[index]);
                }

                done();
            });
    });

    test('POST /api/check, override placement', function (done) {
        const payload = {
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'C3',
            value: '1'
        };

        chai
            .request(server)
            .post(`/api/check`)
            .send({ puzzle: payload.puzzle, coordinate: payload.coordinate, value: payload.value})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'valid');
                assert.isTrue(res.body.valid);
                done();
            });
    });

    test('POST /api/check, override placement', function (done) {
        const payload = {
            puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            output: 'Invalid characters in puzzle',
            coordinate: 'A1',
            value: '1'
        };

        chai
            .request(server)
            .post(`/api/check`)
            .send({ puzzle: payload.puzzle, coordinate: payload.coordinate, value: payload.value})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, payload.output);
                done();
            });
    });

    test('POST /api/check, invalid puzzle length', function (done) {
        const payload = {
            puzzle: '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            output: 'Expected puzzle to be 81 characters long',
            coordinate: 'A1',
            value: '1'
        };

        chai
            .request(server)
            .post(`/api/check`)
            .send({ puzzle: payload.puzzle, coordinate: payload.coordinate, value: payload.value})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, payload.output);
                done();
            });
    });

    test('POST /api/check, missing fields', function (done) {
        const payload = {
            puzzle: '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            output: 'Required field(s) missing',
            value: '1'
        };

        chai
            .request(server)
            .post(`/api/check`)
            .send({ puzzle: payload.puzzle, value: payload.value})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, payload.output);
                done();
            });
    });

    test('POST /api/check, invalid coordinate', function (done) {
        const payload = {
            puzzle: '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            output: 'Invalid coordinate',
            coordinate: 'XZ18',
            value: '7'
        };

        chai
            .request(server)
            .post(`/api/check`)
            .send({ puzzle: payload.puzzle, coordinate: payload.coordinate, value: payload.value})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, payload.output);
                done();
            });
    });

    test('POST /api/check, Invalid value', function (done) {
        const payload = {
            puzzle: '9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            output: 'Invalid value',
            coordinate: 'A1',
            value: 'X'
        };

        chai
            .request(server)
            .post(`/api/check`)
            .send({ puzzle: payload.puzzle, coordinate: payload.coordinate, value: payload.value})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, payload.output);
                done();
            });
    });

    test('POST /api/check, Good input', function (done) {
        const payload = {
            puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
            coordinate: 'A1',
            value: '7'
        };

        chai
            .request(server)
            .post(`/api/check`)
            .send({ puzzle: payload.puzzle, coordinate: payload.coordinate, value: payload.value})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body);
                assert.property(res.body, 'valid');
                assert.isTrue(res.body.valid);
                done();
            });

    });

});

