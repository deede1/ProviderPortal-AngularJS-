(function() {
	'use strict';

	/*
	Author: Long Dao

	Helper directive for displaying form validation error messages. It's to be used right under the input field, and shows if your input is either invalid,
	or if the user has hit submit without entering anything into a required field.

	Example:  	
	<pp-invalid-alert form="registerFormAncillary" name="FacilityName">Invalid Facility Name</pp-invalid-alert>

	Attributes: 
	form = the name of your form
	name = the name of your targeted input field

*/

	angular
		.module('MemberPortalDirectives')
		.directive('ppInvalidAlert', ppInvalidAlert);

	function ppInvalidAlert() {
		var directive = {
			restrict: 'AE',
			transclude: true,																							
			template: '<div class="invalid-text" ng-show="form[name].$invalid && (form.name.$touched || form.$submitted)" ng-transclude></div>',
			scope: {
				form: '=',
				name: '@'
			}
		};

		return directive;

		/////////////////////////////////////////////////////
	}

})();