
(function () {
    var app = angular.module('MemberPortalDirectives');

    // Drug Form Directive
    app.directive('drugInput', ['$translate', function ($translate) {

        var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
        var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');
        return {
            require: '^form',
            restrict: 'E',
            scope: false,
            templateUrl: urlBase + '/App/directives/drug-request/drugInput.html' + cacheBust,
            link: function (scope, element, attrs, formCtrl) {
                scope.form = formCtrl;
                scope.emptyDrugField = true;
                scope.$watchCollection("drugList", function (newDrugs, oldDrugs) {
                    if (newDrugs && newDrugs.length == 0) {
                        formCtrl.$setValidity('emptyField', false);
                    }
                    else {
                        formCtrl.$setValidity('emptyField', true);
                    }
                });
                scope.SetFocus = function (inputShow, inputHide) {
                    angular.element("li." + inputHide).removeClass('active');
                    angular.element("li." + inputShow).addClass('active');
                    angular.element("div." + inputShow).addClass('active');
                    angular.element("div." + inputHide).removeClass('active');
                    //Set the input field to focus.
                    angular.element("input[name='" + inputShow + "']").focus();
                };
            },
            controller: ['$scope', function ($scope) {
                $scope.newDrug = {};
                $scope.newDrug.name = "";
                $scope.newDrug.reason = "";
                var tempDrug = {};
                var tempNewDrug = {};
                $scope.edit = false;
                $scope.currentIndex = -1;
                $scope.addMedication = addMedication;
                $scope.editReason = false;
                $scope.editName = false;

                function addMedication(tab) {
                    if (tab === "medication") {
                        if ($scope.newDrug.name && $scope.newDrug.name !== "") {
                            var temp = $scope.newDrug.reason;
                            $scope.newDrug.reason = "";
                            $scope.drugList.push($scope.newDrug);
                            $scope.newDrug = {};
                            $scope.newDrug.name = "";
                            $scope.newDrug.reason = temp;
                        }
                    } else {
                        if ($scope.newDrug.reason && $scope.newDrug.reason !== "") {
                            var tempName = $scope.newDrug.name;
                            var tempQuantity = $scope.newDrug.quantity;
                            $scope.newDrug.name = "Unknown";
                            $scope.newDrug.quantity = "Unknown";
                            $scope.drugList.push($scope.newDrug);
                            $scope.newDrug = {};
                            $scope.newDrug.name = tempName;
                            $scope.newDrug.quantity = tempQuantity;
                            $scope.newDrug.reason = "";
                        }
                    }
                };
                $scope.editDrug = function (index) {
                    if (index > -1 && $scope.edit === false) {
                        $scope.edit = true;
                        $scope.currentIndex = index;
                        //Store any new drug being added before edit.
                        tempNewDrug.name = $scope.newDrug.name;
                        tempNewDrug.quantity = $scope.newDrug.quantity;
                        tempNewDrug.reason = $scope.newDrug.reason;
                        //Store Drug in array of drugs incase of cancel.
                        tempDrug.name = $scope.drugList[index].name;
                        tempDrug.quantity = $scope.drugList[index].quantity;
                        tempDrug.reason = $scope.drugList[index].reason;
                        //Store the drug into the new drug field for edit.
                        //Add new drug back into array for binding to work.
                        $scope.newDrug.name = $scope.drugList[index].name;
                        $scope.newDrug.quantity = $scope.drugList[index].quantity;
                        //Lock other fields from being updated and set focus.
                        $scope.newDrug.reason = $scope.drugList[index].reason;
                        $scope.drugList[index] = $scope.newDrug;
                        $scope.drugList[index].edit = true;
                        if ($scope.newDrug.name === "Unknown") {
                            $scope.editReason = true;
                            //When tab is hidden use settimeout to let tab show first
                            //then focus.
                            setTimeout(function () {
                                $scope.SetFocus('ReasonTab', 'MedicationTab');
                            }, 0);
                        }
                        else {
                            $scope.editName = true;
                            setTimeout(function () {
                                $scope.SetFocus('MedicationTab', 'ReasonTab');
                            }, 0);
                        }
                    }
                };
                $scope.saveDrug = function () {
                    if ($scope.currentIndex > -1) {
                        $scope.drugList[$scope.currentIndex].edit = false;
                        $scope.edit = false;
                        $scope.drugList[$scope.currentIndex].name = $scope.newDrug.name;
                        $scope.drugList[$scope.currentIndex].quantity = $scope.newDrug.quantity;
                        $scope.drugList[$scope.currentIndex].reason = $scope.newDrug.reason;
                        $scope.newDrug = {};
                        $scope.newDrug.name = tempNewDrug.name;
                        $scope.newDrug.quantity = tempNewDrug.quantity;
                        $scope.newDrug.reason = tempNewDrug.reason;
                        tempDrug = {};
                        tempNewDrug = {};
                        $scope.currentIndex = -1;
                        $scope.editName = false;
                        $scope.editReason = false;
                    }
                };
                $scope.deleteDrug = function (index) {
                    if (index > -1) {
                        $scope.drugList.splice(index, 1);
                    }
                };
                $scope.cancelDrug = function (index) {
                    $scope.drugList[index].edit = false;
                    $scope.edit = false;
                    $scope.newDrug = {};
                    $scope.newDrug.name = tempNewDrug.name;
                    $scope.newDrug.quantity = tempNewDrug.quantity;
                    $scope.newDrug.reason = tempNewDrug.reason;
                    $scope.drugList[index].name = tempDrug.name;
                    $scope.drugList[index].quantity = tempDrug.quantity;
                    $scope.drugList[index].reason = tempDrug.reason;
                    tempDrug = {};
                    $scope.editName = false;
                    $scope.editReason = false;
                };
                $scope.emptyField = function (form, input) {
                    if (!input && $scope.submitted) {
                        return true;
                    }
                    return false;
                };
            }]
        };
    }]);
})();