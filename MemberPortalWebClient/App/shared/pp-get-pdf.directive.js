(function() {
	'use strict';

	/*
	Author: Long Dao

	Create a Get PDF button. Put #pdf onto the div that you want to turn into a pdf. Use the optional attribute "condition" if you have a condition that you want 
	to wait on before loading the get pdf. And if the condition is false, the button will remain disabled.

	Example:  
	<pp-get-pdf title="Daily Transaction Report"></pp-get-pdf>
	<pp-get-pdf title="Claims RA Print" condition="loaded === true"></pp-get-pdf>

	Attributes: 
	selector = the name of the div you want to turn into a pdf. if left blank, default is #pdf. used if you can't use #pdf for some reason
	title = title of header in headerbar that contains the pdf icon. 
	condition = condition to wait on before enabling get pdf button. default is null
*/

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	angular
		.module('MemberPortalDirectives')
		.directive('ppGetPdf', ppGetPdf);

	function ppGetPdf() {
		var directive = {
			restrict: 'EA',
			templateUrl: urlBase + '/App/shared/pp-get-pdf.directive.html' + cacheBust,
			link: link,
			controller: controller
		};

		return directive;

		/////////////////////////////////////////////////////
		function link($scope, el, attr) {
			$scope.selector = attr.getPdf ? attr.getPdf : '#pdf';
			$scope.title = attr.title ? attr.title : '';
			$scope.condition = attr.condition ? attr.condition : true;
		}
	}

	controller.$inject = ['$scope', '$uibModal', 'memberDataService'];

	function controller($scope, $uibModal, memberDataService) {
		$scope.getPdf = getPdf;
		$scope.print = print;

		$scope.selector = $scope.selector || '#pdf';
		$scope.title = $scope.title || '';

		/////controller methods


		function getPdf() {
			var printContents = $($scope.selector).html();

			if ($scope.condition) {
				$('#pdfModal').modal('toggle');
				memberDataService.GetPdfData(printContents).success(function(response) {
					if (window.navigator.msSaveOrOpenBlob) {
						window.navigator.msSaveOrOpenBlob(new Blob([response], { type: 'application/pdf' }), $scope.title);
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

		function print() {
			var printContents = $($scope.selector).html();
			var popupWin = window.open('', '_blank', 'width=300');
			var css = '';
			$('link').each(function(key, value) {
				var templink = "<link href='" + value.href + "' rel='stylesheet'>";
				css += templink;
			});


			popupWin.document.open();
			popupWin.document.write('<html><head>' + css + '</head><body onload="window.print()">' + printContents + '</body></html>');
			popupWin.document.close();
		}
	}

})();