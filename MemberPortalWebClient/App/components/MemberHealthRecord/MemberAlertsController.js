(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('MemberAlertsController', MemberAlertsController);

    MemberAlertsController.$inject = ['$scope', '$q', 'memberDataService'];

    function MemberAlertsController($scope, $q, memberDataService) {
      
        //paging
        $scope.totalPages = 0;
        $scope.currentPage = 1;
        $scope.rowsPerPage = 10;
        $scope.startItem = function (currentPage) {
            if (currentPage) {
                return (currentPage - 1) * $scope.rowsPerPage + 1;
            } else {
                return (1 - 1) * $scope.rowsPerPage + 1;
            }
        };
        $scope.endItem = function (currentPage) {
            var lastPotItem;
            if (currentPage) {
                lastPotItem = currentPage * $scope.rowsPerPage;
                if (lastPotItem > $scope.TotalListCount)
                    lastPotItem = $scope.TotalListCount;
            } else {
                lastPotItem = 1 * $scope.rowsPerPage;
                if (lastPotItem > $scope.TotalListCount)
                    lastPotItem = $scope.TotalListCount;
            }
            return lastPotItem;
        };

        //sorting
        $scope.sortCol = "AlertId";
        $scope.sortReverse = true;
        $scope.changeSort = function (colName) {
            if (colName === $scope.sortCol) {
                $scope.sortReverse = !$scope.sortReverse;
            } else {
                $scope.sortCol = colName;
                $scope.sortReverse = true;
            }

        };


        function GetMemberAlerts(memberID) {
            var requestParam = {
                MemberId: memberID,
                IsApiPaging: false,
                PageNumber: "0",
                RowsPerPage: "100000",
                Sort: []
            };
            memberDataService.GetMemberAlerts(JSON.stringify(requestParam)).success(function (data) {
                $scope.$parent.loading = false;
                if (data!= null) {
                    $scope.Alerts = data.List;
                    _.each($scope.Alerts, function (v) {
                        //FORMAT DATES
                        if (v.MemberAcknowledgementDate != null) {
                            v.MemberAcknowledgementDate = moment(v.MemberAcknowledgementDate);
                        }
                    });
                    $scope.TotalListCount = data.List.length;
                    $scope.totalPages = Math.ceil(data.List.length / $scope.rowsPerPage);
                   
                } else {
                    $scope.$parent.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                }
          }).error(function () {
              $scope.$parent.loading = false;
              $scope.$parent.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
          });
          
        }

        $scope.paginationLimit = function () {
            return $scope.rowsPerPage * $scope.currentPage;
        };

        $scope.hasMoreItemsToShow = function () {
            return $scope.currentPage < $scope.totalPages;
        };
        $scope.showMoreItems = function () {
            $scope.currentPage = $scope.currentPage + 1;
        };

        $scope.hasLessItemsToShow = function () {
            return $scope.currentPage > 1;
        };
        $scope.showLessItems = function () {
            $scope.currentPage = $scope.currentPage - 1;
        };

        GetMemberAlerts($scope.$parent.IEHPID.slice(0, 12));






    }

})();