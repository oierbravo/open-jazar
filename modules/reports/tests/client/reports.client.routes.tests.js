(function () {
  'use strict';

  describe('Reports Route Tests', function () {
    // Initialize global variables
    var $scope,
      ReportsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ReportsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ReportsService = _ReportsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('reports');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/reports');
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
          ReportsController,
          mockReport;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('reports.view');
          $templateCache.put('modules/reports/client/views/view-report.client.view.html', '');

          // create mock Report
          mockReport = new ReportsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Report Name'
          });

          //Initialize Controller
          ReportsController = $controller('ReportsController as vm', {
            $scope: $scope,
            reportResolve: mockReport
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:reportId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.reportResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            reportId: 1
          })).toEqual('/reports/1');
        }));

        it('should attach an Report to the controller scope', function () {
          expect($scope.vm.report._id).toBe(mockReport._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/reports/client/views/view-report.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ReportsController,
          mockReport;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('reports.create');
          $templateCache.put('modules/reports/client/views/form-report.client.view.html', '');

          // create mock Report
          mockReport = new ReportsService();

          //Initialize Controller
          ReportsController = $controller('ReportsController as vm', {
            $scope: $scope,
            reportResolve: mockReport
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.reportResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/reports/create');
        }));

        it('should attach an Report to the controller scope', function () {
          expect($scope.vm.report._id).toBe(mockReport._id);
          expect($scope.vm.report._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/reports/client/views/form-report.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ReportsController,
          mockReport;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('reports.edit');
          $templateCache.put('modules/reports/client/views/form-report.client.view.html', '');

          // create mock Report
          mockReport = new ReportsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Report Name'
          });

          //Initialize Controller
          ReportsController = $controller('ReportsController as vm', {
            $scope: $scope,
            reportResolve: mockReport
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:reportId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.reportResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            reportId: 1
          })).toEqual('/reports/1/edit');
        }));

        it('should attach an Report to the controller scope', function () {
          expect($scope.vm.report._id).toBe(mockReport._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/reports/client/views/form-report.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
