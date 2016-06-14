
//data loading functions
function loadHistoricalFormValues(data) {
    //console.log("DATA OBJ");
    //console.log(data);

    var md = data.MemberDemographics;

    $('#memberName').html(toTitleCase(md.AALASTNM + ", " + md.AAFNAME));
    $('#memberSubno').html(md.AASUBNO);
    $('#memberDob').html(data.MemberDob);
    $('#memberAge').html(data.MemberAge);
    $('#memberSex').html(md.AASEX);
    $('#memberStreet').html(toTitleCase(md.AAADDR1 + " " + md.AAADDR2));
    $('#memberCity').html(toTitleCase(md.AACITY));
    $('#memberState').html(md.AASTATE);
    $('#memberZip').html(md.AAZIP);
    $('#memberPhone').html(addParenthesisToPhoneNumber(md.AAHPHON));

    var countyNum = md.AACOUNTY;
    var countyTrans = "San Bernardino";
    if (countyNum === '33')
        countyTrans = "Riverside";
    $('#memberCounty').html(countyTrans);
    $('#memberMediCalNumber').html(md.AAMCARE);
    var lob = translateLob(data.MemberEligibility.ABLOB, data.MemberEligibility.ABGRUP, data.MemberEligibility.ABPLAN);
    $('#memberLOB').html(lob);

    var lastName = "";
    if (data.ProviderInformation.PANAME2 !== "" && data.ProviderInformation.PANAME2 != null) {  
        lastName = data.ProviderInformation.PANAME2 + ", ";
    }

    $('#providerName').html(toTitleCase(lastName + data.ProviderInformation.PANAME1));
    $('#providerId').html(data.ProviderInformation.PAPROVID);
    $('#authNumber').html(data.HeaderSection.AuthNo);
    $('#requestDate').html(data.HeaderSection.DOS);

    switch (data.FormTypeId) {

        case 1: //complete
            loadInitCheckBoxes(data.HeaderSection);
            loadloadInitalServiceRequested(data.InitialServicesRequested);
            break;

        case 3://complete
            loadMemberPCPInfo(data.PCPInformation);
            loadVisitInformation(data.HeaderSection);
            loadInitCheckBoxes(data.HeaderSection);
            loadMedications(data.Medications);
            loadAxisDiagnosis(data.DiagnosisAxis, data.FormTypeId);
            loadFindingsAndRecommendations(data.FindingsRecommend);
            break;

        case 4://complete
            loadMemberPCPInfo(data.PCPInformation);
            loadVisitInformation(data.HeaderSection);
            loadMedications(data.Medications);
            loadChangesUpdates(data.MedicationChanges);
            loadFindingsAndRecommendations(data.FindingsRecommend);
            break;

        case 5://complete
            loadInitCheckBoxes(data.HeaderSection);
            loadVisitInformation(data.HeaderSection);
            loadMedications(data.Medications);
            loadAxisDiagnosis(data.DiagnosisAxis, data.FormTypeId);
            loadServicesInfoCS(data.CurrentStatus);
            loadServicesInfoCI(data.CritcalIncidents);
            loadServicesInfoCD(data.ChemicalDependency);
            loadServicesInfoSR(data.ServicesRequested);
            break;

        case 6://complete
            loadInitCheckBoxes(data.HeaderSection);
            loadVisitInformation(data.HeaderSection);
            LoadPreDischargeInfo(data.DischargeServicePre);
            break;

        case 7://complete
            loadInitCheckBoxes(data.HeaderSection);
            loadVisitInformation(data.HeaderSection);
            loadMedications(data.Medications);
            loadAxisDiagnosis(data.DiagnosisAxis, data.FormTypeId);
            loadDischargeInfo(data.DischargeSummary);
            break;

        default:
            break;
    }

    data = {};
}

