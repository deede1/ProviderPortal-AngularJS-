(function() {
	angular
		.module('MemberPortalDirectives')
		.directive('differentThan', differentThan);

	function differentThan() {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				differentThan: '='
			},
			link: link
		};

		//////////////////////////////////

		function link(scope, elem, attrs, ctrl) {

			var validator = function(value) {
				ctrl.$setValidity('match', value !== scope.differentThan);
				return value;
			};
			ctrl.$parsers.unshift(validator);
			ctrl.$formatters.push(validator);

			// This is to force validator when the original value gets changed
			scope.$watch('differentThan', function(newval, oldval) {
				validator(ctrl.$viewValue);
			});


		}
	}
})();