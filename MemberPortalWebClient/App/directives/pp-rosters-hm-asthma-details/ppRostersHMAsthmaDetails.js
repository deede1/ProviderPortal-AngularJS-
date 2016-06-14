(function () {
    var app = angular.module('MemberPortalDirectives'); 
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content'); 
    app.directive("rosterHmarDetails",  function ( ) {
        return {
            scope: true,
        restrict: "EA",
        //replace: true, 
        templateUrl: urlBase + '/App/directives/pp-rosters-hm-asthma-details/ppRostersHMAsthmaDetails.html' + cacheBust,
        controller: 'ppRostersHMARDetailsController'  
        };
    });
 
    //============= CONTROLLER
    app.controller('ppRostersHMARDetailsController',
    [
        '$scope', '$rootScope', '$attrs', '$element', '$compile', 'memberDataService',
        function ($scope, $rootScope, $attrs, $element, $compile, memberDataService) {
            console.log('@ROSTERS PCCID  DETAILS CONTROLLER >' + $scope.title); 

            $scope.currentPage = 1;
            $scope.pages = [];
            $scope.visiblePageOptions = 3;
            $scope.rosterType = "";
            $scope.startingListIndex = 0;
            $scope.List = [];

            //====== TITLE/ HEADER
            $scope.titleHeaderParam = {
                title: 'Asthma Record', 
                displayImportExport: false,
                displayViewOptionFull: false,
                displayViewOptionGrouped: false,
                titleBackgroundClass: 'headerAccordion'
            };
             



            //======= LISTENER
            $scope.$on('updateRosterDetails', function (event, dataObject) {
                console.log('@HMAR > UPDATE ROSTER DET');
                $scope.List = dataObject.List;
                $scope.startingListIndex = dataObject.startingListIndex;
 
            });
            $scope.$on('updateDetails', function (event, dataObject) {
                console.log('@DETAILS UPDATE DETAILS for MEMBER:' + dataObject.subscriberNumber);
               //    $scope.RetrieveRosterDetails(dataObject.rosterType, 1, '', dataObject.subscriberNumber);
            });


            //===== FETCH ROSTER DETAILS
            $scope.RetrieveRosterDetails = function (rosterType, pageIndex, sortBy, subNo) {
                console.log('@@RETRIEVE ROSTER DETAILS 1  Fetching ROSTER:' + rosterType + ' SUBNO:' + subNo + ' PAGEINDEX:' + pageIndex + ' SORTBY:' + sortBy);
                $scope.loading = true;
                $scope.currentPage = pageIndex;
                if (pageIndex == '')
                    pageIndex = 1;

                //===== REQUEST OBJECT
                var requestParameters = {};
                requestParameters.SubscriberNumber = subNo;
                requestParameters.PersonNumber = '01';
                requestParameters.ProviderTaxID = '330861491';
                requestParameters.ProviderNumber = '000000001082';
                requestParameters.PageNumber = pageIndex;
                requestParameters.RowsPerPage = $scope.RowsPerPage;
                requestParameters.DaysBack = '2000'; //===== NURSE ADVICE LINE ROSTER
                requestParameters.UserId = 'DevTester';

                $scope.detailData = {};
                $scope.errorMessage = '';
                console.log('... @GET ROSTER DETAILS  ROSTERTYPE:' + rosterType + ' PAGE:' + requestParameters.PageNumber);

                memberDataService.GetRosterDetails(rosterType, JSON.stringify(requestParameters)).success(function (data) {
                    $scope.loading = false;

                    // $scope.item = item;

                    console.log('@ROST PARTVIEW CONTROLLER SUCCESS!!');
                    if (data != null) {
                        if (data.ListMetaData.TotalListCount !== null) {
                            console.log('@RPVC ROSTER DETAILS ...DATA NOT NULL >' + data.ListMetaData.TotalListCount);

                            $scope.paramObject2.rosterType = rosterType; //$scope.rosterType
                            $scope.paramObject2.startPageIndex = $scope.startPageIndex;
                            $scope.paramObject2.sortBy = $scope.sortBy;
                            $scope.paramObject2.totalPageCount = data.ListMetaData.TotalPageCount;
                            $scope.paramObject2.totalListCount = data.ListMetaData.TotalListCount;
                            $scope.paramObject2.visiblePageOptions = $scope.visiblePageOptions;
                            $scope.paramObject2.rowsPerPage = $scope.RowsPerPage;
                            $scope.paramObject2.currentPageIndex = $scope.currentPage;

                            
                            $scope.limitRows = data.List / (data.List.count - (data.List.count % 4));
                            console.log('LIMIT ROWS:' + $scope.limitRows);

                            $scope.List = data.List;
                            var dataObject = {
                                List: data.List,
                                startingListIndex: $scope.RowsPerPage * ($scope.currentPage - 1)
                            }



                            //==== PAGINATION
                            console.log(' NUM OF PAGES:' + data.ListMetaData.TotalPageCount);
                            $scope.totalPageCount = data.ListMetaData.TotalPageCount;
                            $scope.TotalListCount = data.ListMetaData.TotalListCount;

                            $scope.$broadcast('updateRosterDetails', dataObject);


                            //   $scope.currentPageIndex = 1;
                            //    $scope.startPageIndex = 1;
                            //   if ($scope.startPageIndex == 1) {



                            //  };

                            //   $scope.$broadcast('updatePagination');


                            //$scope.$broadcast('updatePagination',
                            //  {
                            //      rosterType: rosterType, //$scope.rosterType
                            //      startPageIndex: $scope.startPageIndex,
                            //      sortBy: $scope.sortBy,
                            //      totalPageCount: $scope.totalPageCount,
                            //      TotalListCount: data.ListMetaData.TotalListCount,
                            //      visiblePageOptions: $scope.visiblePageOptions,
                            //      RowsPerPage: $scope.RowsPerPage,
                            //      currentPageIndex: $scope.currentPage 
                            //  });

                            //  }

                        } else {
                            $scope.errorMessage = '@RPVC ROSTER DETAILS No Data Available.';

                        }
                    } else {
                        $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                    }
                }).error(function () {
                    $scope.loading = false;
                    console.log('@RPVC ROSTER DETAILS .......!!ERROR!!');
                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                    console.log('!!!' + $scope.errorMessage);
                });
            }


         


        }]
        );


})();