function loadMedications(medications) {
    var medHtml = "";
    if (medications.length === 0) {
        medHtml += '<tr><td colspan="4" id="info">No Records Found</td></tr>';
        $("#medicationTable").find('tbody').append(medHtml);
    } else {
        for (var i = 0; i < medications.length; i++) {
            medHtml += '<tr><td id="info">' +
                '<span >' + medications[i].DrugName + '</span>' +
                '</td>' +
                '<td id="info" style="text-indent:15px;">' +
                '<span >' + medications[i].Quantity + '</span>' +
                '</td>' +
                '<td id="info" style="text-indent:30px;">' +
                '<span >' + medications[i].Supply + '</span>' +
                '</td>' +
                '<td id="info">' +
                '<span >' + medications[i].FillDate + '</span>' +
                '</td></tr>';
            $("#medicationTable").find('tbody').append(medHtml);
            medHtml = "";
        }
    }

}

function loadAxisDiagnosis(diagnosis, formId) {
    //console.log("diagnosis");
    //console.log(diagnosis);

    if (formId === 8) {
        $("#diagnosisSpan").text("(As Indicated by Provider or Member)");
    } else {
        $("#diagnosisSpan").text("(Complete at least one (1) DX on Axis I or II, Axis IV, & Axis V)");
    }

    $("#primaryDiag").html(diagnosis.ClinicalDx);
    $("#secondaryDiag").html(diagnosis.SecondaryDx);
    $("#axis2Diag").html(diagnosis.AXIS_II);
    $("#txtAxisIII").val(diagnosis.AXIS_III);

    checkCheckBox("Family", diagnosis.A4_Family);
    checkCheckBox("Educational",diagnosis.A4_Educational);
    checkCheckBox("SocialEnv",diagnosis.A4_SocialEnv);
    checkCheckBox("Occupational",diagnosis.A4_Occupational);
    checkCheckBox("Legal",diagnosis.A4_Legal);
    checkCheckBox("Housing",diagnosis.A4_Housing);
    checkCheckBox("AccessHealth", diagnosis.A4_AccessHealth);
    checkCheckBox("Economic",diagnosis.A4_Economic);
    checkCheckBox("OtherPsychosocial",diagnosis.A4_OtherPsychosocial);

    $("#txtAxisCurGaf").val(diagnosis.GAF);
    $("#txtAxisHiGaf").val(diagnosis.Highest_PY_GAF);


}

