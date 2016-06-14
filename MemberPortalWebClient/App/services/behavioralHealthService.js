(function () {
    var app = angular.module('MemberPortalServices');
    app.factory('behavioralHealthService',
        function () {

          
            var memberInfo = {};
            var loggedInProvderInfo = {};
            var hasFiles = false;
            var fileId = "";
            var recordId = -1;
            var confirmationNumber = "";
            var addedMedications = [];
            var selectedProvider = "";
            var icdArray = [];

            function prepareDom(domId) {
                 
                var htmlStringWithCss = "";
                $("link").each(function (key, value) {
                   var templink= "<link href='" + value.href +"' rel='stylesheet'>";
                    htmlStringWithCss += templink;
                });

                htmlStringWithCss += $('#PdfData').html().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/ +(?= )/g, '').replace(/<!--(.*?)-->/gm, '');

                return htmlStringWithCss;
            }
            
            function assignFormInitValues(formObj, angularForm) {

                //console.log("form Values", formObj);
                //console.log("angular form values", angularForm);
                //console.log("addedMeds", addedMedications);

                var formData = {
                    DOM: prepareDom(),
                    Department: "BH",
                    AddedMeds: addedMedications,

                    sub: angularForm.sub.$viewValue,
                    prov: selectedProvider,
                    requestingProviderAddress: formObj.requestingProviderAddress.value,
                    DateOfService: angularForm.DateOfService.$viewValue,
                    release: angularForm.release.$viewValue,
                    aware:angularForm.aware.$viewValue,
                    agree: angularForm.agree.$viewValue,
                    CurrentTreatment: angularForm.CurrentTreatment.$viewValue,
                    CurrentMentalMedication: angularForm.CurrentMentalMedication.$viewValue,
                    CurrentTreatmentOtherReason: angularForm.CurrentTreatmentOtherReason.$viewValue,
                    LastKnownNumber: angularForm.LastKnownNumber.$viewValue,

                    RiskAssessmentSuicidal:angularForm.RiskAssessmentSuicidal.$viewValue ,
                    RiskAssessmentSuicidalPlans:angularForm.RiskAssessmentSuicidalPlans.$viewValue,
                    RiskAssessmentSuicidalMeans:angularForm.RiskAssessmentSuicidalMeans.$viewValue,
                    RiskAssessmentHomicidal:angularForm.RiskAssessmentHomicidal.$viewValue,
                    RiskAssessmentHomicidalPlans:angularForm.RiskAssessmentHomicidalPlans.$viewValue,
                    RiskAssessmentHomicidalMeans:angularForm.RiskAssessmentHomicidalMeans.$viewValue,
                    RiskAssessmentDisabled:angularForm.RiskAssessmentDisabled.$viewValue,
                    RiskAssessmentWithdrawals:angularForm.RiskAssessmentWithdrawals.$viewValue,
                    RiskAssessmentClinic:angularForm.RiskAssessmentClinic.$viewValue,
                    RiskAssessmentProvider:angularForm.RiskAssessmentProvider.$viewValue,
                    RiskAssessmentSelfInjury:angularForm.RiskAssessmentSelfInjury.$viewValue,
                    RiskAssessmentPhycHosp:angularForm.RiskAssessmentPhycHosp.$viewValue,
                    RiskAssessmentRunAway:angularForm.RiskAssessmentRunAway.$viewValue,

                    Anxiety: angularForm.Anxiety.$viewValue,
                    Depression: angularForm.Depression.$viewValue,
                    SleepDisorder: angularForm.SleepDisorder.$viewValue,
                    WeightChange: angularForm.WeightChange.$viewValue,
                    Isolation: angularForm.Isolation.$viewValue,
                    ObsessiveCompulsive: angularForm.ObsessiveCompulsive.$viewValue,
                    AggressiveBehavior: angularForm.AggressiveBehavior.$viewValue,
                    AssaultiveBehavior: angularForm.AssaultiveBehavior.$viewValue,
                    ConductDisorder: angularForm.ConductDisorder.$viewValue,
                    AttentionProblems: angularForm.AttentionProblems.$viewValue,
                    ConcentrationDifficulty: angularForm.ConcentrationDifficulty.$viewValue,
                    Confusion: angularForm.Confusion.$viewValue,
                    Dementia: angularForm.Dementia.$viewValue,
                    Dizziness: angularForm.Dizziness.$viewValue,
                    auditory: angularForm.HallucinationAuditory.$viewValue,
                    visual: angularForm.HallucinationVisual.$viewValue,
                    Paranoia: angularForm.Paranoia.$viewValue,
                    DissociativeProcess: angularForm.DissociativeProcess.$viewValue,
                    SubstanceAbuse: angularForm.SubstanceAbuse.$viewValue,
                    MPP_EatingDisorder: angularForm.MPP_EatingDisorder.$viewValue,
                    DevelDelay: angularForm.DevelDelay.$viewValue,
                    MPP_Other: angularForm.MPP_Other.$viewValue,
                    other: angularForm.other.$viewValue,
                    HallucinationAuditory: angularForm.HallucinationAuditory.$viewValue,
                    HallucinationVisual: angularForm.HallucinationVisual.$viewValue,

                    impairnone: angularForm.impairnone.$viewValue,
                    Impair1: angularForm.Impair1 ? angularForm.Impair1.$viewValue : "off" ,
                    Impair2: angularForm.Impair2 ? angularForm.Impair2.$viewValue : "off" ,
                    Impair3: angularForm.Impair3 ? angularForm.Impair3.$viewValue : "off" ,
                    Impair4: angularForm.Impair4 ? angularForm.Impair4.$viewValue : "off" ,
                    ImpairNew: angularForm.ImpairNew ? angularForm.ImpairNew.$viewValue : "off" ,
                    ImpairNew1: angularForm.ImpairNew1 ? angularForm.ImpairNew1.$viewValue : "off" ,
                    ImpairNew2: angularForm.ImpairNew2 ? angularForm.ImpairNew2.$viewValue : "off" ,
                    ImpairNew3: angularForm.ImpairNew3 ? angularForm.ImpairNew3.$viewValue : "off" ,
                    Impair5: angularForm.Impair5 ? angularForm.Impair5.$viewValue : "off" ,
                    Impair6: angularForm.Impair6 ? angularForm.Impair6.$viewValue : "off" ,
                    Impair7: angularForm.Impair7 ? angularForm.Impair7.$viewValue : "off" ,
                    Impair8: angularForm.Impair8 ? angularForm.Impair8.$viewValue : "off" ,
                    Impair9: angularForm.Impair9? angularForm.Impair9.$viewValue : "off" ,
                    Impair9NEW: angularForm.Impair9NEW ? angularForm.Impair9NEW.$viewValue : "off" ,
                    Impair10: angularForm.Impair10 ? angularForm.Impair10.$viewValue : "off" ,
                    Impair10NEW: angularForm.Impair10NEW ? angularForm.Impair10NEW.$viewValue : "off" ,
                    Impair11: angularForm.Impair11 ? angularForm.Impair11.$viewValue : "off" ,
                    Impair12: angularForm.Impair12 ? angularForm.Impair12.$viewValue : "off" ,
                    Impair13: angularForm.Impair13 ? angularForm.Impair13.$viewValue : "off" ,

                    impairFunction: angularForm.impairFunction.$viewValue,
                    Impair21: angularForm.impair21.$viewValue,

                    Bhdnone: angularForm.Bhdnone ? angularForm.Bhdnone.$viewValue : "off" ,
                    Bhd1: angularForm.Bhd1 ? angularForm.Bhd1.$viewValue : "off" ,
                    Bhd2: angularForm.Bhd2 ? angularForm.Bhd2.$viewValue : "off" ,
                    Bhd3: angularForm.Bhd3 ? angularForm.Bhd3.$viewValue : "off" ,
                    Bhd4: angularForm.Bhd4 ? angularForm.Bhd4.$viewValue : "off" ,
                    Bhd5: angularForm.Bhd5 ? angularForm.Bhd5.$viewValue : "off" ,
                    Bhd6: angularForm.Bhd6 ? angularForm.Bhd6.$viewValue : "off" ,
                    Bhd7: angularForm.Bhd7 ? angularForm.Bhd7.$viewValue : "off" ,
                    Bhd8: angularForm.Bhd8 ? angularForm.Bhd8.$viewValue : "off" ,
                    Bhd9: angularForm.Bhd9 ? angularForm.Bhd9.$viewValue : "off" ,
                    Bhd10: angularForm.Bhd10 ? angularForm.Bhd10.$viewValue : "off" ,
                    Bhd11: angularForm.Bhd11 ? angularForm.Bhd11.$viewValue : "off" ,
                    Bhd12: angularForm.Bhd12 ? angularForm.Bhd12.$viewValue : "off" ,
                    Bhd13: angularForm.Bhd13 ? angularForm.Bhd13.$viewValue : "off" ,
                    Bhd14: angularForm.Bhd14 ? angularForm.Bhd14.$viewValue : "off" ,
                    Bhd15: angularForm.Bhd15 ? angularForm.Bhd15.$viewValue : "off" ,
                    Bhd16: angularForm.Bhd16 ? angularForm.Bhd16.$viewValue : "off" ,
                    Bhd17: angularForm.Bhd17 ? angularForm.Bhd17.$viewValue : "off" ,
                    Bhd18: angularForm.Bhd18 ? angularForm.Bhd18.$viewValue : "off",

                    Psychotherapy: angularForm.Psychotherapy.$viewValue,
                    Psychiatry: angularForm.Psychiatry.$viewValue,
                    psychiatry123: angularForm.psychiatry123 ? angularForm.psychiatry123.$viewValue : "off",
                    Substance: angularForm.Substance.$viewValue,
                    substance123: angularForm.substance123 ? angularForm.substance123.$viewValue : "off",
                    CaseManagement: angularForm.CaseManagement.$viewValue,
                    cm1: angularForm.cm1 ? angularForm.cm1.$viewValue : "off" ,
                    cm2: angularForm.cm2 ? angularForm.cm2.$viewValue : "off" ,
                    cm3: angularForm.cm3 ? angularForm.cm3.$viewValue : "off" ,
                    cm4: angularForm.cm4 ? angularForm.cm4.$viewValue : "off" ,
                    cm5: angularForm.cm5 ? angularForm.cm5.$viewValue : "off" ,
                    cm6: angularForm.cm6 ? angularForm.cm6.$viewValue : "off" ,
                    cm7: angularForm.cm7 ? angularForm.cm7.$viewValue : "off" ,
                    cm8: angularForm.cm8 ? angularForm.cm8.$viewValue : "off" ,
                    cm9Other: angularForm.cm9Other ? angularForm.cm9Other.$viewValue : "off",
                    Developmental: angularForm.Developmental.$viewValue,
                    DevPCPScreen: angularForm.DevPCPScreen ? angularForm.DevPCPScreen.$viewValue : "off" ,
                    DevSub1: angularForm.DevSub1? angularForm.DevSub1.$viewValue : "off" ,
                    DevSub2: angularForm.DevSub2 ? angularForm.DevSub2.$viewValue : "off", 
                    DevSub3: angularForm.DevSub3 ? angularForm.DevSub3.$viewValue : "off" ,
                    DevSub4: angularForm.DevSub4 ? angularForm.DevSub4.$viewValue : "off" ,
                    DevSub5: angularForm.DevSub5 ? angularForm.DevSub5.$viewValue : "off" ,
                    DevSub6: angularForm.DevSub6 ? angularForm.DevSub6.$viewValue : "off" ,
                    Neurological: angularForm.Neurological.$viewValue, 
                    Neuro: angularForm.Neuro ? angularForm.Neuro.$viewValue : "off",

                    Comment: formObj.comment.value,
                    FileId: fileId

                }

                return formData;
            }

            function setText() {

                $("input[type=text]").each(function (key, value) {
                    $(value).attr('value', $(value).val());
                });

                $("input[type=email]").each(function (key, value) {
                    $(value).attr('value', $(value).val());
                });

                $("input[type=radio]").each(function (key, value) {
                    $(value).attr('checked', $(value).prop('checked'));
                });

                $("input[type=checkbox]").each(function (key, value) {
                    $(value).attr('checked', $(value).prop('checked'));
                });

            }
            function setNumber() {
                $("input[type=number]").each(function (key, value) {
                    $(value).attr('value', $(value).val());
                });
            }
            function removeElement(id) {
                var elem = document.getElementById(id);
                if (elem != null) {
                    elem.parentNode.removeChild(elem);
                }
            }
            function setPdf() {

                $('.RemoveOnCopy').remove();
                $('.pagination').remove();
                removeElement('RequiredHighlight');
                $(".ShowOnCopy").css('display', 'table-header-group');
                $('#add-medication-place-holder').remove();
                $(".plupload_filelist").height($(".plupload_filelist")[0].scrollHeight);
                $('#plupLoadUploader_browse').hide();
            }
            function setTextArea() {
                $("#comment").html($("#comment").val());
                $("#comment").height($("#comment")[0].scrollHeight);
                $("#majorPresentingOther").html($("#majorPresentingOther").val());
                $("#majorPresentingOther").height($("#majorPresentingOther")[0].scrollHeight);
            }
            function cloneDom() {

                setText();
                setNumber();
                setTextArea();
                setPdf();
            }


            return {
                GetFormData: function (formObject, domId, angularForm) {

                    var formElements = formObject[0].elements;
                    var modal = $('#BHresub');
                    var message = $('#ServerResp');
                    cloneDom();
                    var data = assignFormInitValues(formElements, angularForm);
                    modal.modal('toggle');

                    $("#BehavioralHealthForm :input").prop("disabled", true);
                    $("#BehavioralHealthForm label").attr("disabled", true);
                    $('#SubmitBehavioralForm').remove();
                    $('#resetInitForm').show();
                     message.empty();
                     message.append(
                         '<h3>Form submission is in progress, please wait...</h3>'
                     );

                    return data;
                },

         
                SaveMemberInformation: function (memberData) {
                    memberInfo = memberData;
                },
                SaveProviderInformation: function (providerData) {
                    loggedInProvderInfo = providerData;
                },
                GetMemberInformation: function () {
                    return memberInfo;
                },
                GetProviderInformation: function () {
                    return loggedInProvderInfo;
                },
                SetHasFiles: function (hasAFile) {
                    hasFiles = hasAFile;
                },
                SetFileId: function (fId) {
                    fileId = fId;
                },
                SetRecordId: function (rId) {
                    recordId = rId;

                },
                GetRecordId: function () {
                    return recordId;
                },
                DisplayResubmissionInterface: function () {
                    $('#printDiv').show();
                },
                GetConfirmationNumber: function () {
                    return confirmationNumber ? confirmationNumber : null;
                },
                AddResultToDom: function (resultObj) {
                    var message = $('#ServerResp');
                    confirmationNumber = resultObj.AuthNumber;
                    message.empty();
                    message.append(
                        '<h3>Form submission complete</h3>' +
                        '<h3>Confirmation Number: ' + resultObj.AuthNumber + '</h3>'
                    );

                },
                getIcds: function () {
                    return icdArray;
                },
                setIcds: function (value) {

                    icdArray = value;
                },

                setMedications: function(meds) {
                    addedMedications = meds;
                },
                getMedications: function() {
                    return addedMedications;
                },
                setSelectedProvider: function( prov ) {
                    selectedProvider = prov;
                },
                getSelectedProvider: function() {
                    return selectedProvider;
                }
            
            }
        });

    app.factory('SharedAutismFormData', function () {
        return { Data: {} };
    });
})();
