(function () {
    var app = angular.module('MemberPortalDirectives');

    //app.directive('showErrors', function () {
    //    return {
    //        restrict: 'A',
    //        require: '^form',
    //        link: function (scope, el, attrs, formCtrl) {

    //            var inputNgEl = angular.element(el[0].querySelector("[name]"));
    //            var inputName = inputNgEl.attr('name');
    //            var helpText = angular.element(el[0].querySelector(".help-block"));
    //            var helpBtn = angular.element(el[0].querySelector(".help-block-btn"));
    //            var checkMark = angular.element(el[0].querySelector(".glyphicon-ok"));

    //            inputNgEl.bind('blur', function () {
    //                el.toggleClass('has-error', formCtrl[inputName].$invalid);
    //                helpText.toggleClass('hide', formCtrl[inputName].$valid);
    //            });

    //            helpBtn.bind('click', function () {
    //                if (formCtrl[inputName].$valid || formCtrl[inputName].$pristine) {
    //                    helpText.toggleClass('hide');
    //                }
    //            });

    //            scope.$on('show-errors-event', function () {
    //                el.toggleClass('has-error', formCtrl[inputName].$invalid);
    //            });

    //        }
    //    };
    //});
})();