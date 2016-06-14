(function () {
    var app = angular.module('MemberPortalDirectives'); 
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content'); 
    app.directive("rosterCcsAuthorizations",  function ( ) {
        return {
            scope: {
                elig: '=',
                testUserMode: '='
            },
            restrict: "EA",
            //replace: true,
            transclude: true,
            templateUrl: urlBase + '/App/directives/pp-rosters-ccs-authorizations/ppRostersCCSAuthorizations.html' + cacheBust,
            controller: 'PPRostersCCSAuthorizationsController' 
        };
    });


    //============= CONTROLLER
    app.controller('PPRostersCCSAuthorizationsController',
        ['$scope', 'memberDataService', '$rootScope',
            function ($scope, memberDataService, $rootScope) {
                console.log('@ROSTERS CCS AUTHORIZATIONS CONTROLLER');
            
                $scope.$on('updatePPEligibilityPCPDetails', function (event, args) {

                    // var p = $('.modalContent').delay(990000).html('>>>' + $('#ppMemberDemographicsContainer').html()); 
                    // p.appendTo('#');

                    console.log('@ROOTSCOPE.ON');
                    console.log('  >  NEWVAL=' + args.item.PcpName); 
                    $scope.item = args.item;

                    //Allow for ng lifecycle to complete before updating content
                    setTimeout(function () {
                        $('#modalContainerGeneral').addClass('modalAssignedPCPDetail').attr('modalClass', 'modalAssignedPCPDetail').fadeIn('fast');

                        var a = $('#ppMemberPCPContainer').clone();
                        $(a).appendTo('#modalContainerGeneral .modalContent');
                        $('#modalContainerGeneral').appendTo('#eligRes');

                        $('#modalContainerGeneral .modalContent #ppMemberPCPContainer').show(); 
                    }, 500);
                    
                });


    
    }]);


})();


