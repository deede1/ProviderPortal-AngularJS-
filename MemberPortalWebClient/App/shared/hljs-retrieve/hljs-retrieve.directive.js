(function () {

    //Depends on HLJS and jQuery
    angular.module('MemberPortalDirectives').directive('hljsRetrieve', ['$compile', function ($compile) {
        function link(scope, element, attr) {
            var code = angular.element('#' + scope.target).html();

            var space_count = Math.min.apply(null, $.map(code.match(/^\s+/gm), function (x) { return x.length; })) + 4;
            var new_code = code.replace(RegExp('^\\s{' + space_count + '}', 'gm'), '');

            new_code = new_code.substring(1); //Removes a leading carriage return that appears in the highlightjs block.
            new_code = $.trim('<div hljs language="html">' + new_code) + '</div>'; //This prepends the opening div, and trims any trailing whitespace, and appends the closing div tag.

            var el = angular.element(new_code);
            var compiled = $compile(el)(scope);
            element.html(compiled);
        }

        return {
            scope: {
                target: '@',
            },
            link: link
        };
    }]);

})();