function loadServicesInfoCD(chemicalDep) {

    //Chem Dep addressed
    if (!chemicalDep.ChemicalDepIssue) {
        $('#ckNACD').prop('checked', true);
    } else {
        setRadioGroupSelection('radCD', chemicalDep.ChemicalDepIssue);
    }

    //rating
    if (chemicalDep.Rating) {
        setRadioGroupSelection('rdoSubAbuse', chemicalDep.Rating);
    }

    //treatment recommendations

    if (chemicalDep.TreatmentRecom) {
        setRadioGroupSelection('rdoTreatRec', chemicalDep.TreatmentRecom);
    }

    if (chemicalDep.ReferCommunity) {
        $('ckCDTRPCP').prop('checked', true);
    }

    if (chemicalDep.ReferMed) {
        $('ckCDTRComm').prop('checked', true);
    }

    if (chemicalDep.ReferOther !== null) {
        $('ckCDTROther ').prop('checked', true);
        $('txtCDTROther').val(chemicalDep.ReferOther);
    }

    //member compliance
    if (chemicalDep.MemberComp) {
        setRadioGroupSelection('radCDComp', chemicalDep.MemberComp);
    }


    //After Care Plan  AfterCare  AfterCareOther

    if (chemicalDep.AfterCare) {
        setRadioGroupSelection('radAfterCare', chemicalDep.AfterCare);
    }
    if (chemicalDep.AfterCareOther !== null) {
        $('#txtCDACOther').val(chemicalDep.MemberCompOther);
    }

}
function loadServicesInfoCS(currentStatus) {

    for (var i = 0; i < currentStatus.length; i++) {
        switch (currentStatus[i].Status) {
            case 1:
                var idArray = ["radSuicidalLevel", "ckSuicidalIncOutPat", "ckSuicidalIntensive", "ckSuicidalCommunity", "ckSuicidalPsychiatric", "ckSuicidalOther", "txtSuicidalOther"];
                var containmentIdArray = ["ckSuicidalNoHarm", "ckSuicidalComplex"];
                setCurrentStatus(idArray,containmentIdArray, currentStatus[i]);      
                break;

            case 2:               
                var idArray1 = ["radHomicidalLevel", "ckHomicidalIncOutPat", "ckHomicidalIntensive", "ckHomicidalCommunity", "ckHomicidalPsychiatric", "ckHomicidalOther", "txtHomicidalOther"];
                var containmentIdArray1 = ["ckHomicidalNoHarm", "ckHomicidalComplex"];
                setCurrentStatus(idArray1, containmentIdArray1, currentStatus[i]);
                break;

            case 3:
                var idArray2 = ["radGDLevel", "ckGDIncOutPat", "ckGDIntensive", "ckGDCommunity", "ckGDPsychiatric", "ckGDOther", "txtGDOther"];
                var containmentIdArray2 = ["ckGDComplex"];
                setCurrentStatus(idArray2, containmentIdArray2, currentStatus[i]);
                break;

            case 4:
                setRadioGroupSelection("radAbuseLevel", currentStatus[i].SeverityLevel);           
                $('#txtAbuseReport').val(currentStatus[i].ReportDate);

                if (currentStatus[i].HigherLOC) {
                    $('#ckAbuseIncOutPat').prop('checked', true);
                }
            
                if (currentStatus[i].ContainmentPlan === 1) {
                    $('#ckAbuseReport').prop('checked', true);
                }else if (currentStatus[i].ContainmentPlan === 2) {
                    $('#ckAbuseComplex').prop('checked', true);
                }
              
                checkCheckBox("ckAbuseIntensive", currentStatus[i].RefIntensive);
                checkCheckBox('ckAbuseCommunity', currentStatus[i].RefCommunity);
                checkCheckBox('ckAbusePsychiatric', currentStatus[i].RefPsychiatric);

                if (currentStatus[i].ReferredOther !== null) {
                    $('#ckAbuseOther').prop('checked', true);
                    $('#txtAbuseOther').val(currentStatus[i].ReferredOther);
                }

                break;
            default:
                break;
        }
    }

    if (currentStatus.length === 0)
        $('#ckHRNone').prop('checked', true);

}

function setCurrentStatus(idArray, conIdarray, data) {

    setRadioGroupSelection(idArray[0], data.SeverityLevel);
    setContainmentPlan(conIdarray, data.ContainmentPlan);
    if (data.HigherLOC) {
        $('#'+idArray[1]).prop('checked', true);
    }
    checkCheckBox(idArray[2], data.RefIntensive);
    checkCheckBox(idArray[3], data.RefCommunity);
    checkCheckBox(idArray[4], data.RefPsychiatric);

    if (data.ReferredOther !== null) {
        $('#'+idArray[5]).prop('checked', true);
        $('#'+idArray[6]).val(data.ReferredOther);
    }
}

function setContainmentPlan(planId, value) {

        if (value === 1) {
            $('#' + planId[0]).prop('checked', true);
        }else if (value === 2) {
            $('#' + planId[1]).prop('checked', true);
        }
}

function loadServicesInfoCI(incidents) {

    for (var i = 0; i < incidents.length; i++) {
        switch (incidents[i].Incident) {
            case 1:
                setRadioGroupSelection('radSuicideLife', incidents[i].LifeThreatening);
                checkCheckBox('ckSuicideComplex', incidents[i].ActionCCM);
                checkCheckBox('ckSuicideEval', incidents[i].ActionMembEval);
                checkCheckBox('ckSuicide5150', incidents[i].Action5150);
                checkCheckBox('ckSuicideOP', incidents[i].ActionNoHarm);
                break;
            case 2:
                setRadioGroupSelection('radMedLife', incidents[i].LifeThreatening);
                checkCheckBox('ckMedComplex', incidents[i].ActionCCM);
                checkCheckBox('ckMedDisc', incidents[i].ActionDisconMed);
                checkCheckBox('ckMedTitrate', incidents[i].Tritrate);
                checkCheckBox('ckMedAdd', incidents[i].ActionAddMed);
                break;
            case 3:
                $('#txtCIOther').val(incidents[i].IncidentOther);
                setRadioGroupSelection('radOther', incidents[i].LifeThreatening);
                checkCheckBox('ckOtherComplex', incidents[i].ActionCCM);
                checkCheckBox('ckOtherDisc', incidents[i].ActionDisconMed);
                checkCheckBox('ckOtherTitrate', incidents[i].Tritrate);
                checkCheckBox('ckOtherAdd', incidents[i].ActionAddMed);
                break;
            default:

                break;
        }
    }

    if (incidents.length === 0)
        $('#ckCINone').prop('checked', true);

}

