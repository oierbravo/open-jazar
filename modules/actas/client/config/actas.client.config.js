(function () {
  'use strict';

  angular
    .module('actas')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Actas',
      state: 'actas',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'actas', {
      title: 'List Actas',
      state: 'actas.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'actas', {
      title: 'Create Acta',
      state: 'actas.create',
      roles: ['user']
    });
  }
})();
