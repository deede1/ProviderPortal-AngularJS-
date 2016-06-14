(function () {
    var app = angular.module('MemberPortalDirectives');

    app.directive("yellowCard", function () {
        var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
        var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

        var link = function (scope, element, attrs) {

        };

        return {
            scope: {
                data : '='
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/immunizations/yellowCardTable.html' + cacheBust,
            controller: 'yellowCardController',
            controllerAs: 'ctrl',
            link: link
        };
    });


    app.controller('yellowCardController', ['$scope', '$location', 'memberDataService', function ($scope, $location, memberDataService) {
        $scope.errorMessage = "";
        $scope.infoMessage = "";
        $scope.loading = false; 
        $scope.TodaysDate = new Date(); 
        $scope.printYellowCard= function () {
            var YC = $('#yellowCardCont').html();
            YC = YC.replace("reducefontatprinttime", "printableFontSize");
            YC = "<div class='printableFontSize'>" + YC.replace('non-printable','" style="display:none !important') + "</div>";
            YC = $('<div/>').append(YC).html();
        
            $scope.PrintPopup(YC); 
        } 

       $scope.PrintPopup = function (data) {
            var mywindow = window.open('','ImmunizationRecord', 'height=400,width=600');
            mywindow.document.write('<html><head ><base href="' + document.domain + '"><title>Immunization Record</title>');
           // mywindow.document.write('<link rel="stylesheet" href="'+  document.domain +'/Content/site.css" type="text/css" />');
            mywindow.document.write('</head><body>');
            mywindow.document.write(data);
            mywindow.document.write('</body></html>');
     console.log(mywindow.document);
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10

            mywindow.print();
            mywindow.close();

            return true;
        }

        //$scope.GetImmunization = function () {
        //    $scope.loading = !$scope.loading;
        //    memberDataService.GetImmunization().success(function (data) {
        //        $scope.data = data;

        //        if (data == "null" || data.SubscriberNumber == null) {
        //            $scope.infoMessage = "No immunization data found.";
        //        }

        //        $scope.loading = !$scope.loading;
        //    }).error(function () {
        //        $scope.errorMessage = "There was a problem retrieving your immunization data.";
        //        $scope.loading = !$scope.loading;
        //    });
        //};


        //$scope.GetImmunization();


    }]);


})();


