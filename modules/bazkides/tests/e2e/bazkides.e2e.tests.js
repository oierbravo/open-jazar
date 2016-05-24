'use strict';

describe('Bazkides E2E Tests:', function () {
  describe('Test Bazkides page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/bazkides');
      expect(element.all(by.repeater('bazkide in bazkides')).count()).toEqual(0);
    });
  });
});
