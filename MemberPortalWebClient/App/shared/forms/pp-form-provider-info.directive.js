(function() {
	'use strict';

    /*
	Author: Jerell Mendoza

	Directive used to display provider header information. This information is currently displayed accross several of the BH forms.

	Example:  	
	<pp-form-provider-info data="AMVCtrl.ProviderInformation" title="Autism ABA Provider Information"></pp-form-provider-info>

    AMVCtrl is the controller, ProviderInformation is the object

	Attributes: 
	data = object with member information
    title = section title name 

    Expected Format of data object:
    {
      "ProviderLastName": "sample string 1",
      "ProviderFirstName": "sample string 2",
      "ProviderId": "sample string 3",
      "ProviderAddress1": "sample string 4",
      "ProviderAddress2": "sample string 5",
      "SubscriberNumber": "sample string 6",
      "ProviderCity": "sample string 7",
      "ProviderState": "sample string 8",
      "ProviderPhone": "sample string 9",
      "ProviderZip": "sample string 10",
      "ProviderNpi": "sample string 11",
      "ProviderFax": "sample string 12"
    }
    */
	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    angular
        .module('MemberPortalDirectives')
        .directive('ppFormProviderInfo', ppFormProviderInfo);

    function ppFormProviderInfo() {
        var directive = {
            restrict: 'AE',
            templateUrl: urlBase + '/App/shared/forms/pp-form-provider-info.directive.html' + cacheBust,
            scope: {
                data: '=',
                title: '@'
            }
    };

        return directive;
    };
})();