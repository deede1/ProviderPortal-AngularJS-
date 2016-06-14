(function () {
    'use strict';

    angular
		.module('MemberPortal')
		.controller('MemberHealthRecordController', MemberHealthRecordController);

    MemberHealthRecordController.$inject = ['$scope', '$q', '$state', 'memberDataService', 'contentAuthorizationService', '$window', '$rootScope'];

    function MemberHealthRecordController($scope, $q, $state, memberDataService, contentAuthorizationService, $window, $rootScope) {
        $scope.IEHPID = $state.params.iehpId;
        $scope.loading = true;
        $scope.errorMessage = '';
        $scope.printDiv = false;
        $scope.goBack = function () {
            $window.history.back();


        };
        $scope.sections = {
            'CI': true,
            'RA': true,
            'MV': true,
            'RxH': true,
            'LR': true,
            'IM': true
        };

        $scope.Demo = null;
        $scope.Immunizations = null;


        function lab(dos, testcode, desc, result) {
            this.dos = dos;
            this.testcode = testcode;
            this.desc = desc;
            this.result = result;
        }

        $scope.PLabs = [];

        function GetMemberDemographics(memberID) {

            var promise = memberDataService.GetMemberDemographics(memberID).then(function (data) {
                $scope.loading = false;
                if (data.data != null) {
                    $scope.Demo = data.data;

                } else {
                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                }
            });
            return promise;

        }

        function GetMemberImmunizations(memberID) {
            var promise = memberDataService.GetMemberImmunizations(memberID).then(function (data) {
                $scope.loading = false;
                if (data.data != null) {
                    $scope.Immunizations = {
                        'DtapVaccines': data.data.DtapVaccines,
                        'FluVaccines': data.data.FluVaccines,
                        'HepAVaccines': data.data.HepAVaccines,
                        'HepBVaccines': data.data.HepBVaccines,
                        'HibVaccines': data.data.HibVaccines,
                        'MeningococcalVaccines': data.data.MeningococcalVaccines,
                        'MmrVaccines': data.data.MmrVaccines,
                        'PneumoConjVaccines': data.data.PneumoConjVaccines,
                        'PolioVaccines': data.data.PolioVaccines,
                        'VaricellaVaccines': data.data.VaricellaVaccines
                    };
                    var ImmunizationDetails = {};
                    ImmunizationDetails.Gender = data.data.Gender;
                    ImmunizationDetails.HadChickenpox = data.data.HadChickenpox;
                    ImmunizationDetails.HadMeasles = data.data.HadMeasles;
                    ImmunizationDetails.FullName = data.data.FullName;
                    ImmunizationDetails.DateOfBirth = data.data.DateOfBirth;
                    ImmunizationDetails.SubscriberNumber = data.data.SubscriberNumber;
                    $scope.Immunizations['ImmunizationDetails'] = ImmunizationDetails;

                }
                //else {
                //    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                //}
            });
            return promise;
        }



        function GetMemberHealthRecord(memberID) {
            var promise1 = GetMemberDemographics(memberID.slice(0, 12));
            var promise2 = GetMemberImmunizations(memberID.slice(0, 12));
            $q.all([promise1, promise2]).then(function (data) {
                $scope.loading = false;
            });
        };

        function GetAllData(memberID) {
            var promise1 = GetMemberAlerts(memberID.slice(0, 12));
            var promise2 = GetMemberVisits(memberID);
            var promise3 = GetMemberRx(memberID.slice(0, 12));
            var promise4 = GetMemberLabs(memberID.slice(0, 12));
            $q.all([promise1, promise2, promise3, promise4]).then(function (data) {

            });
        }



        function GetMemberLabs(memberID) {
            var requestParam = {
                SubscriberNumber: memberID,
                IsApiPaging: false,
                PageNumber: "0",
                RowsPerPage: "1000",
                Sort: []
            };
            memberDataService.GetMemberLabs(JSON.stringify(requestParam)).success(function (data) {

                if (data != null) {
                    _.each(data.List, function (l) {
                        if (l) {
                            _.each(l.Result, function (ll) {
                                $scope.PLabs.push(new lab(l.DateOfService, ll.TestCode, ll.TestDescription, ll.Result));
                            });
                        }
                    });
                     
                    $scope.PLabs = _.filter($scope.PLabs, function (d) {///past 12 months only
                        return moment().diff(moment(d.dos), 'months', true) <= 12;
                    });
                 
                    //format dates
                    _.each($scope.PLabs, function (v) {
                        if (v.dos != null) {
                            v.dos = moment(v.dos).format("MM/DD/YYYY");
                        }


                    });
                }

            });
        }





        function GetMemberRx(memberID) {
            var requestParam = {
                SubscriberNumber: memberID,
                IsApiPaging: false,
                PageNumber: "0",
                RowsPerPage: "1000",
                Sort: []

            };
            memberDataService.GetMemberRx(JSON.stringify(requestParam)).success(function (data) {

                if (data != null) {

                

                    // $scope.PRx = data.List;
                    $scope.PRx = _.filter(data.List, function (d) {///past 12 months only
                        return moment().diff(moment(d.OrderDate), 'months', true) <= 12;
                    });

                    //format dates
                    _.each($scope.PRx, function (v) {
                        if (v.OrderDate != null) {
                            v.OrderDate = moment(v.OrderDate).format("MM/DD/YYYY");
                        }
                    });

                 
                }
            });
        }






        function GetMemberVisits(memberID) {
            var requestParam = {
                SubscriberNumber: memberID,
                IsApiPaging: false,
                PageNumber: "0",
                RowsPerPage: "10000",
                Sort: []
            };
            memberDataService.GetMemberVisits(JSON.stringify(requestParam)).success(function (data) {
                if (data != null) {

                   




                    $scope.PVisits = _.filter(data.List, function (d) {///past 12 months only
                        return moment().diff(moment(d.admitDate), 'months', true) <= 12;
                    });
                   
                    //format dates
                    _.each($scope.PVisits, function (v) {
                        if (v.admitDate != null) {
                            v.admitDate = moment(v.admitDate).format("MM/DD/YYYY");
                        }
                        if (v.thruDate != null) {
                            v.thruDate = moment(v.thruDate).format("MM/DD/YYYY");
                        }
                        if (v.caprimDate != null) {
                            v.caprimDate = moment(v.caprimDate).format("MM/DD/YYYY");
                        }
                        if (v.dos) {
                            v.dos = moment(v.dos).format("MM/DD/YYYY");
                        }

                    });
                    console.log($scope.PVisits);
                }
            });

        }





        function GetMemberAlerts(memberID) {
            var requestParam = {
                MemberId: memberID,
                IsApiPaging: false,
                PageNumber: "0",
                RowsPerPage: "10000",
                Sort: []
            };
            memberDataService.GetMemberAlerts(JSON.stringify(requestParam)).success(function (data) {

                if (data != null) {
                    $scope.PAlerts = data.List;
                }
            });

        }




        $scope.print = function () {
            $scope.printDiv = true;
            GetAllData($scope.IEHPID);
            var print = function () {
                window.print();
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.printDiv = false;
                    });
                
                }, 100);
            };
          setTimeout(print, 1000);



        };





        //load data
        GetMemberHealthRecord($scope.IEHPID);

        //========================= CONTENT AUTHORIZATION DEFAULTS  
        $scope.siteItem = [];
        $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);

    }

})();