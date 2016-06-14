(function () {
    var app = angular.module('MemberPortalServices');

    app.factory('passwordStrength', ['$rootScope',  '$q', '$filter',
        function ( $rootScope, $q, $filter) {
            var passwordStrength = {};
 
   

            passwordStrength.checkPasswordStrength = function (e) {
              //  $scope.passwordStrengthOK = false;
                if (!e.isShiftKey) {
                    var newPass = $('#txtPassword1').val();
                    var passStrength = 0;
                    var _regex = /[$-/:-?{-~!"#@^_`\[\]]/g;
                    var _lowerLetters = /[a-z]+/.test(newPass);
                    var _upperLetters = /[A-Z]+/.test(newPass);
                    var _numbers = /[0-9]+/.test(newPass);
                    var _symbols = _regex.test(newPass);

                    $('#passwordStrengthString').html('');

                    if (_lowerLetters) { passStrength++; }
                    if (_upperLetters) { passStrength++; }
                    if (_numbers) { passStrength++; }
                    if (_symbols) { passStrength++; }
                    if (newPass.length >= 6) { passStrength++; }

                    $('#passwordStrengthString').fadeIn('slow');
                    switch (passStrength) {
                        case 1: $('#passwordStrengthString').html($filter("translate")("form_passwordStrengthWeak"));
                            $('#passwordStrengthBar').removeClass('passwordStrength_1').removeClass('passwordStrength_2').addClass('passwordStrength_0'); break;

                        case 2: $('#passwordStrengthString').html($filter("translate")("form_passwordStrengthWeak"));
                            $('#passwordStrengthBar').removeClass('passwordStrength_1').removeClass('passwordStrength_2').addClass('passwordStrength_0'); break;

                        case 3: $('#passwordStrengthString').html($filter("translate")("form_passwordStrengthMedium"));
                            $('#passwordStrengthBar').removeClass('passwordStrength_0').removeClass('passwordStrength_2').addClass('passwordStrength_1'); break;

                        case 4: $('#passwordStrengthString').html($filter("translate")("form_passwordStrengthStrong"));
                            $('#passwordStrengthBar').removeClass('passwordStrength_0').removeClass('passwordStrength_1').addClass('passwordStrength_2'); break;
                    }

                    if (passStrength >= 5) {
                        $('#passwordStrengthIcon').removeClass('colorRed').addClass('colorGreen');
                        $('#passwordStrengthString').html('');//Green checkmark showing. 
                    //    $scope.passwordStrengthOK = true;
                    }
                    else
                        $('#passwordStrengthIcon').addClass('colorRed').removeClass('colorGreen');
                }
            }





            return passwordStrength;
    }]);
})();


