'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Bazkide = mongoose.model('Bazkide'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, bazkide;

/**
 * Bazkide routes tests
 */
describe('Bazkide CRUD tests', function () {

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

    // Save a user to the test db and create new Bazkide
    user.save(function () {
      bazkide = {
        name: 'Bazkide name'
      };

      done();
    });
  });

  it('should be able to save a Bazkide if logged in', function (done) {
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

        // Save a new Bazkide
        agent.post('/api/bazkides')
          .send(bazkide)
          .expect(200)
          .end(function (bazkideSaveErr, bazkideSaveRes) {
            // Handle Bazkide save error
            if (bazkideSaveErr) {
              return done(bazkideSaveErr);
            }

            // Get a list of Bazkides
            agent.get('/api/bazkides')
              .end(function (bazkidesGetErr, bazkidesGetRes) {
                // Handle Bazkide save error
                if (bazkidesGetErr) {
                  return done(bazkidesGetErr);
                }

                // Get Bazkides list
                var bazkides = bazkidesGetRes.body;

                // Set assertions
                (bazkides[0].user._id).should.equal(userId);
                (bazkides[0].name).should.match('Bazkide name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Bazkide if not logged in', function (done) {
    agent.post('/api/bazkides')
      .send(bazkide)
      .expect(403)
      .end(function (bazkideSaveErr, bazkideSaveRes) {
        // Call the assertion callback
        done(bazkideSaveErr);
      });
  });

  it('should not be able to save an Bazkide if no name is provided', function (done) {
    // Invalidate name field
    bazkide.name = '';

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

        // Save a new Bazkide
        agent.post('/api/bazkides')
          .send(bazkide)
          .expect(400)
          .end(function (bazkideSaveErr, bazkideSaveRes) {
            // Set message assertion
            (bazkideSaveRes.body.message).should.match('Please fill Bazkide name');

            // Handle Bazkide save error
            done(bazkideSaveErr);
          });
      });
  });

  it('should be able to update an Bazkide if signed in', function (done) {
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

        // Save a new Bazkide
        agent.post('/api/bazkides')
          .send(bazkide)
          .expect(200)
          .end(function (bazkideSaveErr, bazkideSaveRes) {
            // Handle Bazkide save error
            if (bazkideSaveErr) {
              return done(bazkideSaveErr);
            }

            // Update Bazkide name
            bazkide.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Bazkide
            agent.put('/api/bazkides/' + bazkideSaveRes.body._id)
              .send(bazkide)
              .expect(200)
              .end(function (bazkideUpdateErr, bazkideUpdateRes) {
                // Handle Bazkide update error
                if (bazkideUpdateErr) {
                  return done(bazkideUpdateErr);
                }

                // Set assertions
                (bazkideUpdateRes.body._id).should.equal(bazkideSaveRes.body._id);
                (bazkideUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Bazkides if not signed in', function (done) {
    // Create new Bazkide model instance
    var bazkideObj = new Bazkide(bazkide);

    // Save the bazkide
    bazkideObj.save(function () {
      // Request Bazkides
      request(app).get('/api/bazkides')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Bazkide if not signed in', function (done) {
    // Create new Bazkide model instance
    var bazkideObj = new Bazkide(bazkide);

    // Save the Bazkide
    bazkideObj.save(function () {
      request(app).get('/api/bazkides/' + bazkideObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', bazkide.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Bazkide with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/bazkides/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bazkide is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Bazkide which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Bazkide
    request(app).get('/api/bazkides/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Bazkide with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Bazkide if signed in', function (done) {
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

        // Save a new Bazkide
        agent.post('/api/bazkides')
          .send(bazkide)
          .expect(200)
          .end(function (bazkideSaveErr, bazkideSaveRes) {
            // Handle Bazkide save error
            if (bazkideSaveErr) {
              return done(bazkideSaveErr);
            }

            // Delete an existing Bazkide
            agent.delete('/api/bazkides/' + bazkideSaveRes.body._id)
              .send(bazkide)
              .expect(200)
              .end(function (bazkideDeleteErr, bazkideDeleteRes) {
                // Handle bazkide error error
                if (bazkideDeleteErr) {
                  return done(bazkideDeleteErr);
                }

                // Set assertions
                (bazkideDeleteRes.body._id).should.equal(bazkideSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Bazkide if not signed in', function (done) {
    // Set Bazkide user
    bazkide.user = user;

    // Create new Bazkide model instance
    var bazkideObj = new Bazkide(bazkide);

    // Save the Bazkide
    bazkideObj.save(function () {
      // Try deleting Bazkide
      request(app).delete('/api/bazkides/' + bazkideObj._id)
        .expect(403)
        .end(function (bazkideDeleteErr, bazkideDeleteRes) {
          // Set message assertion
          (bazkideDeleteRes.body.message).should.match('User is not authorized');

          // Handle Bazkide error error
          done(bazkideDeleteErr);
        });

    });
  });

  it('should be able to get a single Bazkide that has an orphaned user reference', function (done) {
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

          // Save a new Bazkide
          agent.post('/api/bazkides')
            .send(bazkide)
            .expect(200)
            .end(function (bazkideSaveErr, bazkideSaveRes) {
              // Handle Bazkide save error
              if (bazkideSaveErr) {
                return done(bazkideSaveErr);
              }

              // Set assertions on new Bazkide
              (bazkideSaveRes.body.name).should.equal(bazkide.name);
              should.exist(bazkideSaveRes.body.user);
              should.equal(bazkideSaveRes.body.user._id, orphanId);

              // force the Bazkide to have an orphaned user reference
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

                    // Get the Bazkide
                    agent.get('/api/bazkides/' + bazkideSaveRes.body._id)
                      .expect(200)
                      .end(function (bazkideInfoErr, bazkideInfoRes) {
                        // Handle Bazkide error
                        if (bazkideInfoErr) {
                          return done(bazkideInfoErr);
                        }

                        // Set assertions
                        (bazkideInfoRes.body._id).should.equal(bazkideSaveRes.body._id);
                        (bazkideInfoRes.body.name).should.equal(bazkide.name);
                        should.equal(bazkideInfoRes.body.user, undefined);

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
      Bazkide.remove().exec(done);
    });
  });
});
