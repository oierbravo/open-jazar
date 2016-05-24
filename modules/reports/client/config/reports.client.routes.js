(function () {
  'use strict';

  angular
    .module('reports')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('reports', {
        abstract: true,
        url: '/reports',
        template: '<ui-view/>'
      })
      .state('reports.list', {
        url: '',
        templateUrl: 'modules/reports/client/views/list-reports.client.view.html',
        controller: 'ReportsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Reports List'
        }
      })
      .state('reports.create', {
        url: '/create',
        templateUrl: 'modules/reports/client/views/form-report.client.view.html',
        controller: 'ReportsController',
        controllerAs: 'vm',
        resolve: {
          reportResolve: newReport
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Reports Create'
        }
      })
      .state('reports.edit', {
        url: '/:reportId/edit',
        templateUrl: 'modules/reports/client/views/form-report.client.view.html',
        controller: 'ReportsController',
        controllerAs: 'vm',
        resolve: {
          reportResolve: getReport
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Report {{ reportResolve.name }}'
        }
      })
      .state('reports.view', {
        url: '/:reportId',
        templateUrl: 'modules/reports/client/views/view-report.client.view.html',
        controller: 'ReportsController',
        controllerAs: 'vm',
        resolve: {
          reportResolve: getReport
        },
        data:{
          pageTitle: 'Report {{ articleResolve.name }}'
        }
      });
  }

  getReport.$inject = ['$stateParams', 'ReportsService'];

  function getReport($stateParams, ReportsService) {
    return ReportsService.get({
      reportId: $stateParams.reportId
    }).$promise;
  }

  newReport.$inject = ['ReportsService'];

  function newReport(ReportsService) {
    return new ReportsService();
  }
})();
