'use strict';

describe('Reports E2E Tests:', function () {
  describe('Test Reports page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/reports');
      expect(element.all(by.repeater('report in reports')).count()).toEqual(0);
    });
  });
});
