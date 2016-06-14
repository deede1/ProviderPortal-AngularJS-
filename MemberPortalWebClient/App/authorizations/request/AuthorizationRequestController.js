(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('AuthorizationRequestController', AuthorizationRequestController);

    AuthorizationRequestController.$inject = ['$scope', '$rootScope', '$state', 'memberDataService', 'contentAuthorizationService', 'searchTypeService',
'$filter', 'plupLoadService'];

    function AuthorizationRequestController($scope, $rootScope, $state, memberDataService, contentAuthorizationService, searchTypeService, $filter, plupLoadService) {
        $scope.updateType = "";
        $scope.prelimSearch = true;
        $scope.loading = false;
        $scope.errorMessage = "";
        $scope.ReferredToProvider_Information = null;
        $scope.MemberInfo = null;
        $scope.ReferredToProviderInfo = "";
        $scope.ReferringProviderInfo = null;
        $scope.mdGroup = null;
        $scope.individualProviders = null;
        $scope.facilities = null;
        //$scope.showClear = false;
        $scope.searchClicked = false;
        $scope.RequestingServiceList = null;
        $scope.RequestingProviderList = [];
        $scope.ProviderAddrList = [];
        $scope.RequestingService = null;
        $scope.service_Requested = null;
        $scope.patientReqAuth = 'yes';
        $scope.decisionAuth = 'no';
        $scope.Requesting_ServiceList = null;
        $scope.RequestingServicefilter = "";
        $scope.RequestingProvider = {
        };
        $scope.referredToProvider = "";
        $scope.RequestingProviderAdd = "";
        $scope.acceptedTypes = $scope.acceptedTypes || ['CIN', 'SSN', 'IEHPID'];
        $scope.IdQuery = "";
        $scope.type = {
        };
        $scope.icd = [];
        $scope.maxIcd = 12;
        $scope.maxCpt = 25;
        $scope.ccode = "";
        $scope.validatedCPTCode = "";
        $scope.cptArray = [];

       


        function SearchMemberAndProvider() {
            $scope.loading = true;
            // $scope.searchClicked = true;
            GetMemberInformation();

            GetReferringProviderInfo($scope.RequestingProvider);

        };

        function GetMemberInformation() {

            var idType;
            switch ($scope.type.string) {
                case "SSN": //ssn
                    idType = "Ssn";
                    break;
                case "CIN": //cin
                    idType = "Cin";
                    break;
                case "IEHPID": //iehp
                    idType = "IehpId";
                    break;
            }
            var params = {
                'MemberSearchValue': $scope.IdQuery,
                'SearchType': idType,
                'DateOfService': null
            };
            memberDataService.GetMemberData(params)
                .success(function (data) {
                    if (typeof data !== 'undefined') {
                        $scope.MemberInfo = data;
                    } else {
                        $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                    }
                }).error(function (data) {
                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                })
                .finally(function () {
                    $scope.loading = false;
                });

        }

        $scope.setRequestingProvider = function (provider, address) {
            $scope.RequestingProvider.Name = provider.Name;
            $scope.RequestingProvider.ID = provider.ProvId;
            $scope.RequestingProvider.Address = address;

            // $scope.RequestingProvider = provider;
            var myModal = $('#RquestingProviderModal');
            myModal.modal('hide');

        }
        $scope.setReferringProvider = function (p, address) {
            $scope.referredToProvider = p.ProviderName;
            $scope.ReferredToProvider_Information = p;
            $scope.ReferredToProvider_Information.Addr = address;
            var myModal = $('#ReferredToProviderModal');
            myModal.modal('hide');

        };

        $scope.Clear = function () {

            $scope.IdQuery = "";
            $scope.type = {
            };
            $state.reload();
        }


        $scope.submitForm = function (form) {
            $scope.errorMessage = "";
            if (form.$valid) {
                if (form.$name === 'prelimauthRequestForm') {
                    SearchMemberAndProvider();
                    $scope.prelimSearch = false;
                }
                else if (form.$name === 'authRequestForm') {

                }

            } else {
                var error = form.$error;
                angular.forEach(error.$required, function (field) {
                    if (field.$invalid) {
                        var fieldName = field.$name;

                    }
                });
                $scope.errorMessage = 'Please fill in all required fields.';
            }
        };

        $scope.ResetForm = function (form) {
            form.$setPristine();
            $scope.prelimSearch = true;
            // $scope.prelimauthRequestForm.$setPristine();
            $scope.IdQuery = "";
            $scope.type = {
            };
            $scope.MemberInfo = null;
            $scope.icd = [];
            $scope.cptArray = [];
            $scope.RequestingService = null;
            $scope.RequestingProvider = {};
            $scope.referredToProvider = "";
            $scope.service_Requested = null;
            $scope.service_RequestedLocation = "";
            $scope.comment = "";

        };

        $scope.updateIDType = function (IdQuery) {
            $scope.IdQuery = IdQuery;
            $scope.type = searchTypeService.type($scope.IdQuery, $scope.acceptedTypes);
            //$scope.showClear = false;
        }

        $scope.$watch('type', function (newVal, oldVal) {
            if (newVal != oldVal)
                $scope.$broadcast('type', { "val": newVal });
        });






        $scope.GetReferredToServiceProviders = function () {
            $('#ReferredProviderModal').modal('toggle');
            //memberDataService.GetReferredToServiceProviders($rootScope.ProviderNumber)
            //    .success(function(data) {
            //        if (typeof data !== 'undefined' && data.length > 0) {
            //            $scope.ReferredToProviderInfo = data[0];
            //        } else {
            //            $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
            //        }
            //    }).error(function(data) {
            //        $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
            //    })
            //    .finally(function() {
            //        $scope.loading = false;
            //    });
        };

        function GetReferringProviderInfo(p) {
            memberDataService.GetReferringProviderInfo(p.ID).success(function (data) {
                if (typeof data !== 'undefined' && data[0] !== null) {
                    $scope.ReferringProviderInfo = data;
                    $scope.ReferringProviderInfo.ProviderAddr = p.Address;
                } else {
                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                }

            }).error(function (data) {
                $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';

            })
               .finally(function () {
                   $scope.loading = false;
               });
        }


        $scope.setRequestingService = function (s) {
            var myModal = $('#RquestingServiceModal');
            $scope.RequestingService = s;
            myModal.modal('hide');
            plupLoadService.initializePlupload(plup);
        };


        $scope.setRequesting_Service = function (s) {
            var myModal = $('#Rquesting_ServiceModal');
            $scope.service_Requested = s;
            myModal.modal('hide');
        };
        function plup() {


        }
        $scope.searchservice = function () {
            $scope.RequestingService = null;
            $scope.referredToProvider = "";
            $scope.ReferredToProvider_Information = null;
            $scope.RequestingServicefilter = "";
            var params = {
                'ProviderNumber': $rootScope.ProviderNumber,
                'PageNumber': 1,
                'RowsPerPage': 300,
                'IsApiPaging': false,
                'Sort':
                        [
                            {
                                'Name': 'SpecialtyCode',
                                'Direction': 'ascending'
                            }
                        ]


            };
            memberDataService.GetRequestingServiceList(params)
                .success(function (data) {

                    //  console.log(data);
                    if (typeof data !== 'undefined' && data[0] !== null) {
                        $scope.RequestingServiceList = data;
                        $('#RquestingServiceModal').modal('toggle');

                    } else {
                        $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                    }

                }).error(function (data) {
                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';

                })
                .finally(function () {
                    $scope.loading = false;
                });

        };


        $scope.searchprovider = function () {
            var params = {
                'ProviderNumber': $rootScope.ProviderNumber,
                'PageNumber': 1,
                'RowsPerPage': 300,
                'SortByProperty': null,
                'SortDescending': null
            };
            memberDataService.GetRequestingProviderList(params)
                .success(function (data) {
                    //  console.log(data);
                    if (typeof data !== 'undefined' && data[0] !== null) {
                        $scope.RequestingProviderList = data;
                        $('#RquestingProviderModal').modal('toggle');

                    } else {
                        $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                    }

                }).error(function (data) {
                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';

                })
                .finally(function () {

                });
        };

        $scope.searchReferredToprovider = function (option) {

            $scope.ReferredToProvider = "";//reset filter

            var params = {
            };
            switch (option) {
                case 'mdgrp':
                    params = {
                        'SpecialtyCode': $scope.RequestingService.SpecialtyCode,
                        'Dob': $scope.MemberInfo.MemberDateOfBirth,
                        'ProvLob': $scope.MemberInfo.MemberLob,
                        'Individual': 'false',
                        'IsApiPaging': false,
                        'PageNumber': 1,
                        'RowsPerPage': 3000,
                        'Name': null,
                        'Direction': 'ascending'
                    };
                    GetReferredToProviderInfo(params);
                    break;
                case 'individual':
                    params = {
                        'SpecialtyCode': $scope.RequestingService.SpecialtyCode,
                        'Dob': $scope.MemberInfo.MemberDateOfBirth,
                        'ProvLob': $scope.MemberInfo.MemberLob,
                        'Individual': 'true',
                        'IsApiPaging': false,
                        'PageNumber': 1,
                        'RowsPerPage': 3000,
                        'Name': null,
                        'Direction': 'ascending'
                    };
                    GetReferredToProviderInfo(params);
                    break;
                case 'facility':
                    GetReferredToProviderInfoByFacilities($rootScope.ProviderNumber);
                    break;

            }

        };


        function GetReferredToProviderInfoByFacilities(params) {
            memberDataService.RetrieveFacility(params)
                   .success(function (data) {
                       if (typeof data !== 'undefined' && data.length > 0) {
                           $scope.facilities = data;

                       } else {
                           $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                       }
                   }).error(function (data) {
                       $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                   })
                   .finally(function () {
                       $scope.loading = false;
                   });
        }


        function GetReferredToProviderInfo(params) {
            memberDataService.GetReferredToProviderInfo(params)
                      .success(function (data) {
                          if (typeof data !== 'undefined' && data.length > 0) {
                              $scope.ReferredToProviderInfo = data;

                          } else {
                              $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                          }
                      }).error(function (data) {
                          $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                      })
                      .finally(function () {
                          $scope.loading = false;
                      });
        }

        $scope.search_RequestedService = function () {
            var params = {
                'ProviderNumber': $rootScope.ProviderNumber,
                'PageNumber': 1,
                'RowsPerPage': 300,
                'SortByProperty': null,
                'SortDescending': null
            };
            memberDataService.GetServiceList(params)
                .success(function (data) {

                    if (typeof data !== 'undefined' && data[0] !== null) {
                        $scope.Requesting_ServiceList = data;
                        $('#Rquesting_ServiceModal').modal('toggle');
                    } else {
                        $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                    }

                }).error(function (data) {
                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';

                })
                .finally(function () {
                    $scope.loading = false;
                });

        };

        $scope.search_RequestedLocService = function () {
            var param = {};
            switch ($scope.service_Requested.ServiceTypeDesc) {

                case 'Outpatient':
                    param = {
                        'ProviderNumber': $rootScope.ProviderNumber,
                        'MemberLOB': $scope.MemberInfo.MemberLobCode,
                      
                        'IsApiPaging': false,
                        'PageNumber': 1,
                        'RowsPerPage': 300,
                        'Sort':
                        [
                            {
                                'Name': 'ProvId',
                                'Direction': 'ascending'
                            }
                        ]
                    };
                    memberDataService.RetrieveOutpatientServicecFacility(param)
                        .success(function (data) {
                            if (typeof data !== 'undefined' && data[0] !== null) {

                                $('#facilities_Modal').modal('toggle');
                            } else {
                                $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                            }

                        }).error(function (data) {
                            $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';

                        })
                        .finally(function () {
                            $scope.loading = false;
                        });
                    break;
                case 'Inpatient':
                    param= {
                        'ProviderNumber': $rootScope.ProviderNumber,
                        'MemberLOB': $scope.MemberInfo.MemberLobCode,
                        'IsApiPaging': false,
                        'PageNumber': 1,
                        'RowsPerPage': 300,
                        'Sort':
                        [
                            {
                                'Name': 'ProvId',
                                'Direction': 'ascending'
                            }
                        ]
                    };
                    memberDataService.RetrieveInpatientServicecFacility(param)
                        .success(function (data) {
                            if (typeof data !== 'undefined' && data[0] !== null) {

                                $('#facilities_Modal').modal('toggle');
                            } else {
                                $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                            }

                        }).error(function (data) {
                            $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';

                        })
                        .finally(function () {
                            $scope.loading = false;
                        });
                    break;
                case 'Amb Surgery Ctr':
                    param= {
                        'ProviderNumber': $rootScope.ProviderNumber,
                        'MemberLOB': $scope.MemberInfo.MemberLobCode,
                        'IsApiPaging': false,
                        'PageNumber': 1,
                        'RowsPerPage': 300,
                        'Sort':
                        [
                            {
                                'Name': 'FullName',
                                'Direction': 'ascending'
                            }
                        ]
                    };
                    memberDataService.RetrieveAmbulatorySurgeryCenters(param)
                        .success(function (data) {
                            if (typeof data !== 'undefined' && data[0] !== null) {

                                $('#facilities_Modal').modal('toggle');
                            } else {
                                $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                            }

                        }).error(function (data) {
                            $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';

                        })
                        .finally(function () {
                            $scope.loading = false;
                        });
                    break;

                default:
            }

        };

        var icd = function () {
            return {
                check: true,
                val: ""
            };

        };
        $scope.addIcd = function () {
            if ($scope.icd.length < $scope.maxIcd) {
                $scope.icd.push(icd());
            }
        };

        $scope.checkIcdCode = function (code, instance) {
            var params = {
                'icdCode': code,
                'serviceDate': moment().format('MM/DD/YYYY')
            };

            $scope.icd[instance].check = true;
            memberDataService.ValidateIcdCode(params).success(function (data) {
                $scope.icd[instance].check = data.IsValid;
            }).error(function (data) {
                $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';

            });
        }

        $scope.checkDuplicateICD = function (code, instance) {
            var icdList = _.map($scope.icd, function (icd) {
                return icd.val;
            });
            if (icdList.indexOf(code) !== instance) {
                return true;
            } else {
                return false;
            }
        }

        $scope.removeICDInput = function (index) {
            $scope.icd.splice(index, 1);
        }

        $scope.removeCPTInput = function (index) {
            $scope.cptArray.splice(index, 1);
        }
        $scope.AddCPT = function () {
            if ($scope.cptArray.length < $scope.maxCpt) {
                $scope.cptArray.push(cpt());
            }
        };

        var cpt = function () {
            return {
                code: '',
                mod: '',
                quantity: 0,
                CodeDesc: "",
                cptcodeCheck: true,
                validModCode:true,
                showDuplicateCPTError: false
            };
        };
        var checkDuplicateCPT = function (code, index) {
            var cptList = _.map($scope.cptArray, function (cpt) {
                return cpt.code.trim();
            });

            return (_.filter(cptList, function (l) { return l.toUpperCase() === code.toUpperCase() }).length > 1);

        }
        $scope.checkcptCode = function (code, index) {
            $scope.cptArray[index].showDuplicateCPTError = false;
            memberDataService.ValidateCPTCode(code).success(function (data) {
                if (typeof data !== 'undefined' && data.CodeDesc != null) {
                    $scope.cptArray[index].CodeDesc = data.CodeDesc;
                    $scope.cptArray[index].code = data.Code;
                    $scope.cptArray[index].cptcodeCheck = true;
                } else {
                    // $scope.cptArray[index].CodeDesc = data;
                    // $scope.cptArray[index].CodeDesc.CodeDesc = "invalid CPT code";
                    $scope.cptArray[index].cptcodeCheck = false;
                }

                $scope.cptArray[index].showDuplicateCPTError = checkDuplicateCPT(code, index);
            }).error(function (data) {
                $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
            });

        };

        $scope.checkModefierCode = function(code,index) {
            memberDataService.ValidateModCode(code).success(function (data) {
                if (data.Code === null && data.CodeDesc === null) {
                    $scope.cptArray[index].validModCode = false;
                } else {
                    $scope.cptArray[index].validModCode = true;
                }
                console.log(data);
            }).error(function (data) {
                $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
            });


        };


        $scope.validatePostDate = function (date) {//must be within past 30 days
            var diffDays = moment().diff(moment(date), 'days');
            var isPast30days = diffDays <= 30;
            var isNotFuture = diffDays >= 0 & !Object.is(diffDays, -0);
            return isPast30days && isNotFuture;
        };

        $scope.validatePreDate = function (date) {//can not be earlier than today
            return (moment(date)).diff(moment(), 'days') >= 0;
        };
        $scope.openModal = function (target) {
            $('#' + target).modal('toggle');
        };
        $scope.ClearICD = function () {
            $scope.icd = [];

        };
        //========================= CONTENT AUTHORIZATION DEFAULTS  
        $scope.siteItem = [];
        $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);
    }

})();