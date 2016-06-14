(function () {
    var app = angular.module('MemberPortalDirectives'); 
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content'); 
    app.directive("ppEligibilityMemberDetails",  function ( ) {
        return {
            scope: { 
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/pp-eligibility-member-details/ppEligibilityMemberDetails.html' + cacheBust,
            controller: 'PPMemberDemographicsController',
            controllerAs: 'ctrl'
        };
    });


    //============= CONTROLLER
    app.controller('PPMemberDemographicsController',
        ['$scope', 'memberDataService', '$rootScope',
            function ($scope, memberDataService, $rootScope) {
                $scope.$on('updatePPEligibilityMemberDetails', function(event, args) {
                    $scope.FirstName = args.FirstName;
                    $scope.LastName = args.LastName;
                    $scope.IEHPID = args.IEHPID;
                    $scope.Address1 = args.Address1;
                    $scope.Address2 = args.Address2;
                    $scope.City = args.City;
                    $scope.State = args.State;
                    $scope.Zip = args.Zip;
                    $scope.Phone = args.Phone;
                    $scope.Language = args.Language;

                        console.log('... MEM DEMO CONTROLLER');

                    //timer for data refresh
                    setTimeout(function () {
                        console.log('>>>>>1  QTY=' + $('#ppMemberDemographicsContainer').length );
                            var a = $('#ppMemberDemographicsContainer').clone();
                            $(a).appendTo('#modalContainerGeneral .modalContent');
                            $('#modalContainerGeneral .modalContent #ppMemberDemographicsContainer').show();
                            console.log('>>>>>2  QTY=' + $('#ppMemberDemographicsContainer').length);
                    },250);

                    } 
                    );
    }]);


})();


