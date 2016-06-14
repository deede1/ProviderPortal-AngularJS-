(function () {
    var app = angular.module('MemberPortalDirectives'); 
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content'); 
    app.directive("ppEligibilityPcpDetails",  function ( ) {
        return {
            scope: { 
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/pp-eligibility-pcp-details/ppEligibilityPCPDetails.html' + cacheBust,
            controller: 'PPMemberPCPController',
            controllerAs: 'ctrl'
        };
    });


    //============= CONTROLLER
    app.controller('PPMemberPCPController',
        ['$scope', 'memberDataService', '$rootScope',
            function ($scope, memberDataService, $rootScope) {
            
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
                       //keep modal in parent element $('#modalContainerGeneral').appendTo('#eligRes');

                        $('#modalContainerGeneral .modalContent #ppMemberPCPContainer').show();
                        $('.modalContainer').show();
                    }, 500);
                    
                });


    
    }]);


})();


