(
    function () {
    var app = angular.module('MemberPortalDirectives');
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');
    app.directive("rosterTitleHeader", function () {
        return {
            scope: {
                providernumber: "@providernumber",
                providertaxid: "@providertaxid",
                ipacode :"@ipacode",
                csvbubbletitle: "@csvbubbletitle"
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/pp-roster-title-header/ppRosterTitleHeader.html' + cacheBust,
            controller: 'PPRosterTitleHeaderController'
        };
    });


      
    //============= CONTROLLER
    app.controller('PPRosterTitleHeaderController',
    [
        '$scope', '$rootScope', '$attrs', '$element','memberDataService',
        function ($scope, $rootScope, $attrs, $element, memberDataService) {
             

            $scope.toggleView = function () {
                $scope.titleHeaderParam.displayFullView = !$scope.titleHeaderParam.displayFullView;
            };


            $scope.openCSVFile = function (inRequestParameters) {

                console.log('PROVIDERNUMBER:' + inRequestParameters.ProviderNumber);
                console.log('IPA:' + inRequestParameters.IPA);
                console.log('PROVIDERTAXID:' + inRequestParameters.ProviderTaxId);



                console.dir(inRequestParameters);

                memberDataService.fetchPCCI_CSV(JSON.stringify(inRequestParameters)).success(function (data) {
                    var link = document.createElement('a');
                    link.download = 'test111.csv';
                    link.href = "data:application/octet-stream;filename=test123.csv;charset=utf-16le;base64," + window.encodeURIComponent(data.FileContent);
                    link.click();
                }).error(
                {


                });
            }

        }]
        );


}

)();