function loadServicesInfoSR(services) {


    for (var i = 0; i < services.length; i++) {
        switch (services[i].CPT) {

            case "90806":
                //set button and freq
                $('#ckIndTher').prop('checked', true);
                setSelect('IndTher', services[i].Frequency);
                break;
            case "90847":
                $('#ckFamTher').prop('checked', true);
                setSelect('FamTher', services[i].Frequency);
                break;
            case "ckGrpTher":
                $('#ckFamTher').prop('checked', true);
                setSelect('GrpTher', services[i].Frequency);
                break;
            case "90212":
                $('#ckMedMgmt').prop('checked', true);
                setSelect('txtMedMgmt', services[i].CPT);
                setSelect('MedMgmt', services[i].Frequency);
                break;
            case "90213":
                $('#ckMedMgmt').prop('checked', true);
                setSelect('txtMedMgmt', services[i].CPT);
                setSelect('MedMgmt', services[i].Frequency);
                break;
            default:
                $('#ckOtherTher').prop('checked', true);
                setSelect('cptOtherTher', services[i].CPT);
                setSelect('OtherTher', services[i].Frequency);
                break;
        }
    }

    if (services.length > 0)
        $('#txtApptDate').val(services[0].NextAppt);
}

function setSelect(selectId, selectValue) {
    $("#" + selectId).val(selectValue);
}

function loadDischargeInfo(dischargeSection) {
    checkCheckBox('ckComplete', dischargeSection.Complete);
    checkCheckBox('ckRefStable', dischargeSection.Stable);
    checkCheckBox('ckRefResources', dischargeSection.CommunityResource);

    if (dischargeSection.OtherComments !== null) {
        $('#ckOther').prop('checked',true);
        $('#txtOtherText').val(dischargeSection.OtherComments);
    }
}

function LoadPreDischargeInfo(dischargeSection) {

    //Reason for discontinuation of treatment
    setRadioGroupSelection('radDisconRsn', dischargeSection.ReasonDiscont);
    $('#txtDisconOther').val(dischargeSection.ReasonComments);

    //Follow up interventions
    checkCheckBox('ckNoAtRisk', dischargeSection.NotAtRisk);
    checkCheckBox('ckDissatisfied', dischargeSection.Dissatisfied);
    checkCheckBox('ckSeverity', dischargeSection.Severity);
    checkCheckBox('ckFunction', dischargeSection.Functioning);
    checkCheckBox('ckSubstance', dischargeSection.SA);
    checkCheckBox('ckSuicidal', dischargeSection.Suicidal);

    if (dischargeSection.OtherComments !== null) {
        $('#ckATOther').prop('checked', true);
        $('#txtFollowUpOther').val(dischargeSection.OtherComments);
    }

    //Follow up "At Risk"
    checkCheckBox('ckComplex', dischargeSection.CCM);
    checkCheckBox('ckContacted', dischargeSection.ContactMember);
    checkCheckBox('ckNotify', dischargeSection.NotifyPCP);

    if (dischargeSection.OtherComments2 !== null) {
        $('#ckDocOther').prop('checked', true);
        $('#txtDocOther').val(dischargeSection.OtherComments2);
    }
}

