(function() {
    angular.module('MemberPortal').config(StyleGuideStateConfig);

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content'),
			cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');
    //use this helper function to minimize repeated code in the routes
    function url(url) {
        return urlBase + url + cacheBust;
    }

    StyleGuideStateConfig.$inject = ['$stateProvider'];
    function StyleGuideStateConfig($stateProvider) {
        $stateProvider
            .state('styleguide', {
                url: '/style-guide',
                views: {
                    '': { templateUrl: url('/App/layout/two-column-wide-right.html') },
                    'navigation@styleguide': { templateUrl: url('/App/style-guide/Navigation.html') },
                    'content@styleguide': { template: '<h1>Test Section 1</h1><p>{{myValue}}</p>' }
                }
            })
            .state('styleguide.elements', {
                url: '/standard-elements',
                views: {
                    'content@styleguide': { templateUrl: url('/App/style-guide/standard-elements.html') }
                }
            })
            .state('styleguide.components', {
                url: '/components',
                views: {
                    'content@styleguide': { templateUrl: url('/App/style-guide/components.html') },
                    controller: 'StyleGuideController'
                }
            })
            .state('styleguide.layout', {
                url: '/components',
                views: {
                    'content@styleguide': { template: '<h1>Layout</h1>' }
                }
            })
            .state('styleguide.project', {
                url: '/project-structure',
                views: {
                    'content@styleguide': { templateUrl: url('/App/style-guide/components.html') }
                }
            })
            .state('styleguide.project.directory', {
                url: '/directory',
                views: {
                    'content@styleguide': { templateUrl: url('/App/style-guide/project-structure.html') }
                }
            })
            .state('styleguide.project.naming', {
                url: '/naming',
                views: {
                    'content@styleguide': { templateUrl: url('/App/style-guide/naming-convention.html') }
                }
            })
        .state('styleguide.forms', {
            url: '/forms',
            views: {
                'content@styleguide': { templateUrl: url('/App/style-guide/forms.html') }
            }
        });;
    }

})();