(function () {
  'use strict';

  describe('Actas Route Tests', function () {
    // Initialize global variables
    var $scope,
      ActasService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ActasService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ActasService = _ActasService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('actas');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/actas');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ActasController,
          mockActa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('actas.view');
          $templateCache.put('modules/actas/client/views/view-acta.client.view.html', '');

          // create mock Acta
          mockActa = new ActasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Acta Name'
          });

          //Initialize Controller
          ActasController = $controller('ActasController as vm', {
            $scope: $scope,
            actaResolve: mockActa
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:actaId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.actaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            actaId: 1
          })).toEqual('/actas/1');
        }));

        it('should attach an Acta to the controller scope', function () {
          expect($scope.vm.acta._id).toBe(mockActa._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/actas/client/views/view-acta.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ActasController,
          mockActa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('actas.create');
          $templateCache.put('modules/actas/client/views/form-acta.client.view.html', '');

          // create mock Acta
          mockActa = new ActasService();

          //Initialize Controller
          ActasController = $controller('ActasController as vm', {
            $scope: $scope,
            actaResolve: mockActa
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.actaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/actas/create');
        }));

        it('should attach an Acta to the controller scope', function () {
          expect($scope.vm.acta._id).toBe(mockActa._id);
          expect($scope.vm.acta._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/actas/client/views/form-acta.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ActasController,
          mockActa;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('actas.edit');
          $templateCache.put('modules/actas/client/views/form-acta.client.view.html', '');

          // create mock Acta
          mockActa = new ActasService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Acta Name'
          });

          //Initialize Controller
          ActasController = $controller('ActasController as vm', {
            $scope: $scope,
            actaResolve: mockActa
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:actaId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.actaResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            actaId: 1
          })).toEqual('/actas/1/edit');
        }));

        it('should attach an Acta to the controller scope', function () {
          expect($scope.vm.acta._id).toBe(mockActa._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/actas/client/views/form-acta.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
