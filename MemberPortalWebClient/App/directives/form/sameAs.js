(function() {
	angular
		.module('MemberPortalDirectives')
		.directive('sameAs', sameAs);

	function sameAs() {
		return {
			require: 'ngModel',
			link: function(scope, elem, attrs, ngModel) {
				ngModel.$parsers.unshift(validate);

				// Force-trigger the parsing pipeline.
				scope.$watch(attrs.sameAs, function() {
					ngModel.$setViewValue(ngModel.$viewValue);
				});

				function validate(value) {
					var isValid = scope.$eval(attrs.sameAs) == value;

					ngModel.$setValidity('same-as', isValid);

					return isValid ? value : undefined;
				}
			}
		};
	}
})();