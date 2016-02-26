'use strict';

angular.module('phonecat.phoneList').controller('PhoneListCtrl',
  ['Phone', function (Phone) {
    var $ctrl = this;
    Phone.query().then(function(phones){
      $ctrl.phones = phones;
    });
    this.orderProp = 'age';
  }]);
