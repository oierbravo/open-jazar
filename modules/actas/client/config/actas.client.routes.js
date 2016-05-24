(function () {
  'use strict';

  angular
    .module('actas')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('actas', {
        abstract: true,
        url: '/actas',
        template: '<ui-view/>'
      })
      .state('actas.list', {
        url: '',
        templateUrl: 'modules/actas/client/views/list-actas.client.view.html',
        controller: 'ActasListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Actas List'
        }
      })
      .state('actas.create', {
        url: '/create',
        templateUrl: 'modules/actas/client/views/form-acta.client.view.html',
        controller: 'ActasController',
        controllerAs: 'vm',
        resolve: {
          actaResolve: newActa
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Actas Create'
        }
      })
      .state('actas.edit', {
        url: '/:actaId/edit',
        templateUrl: 'modules/actas/client/views/form-acta.client.view.html',
        controller: 'ActasController',
        controllerAs: 'vm',
        resolve: {
          actaResolve: getActa
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Acta {{ actaResolve.name }}'
        }
      })
      .state('actas.view', {
        url: '/:actaId',
        templateUrl: 'modules/actas/client/views/view-acta.client.view.html',
        controller: 'ActasController',
        controllerAs: 'vm',
        resolve: {
          actaResolve: getActa
        },
        data:{
          pageTitle: 'Acta {{ articleResolve.name }}'
        }
      });
  }

  getActa.$inject = ['$stateParams', 'ActasService'];

  function getActa($stateParams, ActasService) {
    return ActasService.get({
      actaId: $stateParams.actaId
    }).$promise;
  }

  newActa.$inject = ['ActasService'];

  function newActa(ActasService) {
    return new ActasService();
  }
})();
