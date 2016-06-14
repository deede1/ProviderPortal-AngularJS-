(function() { 
    'use strict';
	angular
		.module('MemberPortal')
		.controller('StyleGuideController', styleGuideController);

	//styleGuideController.$inject = ['$scope'];

	function styleGuideController() {
	    var vm = this;
	    vm.indicatorLightsDemo = {
	        examples : ['Approved', 'Denied', 'Maybe', 'Success', 'Boooo', 'Canceled', 'In Progress', 'unexpected'],
	        config: {
	            orange: ['In Progress','Maybe'],
	            red: ['Dismissed', 'Denied', 'Canceled','Boooo'],
	            green: ['Approved', 'Approved', 'Approved- Rx', 'Success'],
	            defaultHidden: false
	        }
	    };
	    
	}
})();