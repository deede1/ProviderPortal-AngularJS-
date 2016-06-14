(function () {
    var app = angular.module('pascalprecht.translate');
    app.factory("$translateStaticFilesLoader", ["$q", "$http", function($q, $http) {
        return function (input) {
            if (!input || !angular.isString(input.prefix) || !angular.isString(input.suffix))
                throw new Error("Couldn't load static files, no prefix or suffix specified!");

            var deferred = $q.defer();

            return $http({ url: [input.prefix, input.key, input.suffix].join(""), method: "GET", params: "" })
                .success(function(result) { deferred.resolve(result); })
                .error(function() { deferred.reject(input.key); }), deferred.promise;
        };
    }]);
})();