function loadChangesUpdates(data) {

    if (data.Cont !== 0) {
        setRadioGroupSelection('rdoConPrevMed', data.Cont);
        $('#txtConPrevMed').val(data.ContOther);
        $('#txtDisPrevMed').val(data.DisconDrug);
        setRadioGroupSelection('rdoConPrevMed', data.Cont);
        $('#txtDisPrevMedOth').val(data.DisconOther);
        $('#txtAddNewMed').val(data.AddMed);
        $('#txtMedChanges').val(data.DescribeChange);
        setRadioGroupSelection('rdoClinUpdate', data.ClinicalUpdate);
        $('#txtClinUpdate').val(data.ClinicalOther);


    }
}

function loadMemberPCPInfo(data) {

    if (data.PANAME2 !== null && data.PANAME2 !== "")
        data.PANAME2 += ", ";
    $('#pcpName').html(data.PANAME2 + data.PANAME1);
    $('#pcpId').html(data.PAPROVID);
    $('#pcpPhone').html(addParenthesisToPhoneNumber(data.PAPHONE));
    $('#pcpAddress').html(data.PAADDR1 + " " + data.PAADDR2);
    $('#pcpCityState').html(data.PACITY, + " " + data.PASTATE);
    $('#pcpZip').html(data.PAZIP);
}

function loadFindingsAndRecommendations(data) {

    for (var i = 0; i < data.length; i++) {

        switch (data[i].Recommendation) {

            case 1:
                setRequestForPCPToProvicer(data[i]);
                break;

            case 2:
                setRequestForPCPToProvicer(data[i]);
                break;

            case 3:
                $('#rdoSED').prop('checked', true);
                break;

            case 4:
                setRecommendationForBehavioraHealthTreatment('rdoIndivPsych', 'txtIndivPsych', data[i], data[i].Specify);
                break;

            case 5:
                setRecommendationForBehavioraHealthTreatment('rdoFamTher', 'txtFamTher', data[i], data[i].Specify);
                break;

            case 6: ///start GroupTherapy
                setGroupTherapy(data[i]);
                setRecommendationForBehavioraHealthTreatment('rdoGrpTherPrac', 'txtGrpTherPrac', data[i], data[i].SpecifyTherapy);
                break;

            case 7:
                setGroupTherapy(data[i]);
                setRecommendationForBehavioraHealthTreatment('rdoGrpTherPrac', 'txtGrpTherPrac', data[i], data[i].SpecifyTherapy);
                break;

            case 8:
                setGroupTherapy(data[i]);
                setRecommendationForBehavioraHealthTreatment('rdoGrpTherPrac', 'txtGrpTherPrac', data[i], data[i].SpecifyTherapy);
                break;

            case 9:
                setGroupTherapy(data[i]);
                setRecommendationForBehavioraHealthTreatment('rdoGrpTherPrac', 'txtGrpTherPrac', data[i], data[i].SpecifyTherapy);
                break;

            case 10:
                setGroupTherapy(data[i]);
                setRecommendationForBehavioraHealthTreatment('rdoGrpTherPrac', 'txtGrpTherPrac', data[i], data[i].SpecifyTherapy);
                break;

            case 11:
                setGroupTherapy(data[i]);
                setRecommendationForBehavioraHealthTreatment('rdoGrpTherPrac', 'txtGrpTherPrac', data[i], data[i].SpecifyTherapy);
                break;

                /// end group therapy
            case 12:
                setRecommendationForBehavioraHealthTreatment('rdoPsychEval', 'txtPsychEval', data[i], data[i].Specify);
                break;

            case 13:
                setRecommendationForBehavioraHealthTreatment('rdoSubstanceTreat', 'txtSubstanceSpec', data[i], data[i].Specify);
                break;

            case 14:
                setRecommendationForBehavioraHealthTreatment('rdoDetox', 'txtDetox', data[i], data[i].Specify);
                break;

            case 15:
                setRecommendationForBehavioraHealthTreatment('rdoOutpatient', 'txtStructured', data[i], data[i].Specify);
                break;

            case 16:
                $('#rdoOthServ').prop('checked', true);
                $('#txtOthServ').val(data[i].SpecifyTherapy);
                break;

            default:
                break;
        }
    }
}
function loadVisitInformation(data) {
    var release = 0;
    if (data.ReleaseToPCP) release = 1;
    setRadioGroupSelection('rdoRelease', release);
    $("#txtDtInit").val(data.InitVisitDate);
    $("#txtConcurrent").val(data.ConcurentSpec);
}

