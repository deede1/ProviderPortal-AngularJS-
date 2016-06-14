(function () {
    'use strict';

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    angular.module('MemberPortalDirectives')
        .directive('pphmcmr', function () {
            return {
                restrict: 'EA',
                templateUrl: urlBase + '/App/directives/pp-rosters-hm-care-management-reports/RosterHM_CareManagementReports_members.html' + cacheBust,
                scope: {
                            provider: '=provider',
                            members: '=members',
                            resetMemberPage: '=resetMemberPage',
                            parentindex: '=parentindex',
                            wsedo: '=wsedo'
                },
                controller: controller
        };
    });

    controller.$inject = ['$scope', '$filter', 'memberDataService', '$uibModal'];

    function controller($scope, $filter, memberDataService, $uibModal) {
       // console.log($scope.provider, $scope.members, $scope.parentindex, $scope.wsedo, $scope.loading);
        $scope.loading = false;
        $scope.$watch('resetMemberPage', function () {
                $scope.currentPage = 1;
        });

        var rosterTypeCode = "HMCMR";
        $scope.savePDF = false;
        if ($scope.members) {
            _.each($scope.members.List, function (m) {
                m.PlanCreateDate = moment(m.PlanCreateDate).format("MM/DD/YYYY");
                m.showDetails = false;
            });
        }
        //===========================PAGINATION
        $scope.rowsPerPage = 10;
        if ($scope.members) {
            $scope.totalPages = $scope.members.ListMetaData.TotalPageCount;
        } else {
            $scope.totalPages = 1;
        }
    
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
                if (lastPotItem > $scope.members.ListMetaData.TotalListCount)
                    lastPotItem = $scope.members.ListMetaData.TotalListCount;
            } else {
                lastPotItem = 1 * $scope.rowsPerPage;
                if (lastPotItem > $scope.members.ListMetaData.TotalListCount)
                    lastPotItem = $scope.members.ListMetaData.TotalListCount;
            }

            return lastPotItem;
        };
        $scope.pageChanged = function(viewLevel, rosterType, criteriaObject, currentPage) {
            $scope.loading = true;
            $scope.requestParameters = {}; //Init

            //var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.wsedo];
            var reqO = memberDataService.getWebServiceObject($scope.wsedo);
            var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterType); // (object, Key, Value)  
            var reqParams = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].RequiredParams;
            $scope.requestParameters = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].Params;

            ////Check for required parameter defined in WSEDO 
            //if (reqParams.hasOwnProperty('ProviderTaxId'))
            //    $scope.requestParameters.ProviderTaxId = $rootScope.ProviderTaxID;
            $scope.requestParameters.ProviderNumber = $scope.provider.ProviderNumber;
            $scope.requestParameters.PageNumber = currentPage;
            $scope.requestParameters.RowsPerPage = $scope.rowsPerPage;
            ////Add or Update New criteria not available in base Object
            //jQuery.each(criteriaObject, function(i, val) {
            //    $scope.requestParameters[i] = val;
            //});

            memberDataService.GetRosterSubViewDetails($scope.wsedo, rosterType, viewLevel, JSON.stringify($scope.requestParameters)).success(function (data) {
                $scope.loading = false;
                $scope.members = data;
                if ($scope.members) {
                    _.each($scope.members.List, function (m) {
                        m.PlanCreateDate = moment(m.PlanCreateDate).format("MM/DD/YYYY");
                        console.log(moment(m.PlanCreateDate).format("MM/DD/YYYY"));
                        m.showDetails = false;
                    });
                }
                $scope.totalPages = data.ListMetaData.TotalPageCount;


            }).error(function () {
                  $scope.loading = false;
             //   console.log('@sorting RosterHM_HMCMRController ERROR GETTING DETAILS! ');
            
                 $scope.errorMessage= 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
            });
        };


        //=============sorting
        $scope.sortCol = 'MemberLName';
	    $scope.sortDirection = 'ascending';
	    $scope.order = function (colName, viewLevel, rosterType, criteriaObject, rosterRow) {
	        $scope.loading = true;
	        //$scope.currentRow = rosterRow;
	        if (colName === $scope.sortCol)
	            $scope.sortDirection = $scope.sortDirection === 'ascending' ? 'descending' : 'ascending';
	        else {
	            $scope.sortCol = colName;
	            $scope.sortDirection = 'ascending';
	        }

	        $scope.requestParameters = {}; //Init

	        //var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.wsedo];
	        var reqO = memberDataService.getWebServiceObject($scope.wsedo);
	        var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterType); // (object, Key, Value)  
	        var reqParams = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].RequiredParams;
	        $scope.requestParameters = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].Params;

	        //Check for required parameter defined in WSEDO 
	        //if (reqParams.hasOwnProperty('ProviderTaxId'))
	        //    $scope.requestParameters.ProviderTaxId = $rootScope.ProviderTaxID;


	        $scope.requestParameters.ProviderNumber = $scope.provider.ProviderNumber;
	        $scope.requestParameters.Sort[0].name = $scope.sortCol;
	        $scope.requestParameters.Sort[0].direction = $scope.sortDirection;
	        //Add or Update New criteria not available in base Object
	        jQuery.each(criteriaObject, function (i, val) {
	            $scope.requestParameters[i] = val;
	        });

	        memberDataService.GetRosterSubViewDetails($scope.wsedo, rosterType, viewLevel, JSON.stringify($scope.requestParameters)).success(function (data) {
	            $scope.loading = false;
	            $scope.members = data;
	            if ($scope.members) {
	                _.each($scope.members.List, function (m) {
	                    m.PlanCreateDate = moment(m.PlanCreateDate).format("MM/DD/YYYY");
	                    console.log(moment(m.PlanCreateDate).format("MM/DD/YYYY"));
	                    m.showDetails = false;
	                });
	            }
	            $scope.totalPages = data.ListMetaData.TotalPageCount;

	        }).error(function () {
	            //console.log('@sorting RosterHM_HMCMRController ERROR GETTING DETAILS! ');
	            $scope.loading = false;
	             $scope.errorMessage= 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
	        });


	    };

	



       // $scope.rosterTypeCode = $state.$current.ownParams.CGC.value();

	    $scope.rowSelectHAR = function (item) {
	        $scope.loading = true;
          
            memberDataService.GetCarePlanHar(item.PlanFileName).success(function(data) {
                if (data != null) {
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(new Blob([data], { type: 'application/pdf' }), item.PlanFileName);
                    } else {
                        $scope.loading = false;
                        var file = new Blob([data], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                    }
                } else {
                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                }
            }).error(function() {
                $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';


            });
        };
        
        $scope.printDiv = function (target,parentIndex) {
           
            var restorepage = $('body').html();
            var printcontent = $('#' + target).clone();
            $('body').empty().html(printcontent);
            window.print();
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.printAll = false;
                });
                //$('body').html(restorepage);
                location.reload();
            }, 50);
          
            $scope.printAll = true;

         
        };

        $scope.getPdf = function(target) {
            $scope.savePDF = true;
            $scope.loading = true;


            setTimeout(function() {
                memberDataService.GetPdfData($("#" + target).html()).success(function(response) {
                    $scope.loading = false;
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(new Blob([response], { type: 'application/pdf' }), "File");
                    } else {
                        var file = new Blob([response], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                    }

                    setTimeout(function() {
                        $scope.$apply(function () {
                            $scope.savePDF = false;
                            });
                            }, 100);
           

                })}, 500);

        };
        $scope.rowSelectMedHok = function (rosterType, viewLevel, criteriaObject, rosterRow) {
            rosterRow.showDetails = !rosterRow.showDetails;
            if (rosterRow.showDetails) {
                $scope.requestParameters = {}; //Init

                // var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.wsedo];
                  var reqO = memberDataService.getWebServiceObject($scope.wsedo);
                var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterType); // (object, Key, Value)  
                var reqParams = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].RequiredParams;
                $scope.requestParameters = memberDataService.GetObjectsFromJSON(rosterObject, 'ViewLevel', viewLevel)[0].Params;

                //Check for required parameter defined in WSEDO 
                if (reqParams.hasOwnProperty('ProviderTaxId'))
                    $scope.requestParameters.ProviderTaxId = $rootScope.ProviderTaxID;

                //Add or Update New criteria not available in base Object
                jQuery.each(criteriaObject, function (i, val) {
                    $scope.requestParameters[i] = val;
                });
        
                memberDataService.GetRosterSubViewDetails($scope.wsedo, rosterType, viewLevel, JSON.stringify($scope.requestParameters)).success(function (data) {
                  
                    var current_member = _.filter($scope.members.List, function (m) { return m.SubscriberNumber === rosterRow.SubscriberNumber && m.Source === rosterRow.Source; });
                    current_member[0].rosterSubViewLevel3 = data[0];
                    _.each(current_member[0].rosterSubViewLevel3.ProblemModel, function(pm) {
                        pm.showDetails = true;

                    });

                }).error(function () {
                    //console.log('@rowSelectMedHok ERROR GETTING DETAILS! ');
                     $scope.errorMessage= 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                });


            }

         

        }
 
    }






})();