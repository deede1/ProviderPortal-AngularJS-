(function() {
	'use strict';

	/*
	Author: Jerell Mendoza

	Directive used to display member header information. This information is currently displayed accross several of the BH forms.

	Example:  	
	<pp-form-member-info data="AMVCtrl.MemberInformation"></pp-form-member-info>

    AMVCtrl is the controller, MemberInformation is the object

	Attributes: 
	data = object with member information

    Expected Format of data object:
    {
      "MemberLob": "sample string 1",
      "MemberPlanAidCode": "sample string 2",
      "MemberGroup": "sample string 3",
      "MemberEffectiveDate": "2016-04-07T11:43:14.7207518-07:00",
      "MemberTermDate": "2016-04-07T11:43:14.7207518-07:00",
      "MemberEligibilityStatus": "sample string 4",
      "MemberEligibilityNumber": "sample string 5",
      "SubscriberNumber": "sample string 6",
      "PersonNumber": "sample string 7",
      "MemberPcp": "sample string 8",
      "MemberIpa": "sample string 9",
      "MemberDateOfBirth": "2016-04-07T11:43:14.7207518-07:00",
      "MemberLastName": "sample string 10",
      "MemberFirstName": "sample string 11",
      "MemberMiddleName": "sample string 12",
      "MemberGender": "sample string 13",
      "MemberPhone": "sample string 14",
      "MemberAddress1": "sample string 15",
      "MemberAddress2": "sample string 16",
      "MemberCity": "sample string 17",
      "MemberState": "sample string 18",
      "MemberZip": "sample string 19",
      "MemberCounty": "sample string 20",
      "MemberMedicareNumber": "sample string 21",
      "MemberMedicalNumber": "sample string 22",
      "MemberCin": "sample string 23",
      "MemberAge": "sample string 24"
    }
    */

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppFormMemberInfo', ppFormMemberInfo);

	function ppFormMemberInfo() {
		var directive = {
			restrict: 'AE',
			templateUrl: urlBase + '/App/shared/forms/pp-form-member-info.directive.html' + cacheBust,
			scope: {
				data: '='
		    }
		};

		return directive;

	}

})();