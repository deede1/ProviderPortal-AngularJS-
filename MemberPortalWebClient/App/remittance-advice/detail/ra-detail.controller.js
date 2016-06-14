(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('RaDetailController', RaDetailController);

	RaDetailController.$inject = ['$scope', '$rootScope', '$translate', 'contentAuthorizationService', '$state', '$stateParams', 'memberDataService', '$uibModal'];

	function RaDetailController($scope, $rootScope, $translate, contentAuthorizationService, $state, $stateParams, memberDataService, $uibModal) {
		console.log('URI > ', $stateParams);
		$scope.route = $stateParams;
		$scope.getPdf = getPdf;
		$scope.loaded = false;
		$scope.$parent.fullscreen = true;

		commonInit();
		authorizationDefaults();

		//////////////////////////////////////////////////////////////////////////////////
		function getPdf() {
			if ($scope.loaded >= 0) {
				$('#pdfModal').modal('toggle');
				memberDataService.GetPdfData($('#pdf').html()).success(function(response) {


					if (window.navigator.msSaveOrOpenBlob) {

						window.navigator.msSaveOrOpenBlob(new Blob([response], { type: 'application/pdf' }), 'Claims RA Print');
					} else {

						var file = new Blob([response], { type: 'application/pdf' });
						var fileUrl = URL.createObjectURL(file);
						window.open(fileUrl);
					}

				});
			} else {
				console.log('Still Loading Page');
			}
		}

		//COMMON PAGE INITIALIZATION 
		function commonInit() {
			$scope.errorMessage = '';
			$scope.infoMessage = '';
			$scope.successMessage = '';

			$scope.TestUserMode = $rootScope.TestUserMode;
			$scope.ShareDataWithState = 1; //On by default 
		}

		//CONTENT AUTHORIZATION DEFAULTS 
		function authorizationDefaults() {
			$scope.siteItem = [];
			$scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);
		}

	}

})();