function loadInitCheckBoxes(data) {

    setRadioGroupSelection("rdoAnxiety", data.Anxiety);
    setRadioGroupSelection("rdoAssultive", data.Assaultive);
    setRadioGroupSelection("rdoHallucination", data.Hallucination);
    setRadioGroupSelection("rdoDepression", data.Depression);
    setRadioGroupSelection("rdoConduct", data.ConductDisorder);
    setRadioGroupSelection("rdoParanoia", data.Paranoia);
    setRadioGroupSelection("rdoSleep", data.SleepDisorder);

    setRadioGroupSelection("rdoAttention", data.AttentionProblem);
    setRadioGroupSelection("rdoDissociative", data.Dissociative);
    setRadioGroupSelection("rdoWeight", data.WeightChange);
    setRadioGroupSelection("rdoConcentration", data.Concentration);
    setRadioGroupSelection("rdoSubstance", data.SubstanceAbuse);
    setRadioGroupSelection("rdoIsolation", data.Isolations);
    setRadioGroupSelection("rdoConfusion", data.Confusion);

    setRadioGroupSelection("rdoEating", data.EatingDisorder);
    setRadioGroupSelection("rdoObsessive", data.Obsessive);
    setRadioGroupSelection("rdoDementia", data.Dementia);
    setRadioGroupSelection("rdoOtherProblem", data.Other);
    setRadioGroupSelection("rdoAggressive", data.Agressive);
    setRadioGroupSelection("rdoDizziness", data.Dizziness);

    setCheckBoxValue("chkAuditory", data.HallucinationAuditory);
    setCheckBoxValue("chkVisual", data.HallucinationVisual);


    //$('#').val(data.Comments);
    $('#txtComments').val(data.InitComments);
    $('#txtOther').val(data.OtherTxt);
    $('#textExplain').val(data.PresentingProblemsComments);

}

function loadloadInitalServiceRequested(data) {

   
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {

            switch (data[i].ServiceRequested) {
                case 1:
                    setCheckBoxValue("rdoCounsel", data[i].FirstAvailable);
                    break;

                case 2:
                    setCheckBoxValue("rdoPsyc", data[i].FirstAvailable);
                    break;

                case 3:
                    setCheckBoxValue("rdoSubstanceAbuse", data[i].FirstAvailable);
                    break;

                default:
                    break;
            }

        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////utility functions/////////////////////////////////////


function addParenthesisToPhoneNumber(phoneNum) {

    var phonenumber = "";
    if (phoneNum.length >= 10) {
        var area = "(" + phoneNum.substr(0, 3) + ") ";
        var tel = phoneNum.substr(3, 7);
        phonenumber = area + tel;
    } else {
        phonenumber = phoneNum;
    }

    return phonenumber;
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

function checkCheckBox(inputName, value) {

    if (value) {
        $("#" + inputName).prop('checked', true);
    }

}

function setRadioGroupSelection(inputName, value) {

    if (value !== null && value !== undefined)
        $("input[name=" + inputName + "][value=" + value + "]").prop('checked', true);
}

function setCheckBoxValue(id, value) {

    if (value !== null && value !== undefined)
        $("#" + id).prop('checked', true);
}

function setRequestForPCPToProvicer(data) {

    var radioId = 'rdoRefer' + data.Recommendation;
    var specifyId = 'txtReferSpec' + (data.Recommendation - 1);
    $('#' + radioId).prop('checked', true);
    $('#' + specifyId).val(data.Specify);
}

function setRecommendationForBehavioraHealthTreatment(rid, iid, data, input) {

    setRadioGroupSelection(rid, data.Refer);
    $('#' + iid).val(input);
}

function setGroupTherapy(data) {
    setRadioGroupSelection('rdoGrpTher', data.Recommendation);
    $('#rdoGrpTher').val(data.Recommendation.SpecifyTherapy);
}


function printPDF() {

    alert('hello');

}


/////////////////////////Lob matcher
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