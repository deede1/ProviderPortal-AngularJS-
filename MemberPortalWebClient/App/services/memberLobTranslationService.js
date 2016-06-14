(function () {
    var app = angular.module('MemberPortalServices');
    app.factory('memberLobTranslationService',
        function () {

            function findMedi(grup) {

                var isMedi = false;
                var idx = grup.length - 1;
                if (grup.length >= 4) {
                    var substring = grup.substring(idx, idx - 4);
                    var regex = /(MM|LTSS)/;
                    isMedi = regex.test(grup);
                }
                return isMedi;
            }

            function translateLob(lob, grup, plan) {
                var translatedLob = '';
                if (grup)
                    if (lob !== null && lob !== undefined) {
                        switch (lob) {
                            case "PGM":

                                translatedLob = "Healthy Kids";

                                break;
                            case "MED":
                                if (grup === "RVC-FKP" || grup === "SBC-FKP") {

                                    translatedLob = "Open Access";

                                } else if (findMedi(grup)) {

                                    translatedLob = "Medi-Medi";

                                } else {

                                    translatedLob = "Medi-Cal";

                                }
                                break;
                            case "MCR":
                                if (plan === "MF" || plan === "MN") {

                                    translatedLob = "Medicare";

                                } else if (plan === "MD") {

                                    translatedLob = "Dual Choice";
                                }
                                break;
                            case "CMC":
                                translatedLob = "Cal MediConnect";
                                break;
                            case "CCI":
                                translatedLob = "Medi-Cal";
                                break;
                            default:
                                break;
                        }

                    } else {
                        translatedLob = "Not Available";
                    }


                return translatedLob;
            }
            return {
                translateMemberLob: function(lob, grup, plan) {
                    return translateLob(lob, grup, plan);
                }
            }

        });


})();
