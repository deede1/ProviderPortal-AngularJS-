(function() {
	'use strict';

	/*
		Author: Long Dao

		Determines what type of ID (IEHPID,SSN,CHECK OR CLAIM) is in the input, and display the type in the input box.
		It also provides validation and does not proceed unless there is at least one accepted type in the input

		Example:  	
		<pp-search-type label="Enter IEHP ID, SSN, Check, or Claim Number"></pp-search-type>

		Attributes: 
		'label': The placeholder inside the input search box. Required.
		'accepted-types': List all accepted ID types in the field in an array format. Defaults to every type ['Last Name', 'Claim', 'CIN', 'SSN', 'IEHPID'].
			This attribute is optional, because it will read from $scope.$parent.$acceptedTypes (since it is better practice to put this array in the parent CTRL)
		'search': Name of model object that contains all search variables. Defaults to '$scope.$parent.search'

		Assumptions:
		It will write directly to the parent controller $scope.search (unless stated otherwise in the 'search' attr) so you can access it outside of this 
		directive. The results will be displayed in $scope.search.results so you can ng-repeat it in your results table

		Reqirements:
		In the parent controller, create $scope.search, $scope.acceptedTypes, and $scope.params
	*/

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppSearchType', ppSearchType);


	function ppSearchType() {
		var directive = {
			transclude: true,
			restrict: 'EA',
			templateUrl: urlBase + '/App/shared/search-tables/pp-search-type.directive.html' + cacheBust,
			scope: {
				search: '=?',
				label: '@',
				acceptedTypes: '@?'
			},
			controller: ppSearchTypeController,
			link: link

		};

		return directive;

		/////////////////////////////////////

		function link(scope, element, attr, ctrl, $transclude) {
			//if there's transcluded content, enable the Advanced Search option next to the search input
			$transclude(function(clone) {
				if (clone.length) {
					scope.enableAdvancedOptions = true;
				}
			});


		}
	}

	ppSearchTypeController.$inject = ['$scope', '$state', '$filter', 'searchTypeService', 'memberDataService'];

	function ppSearchTypeController( $scope, $state, $filter, searchTypeService, memberDataService ) {
		
		$scope.search = $scope.$parent.search || {};
		$scope.search.acceptedTypes = $scope.search.acceptedTypes || ['Last Name', 'Claim', 'CIN', 'SSN', 'IEHPID'];

		$scope.search.state = $scope.search.state || {};
		$scope.search.state.beganSearch = false;
		$scope.search.state.validated = validated;

		$scope.search.type = searchTypeService.type($scope.search.query);
		$scope.search.updateType = updateType;

		if (!$scope.search.clickInput) {
			$scope.search.clickInput = null;

		}

		$scope.search.clear = $scope.search.clear || clear;


		function validated() {
			return $scope.search.type.string || !$scope.search.state.beganSearch || !$scope.search.query;
		}

		function updateType() {
			var query = $scope.search.query;
			$scope.search.state.beganSearch = true;

			$scope.search.type = searchTypeService.type(query, $scope.search.acceptedTypes);
		}

		function clear() {
			$state.reload();
		}


	}
})();