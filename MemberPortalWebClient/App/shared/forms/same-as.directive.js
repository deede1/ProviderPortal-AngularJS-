(function() {
	angular
		.module('MemberPortalDirectives')
		.directive('sameAs', sameAs);

	function sameAs() {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				sameAs: '='
			},
			link: link
		};

		//////////////////////////////////

		function link(scope, elem, attrs, ctrl) {

			var validator = function(value) {
				ctrl.$setValidity('match', value === scope.sameAs);
				return value;
			};
			ctrl.$parsers.unshift(validator);
			ctrl.$formatters.push(validator);

			// This is to force validator when the original value gets changed
			scope.$watch('sameAs', function(newval, oldval) {
				validator(ctrl.$viewValue);
			});


		}
	}
})();