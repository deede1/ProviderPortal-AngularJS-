(function () {
    var app = angular.module('MemberPortalDirectives');

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var toogleDebugTool = $('meta[name="DebugTool"]').attr('content');

    //JCAST 4.23.15 Hide for PROD 
    if (document.domain == 'members.iehp.org') {
        toogleDebugTool = document.domain;  
    }


    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    //app.directive("debugTool" + toogleDebugTool, function () {
    app.directive("debugTool", function () {
        return {
            scope: {
                data: '='
            },
            restrict: "EA",
            transclude: true,
            templateUrl: urlBase + '/App/directives/debug-tool/debugTool.html' + cacheBust,
            controller: 'debugToolCtrl',
            controllerAs: 'ctrl'
        };
    });

    

    app.controller('debugToolCtrl', ['$scope', 'authStatusService', 'authService', '$rootScope', function ($scope, authStatusService, authService, $rootScope) {
        $scope.hide = true;
        $scope.debugToggleAction = 'Show';
        $scope.authStatus = authStatusService.getStatus();

        $scope.refreshToken = function() {
            authService.refreshToken();
        };


        $scope.dataString = function () {
            return JSON.stringify($scope.data, null, "  ");
        };

        $scope.authStatusString = function() {
            var status = authStatusService.getStatus();
            //status.expires = new Date(status.expires);
            //status.issued = new Date(status.issued);
            return JSON.stringify(status, null, "  ");
        };

        $scope.toggleHide = function () {
            $scope.hide = !$scope.hide;
            $scope.debugToggleAction = ($scope.hide) ? 'Show' : 'Hide';
        };

        $scope.toggleLoading = function() {
            $scope.$parent.loading = !$scope.$parent.loading;
        };

        $scope.toggleErrorMessage = function() {
            if ($scope.$parent.errorMessage == '') {
                $scope.$parent.errorMessage = "Error Message";
            } else {
                $scope.$parent.errorMessage = "";
            }
        };

        $scope.test = function() {
            authService.test().success(function() {
                alert('yay');
            }).error(function() {
                alert('boo');
            });
        };

        $scope.keepAlive = function() {
            $rootScope.$broadcast('inactivity-prompt');
        };

    }]);



    /* Data Node */
    app.directive("debugToolDataNode", function () {
        return {
            scope: {
                name: '@',
                data: '='
            },
            restrict: "E",
            templateUrl: urlBase + '/App/directives/debug-tool/debugToolDataNode.html' + cacheBust,
            controller: 'debugToolDataNodeCtrl',
            controllerAs: 'ctrl'
        };
    });

    app.controller('debugToolDataNodeCtrl', ['$scope', function ($scope) {

        $scope.dataString = function () {
            return JSON.stringify($scope.data, null, "  ");
        };

    }]);
})();


