'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Report = mongoose.model('Report'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, report;

/**
 * Report routes tests
 */
describe('Report CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Report
    user.save(function () {
      report = {
        name: 'Report name'
      };

      done();
    });
  });

  it('should be able to save a Report if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Report
        agent.post('/api/reports')
          .send(report)
          .expect(200)
          .end(function (reportSaveErr, reportSaveRes) {
            // Handle Report save error
            if (reportSaveErr) {
              return done(reportSaveErr);
            }

            // Get a list of Reports
            agent.get('/api/reports')
              .end(function (reportsGetErr, reportsGetRes) {
                // Handle Report save error
                if (reportsGetErr) {
                  return done(reportsGetErr);
                }

                // Get Reports list
                var reports = reportsGetRes.body;

                // Set assertions
                (reports[0].user._id).should.equal(userId);
                (reports[0].name).should.match('Report name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Report if not logged in', function (done) {
    agent.post('/api/reports')
      .send(report)
      .expect(403)
      .end(function (reportSaveErr, reportSaveRes) {
        // Call the assertion callback
        done(reportSaveErr);
      });
  });

  it('should not be able to save an Report if no name is provided', function (done) {
    // Invalidate name field
    report.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Report
        agent.post('/api/reports')
          .send(report)
          .expect(400)
          .end(function (reportSaveErr, reportSaveRes) {
            // Set message assertion
            (reportSaveRes.body.message).should.match('Please fill Report name');

            // Handle Report save error
            done(reportSaveErr);
          });
      });
  });

  it('should be able to update an Report if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Report
        agent.post('/api/reports')
          .send(report)
          .expect(200)
          .end(function (reportSaveErr, reportSaveRes) {
            // Handle Report save error
            if (reportSaveErr) {
              return done(reportSaveErr);
            }

            // Update Report name
            report.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Report
            agent.put('/api/reports/' + reportSaveRes.body._id)
              .send(report)
              .expect(200)
              .end(function (reportUpdateErr, reportUpdateRes) {
                // Handle Report update error
                if (reportUpdateErr) {
                  return done(reportUpdateErr);
                }

                // Set assertions
                (reportUpdateRes.body._id).should.equal(reportSaveRes.body._id);
                (reportUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Reports if not signed in', function (done) {
    // Create new Report model instance
    var reportObj = new Report(report);

    // Save the report
    reportObj.save(function () {
      // Request Reports
      request(app).get('/api/reports')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Report if not signed in', function (done) {
    // Create new Report model instance
    var reportObj = new Report(report);

    // Save the Report
    reportObj.save(function () {
      request(app).get('/api/reports/' + reportObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', report.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Report with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/reports/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Report is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Report which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Report
    request(app).get('/api/reports/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Report with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Report if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Report
        agent.post('/api/reports')
          .send(report)
          .expect(200)
          .end(function (reportSaveErr, reportSaveRes) {
            // Handle Report save error
            if (reportSaveErr) {
              return done(reportSaveErr);
            }

            // Delete an existing Report
            agent.delete('/api/reports/' + reportSaveRes.body._id)
              .send(report)
              .expect(200)
              .end(function (reportDeleteErr, reportDeleteRes) {
                // Handle report error error
                if (reportDeleteErr) {
                  return done(reportDeleteErr);
                }

                // Set assertions
                (reportDeleteRes.body._id).should.equal(reportSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Report if not signed in', function (done) {
    // Set Report user
    report.user = user;

    // Create new Report model instance
    var reportObj = new Report(report);

    // Save the Report
    reportObj.save(function () {
      // Try deleting Report
      request(app).delete('/api/reports/' + reportObj._id)
        .expect(403)
        .end(function (reportDeleteErr, reportDeleteRes) {
          // Set message assertion
          (reportDeleteRes.body.message).should.match('User is not authorized');

          // Handle Report error error
          done(reportDeleteErr);
        });

    });
  });

  it('should be able to get a single Report that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Report
          agent.post('/api/reports')
            .send(report)
            .expect(200)
            .end(function (reportSaveErr, reportSaveRes) {
              // Handle Report save error
              if (reportSaveErr) {
                return done(reportSaveErr);
              }

              // Set assertions on new Report
              (reportSaveRes.body.name).should.equal(report.name);
              should.exist(reportSaveRes.body.user);
              should.equal(reportSaveRes.body.user._id, orphanId);

              // force the Report to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Report
                    agent.get('/api/reports/' + reportSaveRes.body._id)
                      .expect(200)
                      .end(function (reportInfoErr, reportInfoRes) {
                        // Handle Report error
                        if (reportInfoErr) {
                          return done(reportInfoErr);
                        }

                        // Set assertions
                        (reportInfoRes.body._id).should.equal(reportSaveRes.body._id);
                        (reportInfoRes.body.name).should.equal(report.name);
                        should.equal(reportInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Report.remove().exec(done);
    });
  });
});
