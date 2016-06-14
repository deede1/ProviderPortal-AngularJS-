(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('CensusReportController', CensusReportController);

    CensusReportController.$inject = ['$scope', '$rootScope', '$state', 'memberDataService', 'contentAuthorizationService'];

    function CensusReportController($scope, $rootScope, $state, memberDataService, contentAuthorizationService) {

        $scope.today = moment().format('MM/DD/YYYY');
        $scope.totalAuthCount = "";
        $scope.loading = true;
        $scope.errorMessage = '';
        $scope.nodatafound = '';
        $scope.hosp = null;

        //sorting
        $scope.sortCol = "";
        $scope.reverse = true;
        $scope.order = function (predicate) {
            $scope.reverse = ($scope.sortCol === predicate) ? !$scope.reverse : false;
            $scope.sortCol = predicate;
        };
        //paging
        $scope.totalPages = 0;
        $scope.currentPage = 1;
        $scope.rowsPerPage = 20;
        $scope.totalItems = 0;
        $scope.pageChanged = function (currentPage) {
            $scope.loading = true;
            $scope.currentPage = currentPage;
            GetHospitalCensusReport();
        };
        $scope.startItem = function () {
            return ($scope.currentPage - 1) * $scope.rowsPerPage + 1;
        };
        $scope.endItem = function () {
            var lastPotItem = $scope.currentPage * $scope.rowsPerPage;
            if (lastPotItem > $scope.totalItems) {
                lastPotItem = $scope.totalItems;
            }
            return lastPotItem;
        };

        $scope.DisplayAuths = function (hosp) {
            if (hosp != undefined) {
                 _.each($scope.hosp, function (a) {
                     if (a.AdmittingHospital === hosp.AdmittingHospital) {
                         a.showDetails = !a.showDetails;
                         _.each(a.Authorizations, function (au) {
                             au.DateOfBirth = moment(au.DateOfBirth);
                         });
                     } else { //close all
	                    a.showDetails = false;
	                }
	            });
	        }
        };

        function GetHospitalCensusReport() {
            var requestParam = {
                ProviderNumber: $rootScope.ProviderNumber,
                IsApiPaging: false,
                PageNumber: $scope.currentPage,
                RowsPerPage: 10000,
                Sort: []

            };
            memberDataService.GetHospitalCensusReport(JSON.stringify(requestParam)).success(function (data) {
                $scope.loading = false;
                if (data != null) {
                    if (data.length > 0) {
                        $scope.hosp = data;
                       $scope.totalAuthCount =0;
                        _.each($scope.hosp, function(h) {
                            if (h) {
                                h.showDetails = false;
                                if (h.Authorizations.length>0){ h.AdmittingHospitalId = h.Authorizations[0].AdmittingHospitalId;h.authCount = h.Authorizations.length}
                                $scope.totalAuthCount += h.Authorizations.length;
                            }
                        });
                        $scope.totalPages = Math.ceil($scope.hosp.length / $scope.rowsPerPage);//before slice
                        $scope.totalItems = $scope.hosp.length;
                        var startIndex = ($scope.currentPage - 1) * $scope.rowsPerPage;
                        var endIndex = startIndex + $scope.rowsPerPage;
                        $scope.hosp = $scope.hosp.slice(startIndex, endIndex);
                      

                    } else {
                        $scope.nodatafound = "No Inpatient Stays to Report.";
                    }
                } else {
                    $scope.nodatafound = "No Inpatient Stays to Report.";
                }
            }).error(function () {
                $scope.loading = false;
                console.log('@GetCensusReport.......!!ERROR!!');
                $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                console.log('!!!' + $scope.errorMessage);

            });
        };

        $scope.GetDiagnosisList = function (hosp, auth) {
            auth.showDetails = !auth.showDetails;
            if (auth.showDetails) {
                $scope.loadingDiagnosis = true;
                memberDataService.GetDiagnosisList(auth.AuthNumber).success(function (data) {
                    $scope.loadingDiagnosis = false;
                    if (data != null) {
                       auth.DiagnosisList = data;
                    } else {
                        $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                    }
                }).error(function () {
                    $scope.loadingDiagnosis = false;
                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                });
            }

        };


        //========================= CONTENT AUTHORIZATION DEFAULTS  
        $scope.siteItem = [];
        $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);


        GetHospitalCensusReport();
    }

})();