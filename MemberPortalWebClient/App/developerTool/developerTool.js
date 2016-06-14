(function() {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');
    //var toogleDebugTool = $('meta[name="DebugTool"]').attr('content');

    var app = angular.module('DeveloperTool', []);

    function DataInspector($rootScope, enabled) {
        var dataItems = [];

        var addDataItem = function(item) {
            if (!enabled) { return; }

            item.timestamp = new Date();
            item.dataString = JSON.stringify(item.data, null, '  ');
            dataItems.push(item);
            $rootScope.$broadcast('dt-add', dataItems);
        };
        var updateDataItem = function(item) {
            item.timestamp = new Date();
            item.dataString = JSON.stringify(item.data, null, '  ');

            for (var i = 0; i < dataItems.length; i++) {
                if (dataItems[i].name == item.name) {
                    dataItems[i] = item;
                    return;
                }
            }
            $rootScope.$broadcast('dt-update', dataItems);
        };

        return {
            add: addDataItem,
            update: updateDataItem,
            items: dataItems
        };
    }

    //Provider
    app.provider('dataInspector', [function dataInspectorProvider() {
        var enabled = false;

        this.enableDataInspector = function(value) {
            enabled = !!value;
        };

        this.$get = ['$rootScope', function dataInspectorFactory($rootScope) {

            return new DataInspector($rootScope, enabled);
        }];


    }]);



    //Binding Directive
    //This directive is to be used anywhere there is data you would like to expose into the datainspector.
    app.directive("dtWatch", ['dataInspector', function (dataInspector) {
        return {
            scope: {
                name: '@dtName',
                data: '=dtData'
            },
            restrict: "A",
            link: function(scope, element, attrs) {
                //Create Watcher for value in scope.data, on-change, send to factory
                //dataInspector.FactoryCall(name, data);

                dataInspector.add({ name: scope.name, data: scope.data });
                scope.$watch(scope.data, function() {
                    dataInspector.update({ name: scope.name, data: scope.data });
                });
            }
        };
    }]);

    app.directive("dtToolbar", function() {
        return {
            scope: {
                data: '='
            },
            restrict: "E",
            transclude: true,
            templateUrl: urlBase + '/App/components/developerTool/debugBar.html' + cacheBust,
            controller: 'dtToolbarCtrl',
            controllerAs: 'ctrl'
        };
    });

    app.controller("dtToolbarCtrl", ['$rootScope','$scope', 'dataInspector', function ($rootScope, $scope, dataInspector) {
        $scope.items = dataInspector.items;
        $rootScope.$on('dt-update', function (event, args) {
            $scope.items = args;
        });
    }]);


})();