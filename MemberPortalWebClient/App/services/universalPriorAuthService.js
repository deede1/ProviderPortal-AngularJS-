(function () {
    var app = angular.module('MemberPortalServices');
    app.factory('universalPriorAuthoirzationService',
        function () {

            var subFormArray = [];
            var memberInfo = {};
            var loggedInProvderInfo = {};
            var hasFiles = false;
            var fileId = "";
            var recordId = -1;
            var confirmationNumber = "";
            var drugArray = [];
            var icdArray = [];

            var jcodesArray = [];

            function prepareDom() {


                //clean string data                              
                //htmlString = htmlString.replace(/(\r\n|\n|\r|\t)/gm, "");
                //htmlString = htmlString.replace(/ +(?= )/g, '');
                //htmlString = htmlString.replace(/<!--(.*?)-->/gm, "");

                //grab CSS Link tags
                var htmlStringWithCss = "";
                $("link").each(function (key, value) {
                    var templink = "<link href='" + value.href + "' rel='stylesheet'>";
                    htmlStringWithCss += templink;
                });

                //append CSS Link tags to HtmlString
                htmlStringWithCss += $('#PdfData').html();
                htmlStringWithCss = htmlStringWithCss.replace(/<!--(.*?)-->/gm, "");
                return htmlStringWithCss;
            }


            function removeEmptyArrayElements(array, value) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] === value) {
                        array.splice(i, 1);
                        i--;
                    }
                }
            }


            function assignFormValues(formObj, angularForm) {

                var domString = { "DomString": prepareDom() };

                var formData = {
                    memberId: formObj.memberId.value,
                    prescriberId: formObj.prescriberId.value,
                    memberLob: formObj.memberLob.value,
                    authRep: formObj.authRep ? formObj.authRep.value : null,
                    authRepNumber: formObj.authRepNumber ? formObj.authRepNumber.value : null,
                    pri: angularForm.pri.$viewValue,
                    primaryInsurance: formObj.primaryInsurance.value,
                    primaryInsuranceId: formObj.primaryInsuranceId.value,
                    secondaryInsurance: formObj.secondaryInsurance.value,
                    secondaryInsuranceId: formObj.secondaryInsuranceId.value,
                    Height: formObj.Height.value !== "" ? formObj.Height.value : 0,
                    hiddenHeight: formObj.hiddenHeight.value,
                    Weight: formObj.Weight.value !== "" ? formObj.Weight.value : 0,
                    hiddenWeight: formObj.hiddenWeight.value,
                    memberEmail: formObj.memberEmail.value,
                    deaNumber: formObj.deaNumber.value,
                    providerEmail: formObj.providerEmail.value,
                    requestor: formObj.requestor.value,
                    formType: angularForm.Type.$viewValue,
                    contact: formObj.contact.value,
                    radioGroup5: formObj.radioGroup5.value,
                    addedPharmacy: formObj.addedPharmacy.value,
                    pharmName: formObj.pharmName.value,
                    pharmID: formObj.pharmID.value,
                    pharmName1: formObj.pharmName1.value,
                    pharmName2: formObj.pharmName2.value,
                    pharmDiamondID: formObj.pharmDiamondID.value,
                    pharmNPI: formObj.pharmNPI.value,
                    pharmAddress1: formObj.pharmAddress1.value,
                    pharmAddress2: formObj.pharmAddress2.value,
                    pharmCity: formObj.pharmCity.value,
                    pharmState: formObj.pharmState.value,
                    pharmZip: formObj.pharmZip.value,
                    pharmPhone: formObj.pharmPhone.value,
                    pharmFax: formObj.pharmFax.value,
                    medicationTherapy: formObj.medicationTherapy.value,
                    ReasonAllergy: formObj.reasonAllergy.value,
                    comment: formObj.comment.value,
                    additionalMC1: formObj.additionalMC1 ? angularForm.additionalMC1.$viewValue : false,
                    additionalMC2: formObj.additionalMC2 ? angularForm.additionalMC1.$viewValue : false,
                    additionalMC3: formObj.additionalMC3 ? angularForm.additionalMC1.$viewValue : false,
                    additionalMC4: formObj.additionalMC4 ? angularForm.additionalMC1.$viewValue : false,
                    Expedite: formObj.Expedite ? angularForm.Expedite.$viewValue : false,
                    Attestation: formObj.Attestation.value,
                    Confidential: formObj.Confidential.value,
                    DomString: domString,
                    HasFiles: hasFiles,
                    Medications: subFormArray,
                    FileId: fileId

                }

                //check for Allergy
                var allergyList = [];
                for (var i = 0; i < formObj.Allergy.length; i++) {

                    allergyList.push(formObj.Allergy[i].value);

                }

                //check for ICD
                var icdList = [];
                for (var j = 0; j < formObj.CodeIcd.length; j++) {

                    if (!formObj.CodeIcd[j].value)
                        formObj.CodeIcd[j].value = (j + 1);

                    icdList.push(formObj.CodeIcd[j].value);
                }

                //check for CPT
                var cptList = [];
                if (formObj.CPT != null && formObj.CPT != undefined) {
                    if (formObj.CPT.length > 1) {

                        for (var k = 0; k < formObj.CPT.length; k++) {

                            cptList.push(formObj.CPT[k].value);
                        }

                    } else {
                        cptList.push(formObj.CPT.value);
                    }
                }
                //clean arrays
                removeEmptyArrayElements(allergyList, "");
                removeEmptyArrayElements(icdList, "");
                removeEmptyArrayElements(cptList, "");

                //assign arrays to form
                formData.Cpt = cptList;
                formData.CodeIcd = icdList;
                formData.Allergy = allergyList;

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
            function setTextArea() {


                $("#SIG").html($("#SIG").val());
                $("#comment").html($("#comment").val());
                $("#MedicationTherapy").html($("#MedicationTherapy").val());
                $("#ResponseReason").html($("#ResponseReason").val());
            }

            function setLink() {
                var link = "";
                $("link").each(function (key, value) {
                    var tempLink = $(value);
                    tempLink.attr('href', $(value).prop('href'));
                    link += tempLink.context.outerHTML;
                });

                return link;
            }

            function cleanUp() {

                $(".hideDD").hide();
                $(".showValue").show();
                $('#search-results').hide();
                $('#ICDspinner').empty();
                $('#CPTspinner').empty();
                $("#SIG").height($("#SIG")[0].scrollHeight);
                $(".plupload_filelist").height($(".plupload_filelist")[0].scrollHeight);
                $("#comment").height($("#comment")[0].scrollHeight);
                if ($("#MedicationTherapy").val() !== "")
                    $("#MedicationTherapy").height($("#MedicationTherapy")[0].scrollHeight);
                if ($("#ResponseReason").val() !== "")
                    $("#ResponseReason").height($("#ResponseReason")[0].scrollHeight);
            }

            function cloneDom(domId) {


                setText();
                setNumber();
                setTextArea();
                cleanUp();

            }


            return {
                GetFormData: function (formObject, domId, angularForm) {

                    var formElements = formObject[0].elements;

                    var modal = $('#CMSresub');
                    var message = $('#ServerResp');

                    cloneDom(domId);
                    var data = assignFormValues(formElements, angularForm);

                    modal.modal('toggle');
                    modal.css('display', 'inline-block');

                    $("#CMSCoverageForm:input").prop("disabled", true);
                    message.empty();
                    message.append(
                        '<h3>Form submission is in progress, please wait...</h3>'
                    );

                    return data;
                },

                AddMedication: function (item) {
                    subFormArray.push(item);
                },

                RemoveMedication: function (idx) {
                    subFormArray.splice(idx, 1);
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
                    $('#ResubmissionDiv').show();
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
                getDrugs: function () {
                    return drugArray;
                },

                setDrugs: function (value) {
                    drugArray = value;
                },
                clearMedicines: function () {
                    subFormArray = [];
                },

                getIcds: function () {
                    return icdArray;
                },

                setIcds: function (value) {

                    icdArray = value;
                },
                getJcodes: function () {
                    return jcodesArray;
                },

                setJcodes: function (array) {
                    jcodesArray = array;
                }
            }
        });
})();
