'use strict';

describe('Actas E2E Tests:', function () {
  describe('Test Actas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/actas');
      expect(element.all(by.repeater('acta in actas')).count()).toEqual(0);
    });
  });
});
