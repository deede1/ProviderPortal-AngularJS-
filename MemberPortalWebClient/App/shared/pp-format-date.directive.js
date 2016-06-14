
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
		.directive('ppFormatDate', ppFormatDate);

	ppFormatDate.$inject = ['$filter'];

	function ppFormatDate($filter) {
		return {
			require: 'ngModel',
			link: function ( scope, element, attrs, ngModelController ) {
				$('#data').mask('99/99/9999');
				ngModelController.$parsers.push(function(data) {
					//View -> Model
					return data;
				});
				ngModelController.$formatters.push(function(data) {
					//Model -> View
					return $filter('date')(data, 'YYYY-MM-DD');
				});
			}
		};
	}

})();