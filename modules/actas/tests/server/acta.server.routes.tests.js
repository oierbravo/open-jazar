'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Acta = mongoose.model('Acta'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, acta;

/**
 * Acta routes tests
 */
describe('Acta CRUD tests', function () {

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

    // Save a user to the test db and create new Acta
    user.save(function () {
      acta = {
        name: 'Acta name'
      };

      done();
    });
  });

  it('should be able to save a Acta if logged in', function (done) {
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

        // Save a new Acta
        agent.post('/api/actas')
          .send(acta)
          .expect(200)
          .end(function (actaSaveErr, actaSaveRes) {
            // Handle Acta save error
            if (actaSaveErr) {
              return done(actaSaveErr);
            }

            // Get a list of Actas
            agent.get('/api/actas')
              .end(function (actasGetErr, actasGetRes) {
                // Handle Acta save error
                if (actasGetErr) {
                  return done(actasGetErr);
                }

                // Get Actas list
                var actas = actasGetRes.body;

                // Set assertions
                (actas[0].user._id).should.equal(userId);
                (actas[0].name).should.match('Acta name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Acta if not logged in', function (done) {
    agent.post('/api/actas')
      .send(acta)
      .expect(403)
      .end(function (actaSaveErr, actaSaveRes) {
        // Call the assertion callback
        done(actaSaveErr);
      });
  });

  it('should not be able to save an Acta if no name is provided', function (done) {
    // Invalidate name field
    acta.name = '';

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

        // Save a new Acta
        agent.post('/api/actas')
          .send(acta)
          .expect(400)
          .end(function (actaSaveErr, actaSaveRes) {
            // Set message assertion
            (actaSaveRes.body.message).should.match('Please fill Acta name');

            // Handle Acta save error
            done(actaSaveErr);
          });
      });
  });

  it('should be able to update an Acta if signed in', function (done) {
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

        // Save a new Acta
        agent.post('/api/actas')
          .send(acta)
          .expect(200)
          .end(function (actaSaveErr, actaSaveRes) {
            // Handle Acta save error
            if (actaSaveErr) {
              return done(actaSaveErr);
            }

            // Update Acta name
            acta.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Acta
            agent.put('/api/actas/' + actaSaveRes.body._id)
              .send(acta)
              .expect(200)
              .end(function (actaUpdateErr, actaUpdateRes) {
                // Handle Acta update error
                if (actaUpdateErr) {
                  return done(actaUpdateErr);
                }

                // Set assertions
                (actaUpdateRes.body._id).should.equal(actaSaveRes.body._id);
                (actaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Actas if not signed in', function (done) {
    // Create new Acta model instance
    var actaObj = new Acta(acta);

    // Save the acta
    actaObj.save(function () {
      // Request Actas
      request(app).get('/api/actas')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Acta if not signed in', function (done) {
    // Create new Acta model instance
    var actaObj = new Acta(acta);

    // Save the Acta
    actaObj.save(function () {
      request(app).get('/api/actas/' + actaObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', acta.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Acta with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/actas/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Acta is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Acta which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Acta
    request(app).get('/api/actas/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Acta with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Acta if signed in', function (done) {
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

        // Save a new Acta
        agent.post('/api/actas')
          .send(acta)
          .expect(200)
          .end(function (actaSaveErr, actaSaveRes) {
            // Handle Acta save error
            if (actaSaveErr) {
              return done(actaSaveErr);
            }

            // Delete an existing Acta
            agent.delete('/api/actas/' + actaSaveRes.body._id)
              .send(acta)
              .expect(200)
              .end(function (actaDeleteErr, actaDeleteRes) {
                // Handle acta error error
                if (actaDeleteErr) {
                  return done(actaDeleteErr);
                }

                // Set assertions
                (actaDeleteRes.body._id).should.equal(actaSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Acta if not signed in', function (done) {
    // Set Acta user
    acta.user = user;

    // Create new Acta model instance
    var actaObj = new Acta(acta);

    // Save the Acta
    actaObj.save(function () {
      // Try deleting Acta
      request(app).delete('/api/actas/' + actaObj._id)
        .expect(403)
        .end(function (actaDeleteErr, actaDeleteRes) {
          // Set message assertion
          (actaDeleteRes.body.message).should.match('User is not authorized');

          // Handle Acta error error
          done(actaDeleteErr);
        });

    });
  });

  it('should be able to get a single Acta that has an orphaned user reference', function (done) {
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

          // Save a new Acta
          agent.post('/api/actas')
            .send(acta)
            .expect(200)
            .end(function (actaSaveErr, actaSaveRes) {
              // Handle Acta save error
              if (actaSaveErr) {
                return done(actaSaveErr);
              }

              // Set assertions on new Acta
              (actaSaveRes.body.name).should.equal(acta.name);
              should.exist(actaSaveRes.body.user);
              should.equal(actaSaveRes.body.user._id, orphanId);

              // force the Acta to have an orphaned user reference
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

                    // Get the Acta
                    agent.get('/api/actas/' + actaSaveRes.body._id)
                      .expect(200)
                      .end(function (actaInfoErr, actaInfoRes) {
                        // Handle Acta error
                        if (actaInfoErr) {
                          return done(actaInfoErr);
                        }

                        // Set assertions
                        (actaInfoRes.body._id).should.equal(actaSaveRes.body._id);
                        (actaInfoRes.body.name).should.equal(acta.name);
                        should.equal(actaInfoRes.body.user, undefined);

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
      Acta.remove().exec(done);
    });
  });
});
