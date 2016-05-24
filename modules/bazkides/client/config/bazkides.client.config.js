(function () {
  'use strict';

  angular
    .module('bazkides')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    // Set top bar menu items
  /*  Menus.addMenuItem('topbar', {
      title: 'Bazkides',
      state: 'bazkides',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'bazkides', {
      title: 'List Bazkides',
      state: 'bazkides.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'bazkides', {
      title: 'Create Bazkide',
      state: 'bazkides.create',
      roles: ['user']
    });*/
  }
})();
