(function () {
    var app = angular.module('MemberPortalServices');

    app.factory('contentAuthorizationService', [ '$http', '$state',  '$rootScope','$location','$filter', 'localStorageService', 
        function ($http,$state,  $rootScope, $location, $filter, localStorageService ) {
          
            var accessGranted = false;
            var contentAuthorization = {};

            //console.log('@@==== CONTENT AUTH SERVICE');

            contentAuthorization.processAuthorizations = function (pageValidRoles, pageSecureItems) {
                var displayThisPage = false;
                var siteItem = []; //Init
                var PSI = pageSecureItems.split(',');

                if (pageValidRoles !== null && pageValidRoles.trim().length > 1) { 

                    //console.log('...PAGESECITEMS: ' + PSI + ' [' + PSI.length + ']'); 
                    var myRoles = localStorageService.get('RoleAcc');
                    if (myRoles !== null && myRoles.length !== 0)
                        myRoles = myRoles.replace(/\s/g, '').split(',');

                    ////======================= ENABLE AUTHORIZED ROLES FOR THIS PAGE
                    //console.log('...ACCEPTED ROLES:' + pageValidRoles); 
                    if (myRoles != null) { 
                       //console.log('...YOUR ROLES:' + myRoles + '  [' + myRoles.length + ']'); 
              
                        displayThisPage = true;
 
                        if (PSI.length > 1) {

                            var myInclusionAccess = localStorageService.get('IncAcc');
                            if (myInclusionAccess !== null && myInclusionAccess.length !== 0)
                                myInclusionAccess = myInclusionAccess.replace(/\s/g, '').split(',');

                            var myExclusionAccess = [];
                            myExclusionAccess = localStorageService.get('ExcAcc') === null ? myExclusionAccess :  localStorageService.get('ExcAcc');
                            if (myExclusionAccess !== null && myExclusionAccess.length !== 0)
                                myExclusionAccess = myExclusionAccess.replace(/\s/g, '').split(','); 

                            //console.log('INC>' + myInclusionAccess);
                            //console.log('EXC>' + myExclusionAccess);   
                            ////======================= EXCLUDE ALL   
                            //console.log('============================== EXCLUDE ALL SEC ITEMS FIRST ');
                       
                            if (PSI.length > 1)
                                for (var i = 0; i < PSI.length; i++) { 
                                    siteItem[PSI[i].trim()] = false;
                                        //console.log('EXCLUDE: siteItem[' + PSI[i] + '] ');
                                    }  
 


 
                            ////======================= ENABLE SPECIFIC INCLUSIONS  
                            //console.log('============================== INCLUDE EXPLICIT ITEMS ');
                            if (myInclusionAccess !== null && myInclusionAccess.length !== 0) {

                                for (var i = 0; i < myInclusionAccess.length; i++) {
                                    //console.log('@ i=' + i + ' :' + myInclusionAccess[i]);
                                    if (pageSecureItems.search(myInclusionAccess[i]) > -1) { 
                                       siteItem[myInclusionAccess[i].trim()] = true;
                                       //console.log('siteItem[' + myInclusionAccess[i] + '] =  ' + siteItem[myInclusionAccess[i].trim()]);
                                    }
                                }
                            } 
 
                              ////======================= DISABLE EXCLUSIONS    
                            //console.log('============================== EXCLUDE EXPLICIT ITEMS exclusion length=' + myExclusionAccess.length);
                            if (myExclusionAccess !== null && myExclusionAccess.length !== 0)
                                for (var i = 0; i < myExclusionAccess.length; i++) {
                                    if (pageSecureItems.search(myExclusionAccess[i]) > 0) {
                                        //console.log('EXCLUSION:' + myExclusionAccess[i]);
                                        siteItem[myExclusionAccess[i]] = false;
                                         //console.log(' siteItem[' + myExclusionAccess[i] + '] = ' + siteItem[myExclusionAccess[i]]);
                                    }
                                }  

                             //console.log('============================== FINISHED ');
                            
                          }
                    } else {

                        //console.log('!!! NO ROLE DEFINED');
                        alert('ERROR: No Role Defined!'); 
                    }

                }
                return siteItem;
            }

            contentAuthorization.GetObjectsFromJSON = function (obj, key, val) {
                var objects = [];
                for (var i in obj) {
                    if (!obj.hasOwnProperty(i)) continue;
                    if (typeof obj[i] == 'object') {
                        objects = objects.concat(contentAuthorization.GetObjectsFromJSON(obj[i], key, val));
                    } else if (i == key && obj[key] == val) {
                        objects.push(obj);
                    }
                }
                return objects;
            }
             
      

            contentAuthorization.processContentAuth = function (contentGroupCode) { 
              //console.log('@@ PROCESS CONTENTAUTH FOR >' + contentGroupCode);  
                var items = [];



                ////.................Will move to  in seperate config file or Webservice  
                var contentAuthObject = [
                    {
                        "CGC": "HOME",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "HOME, NAV.ELIG, NAV.ROST, NAV.ENC, NAV.FORM, NAV.RX,NAV.P4P, NAV.CLA,NAV.CLARA, NAV.AUTR, AUTR.REQ, AUTR.STAT " +
                                "NAV.BEH, NAV.VIS, NAV.VSN, NAV.DOFR, NAV.AUTS, NAV.HED, HED.REF, HED.REFSTAT ,NAV.WDI, NAV.CAP, NAV.REM, " +
                                "NAV.CEN, NAV.CPL, NAV.ADM, NAV.FIN,CLARA.RA,CLARA.STAT,CLARA.P4PRA,RX.UPA,RX.MCHK,RX.CMC,FIN.REM,FIN.CAP, BEH.INIT, BEH.COC,ENC, BEH.CLA, BEH.MEH" +
                                "NAV.SRV, SRV.PG1, SRV.PG2, VSN.VER, VSN.VERS, VSN.DIA, VSN.ICD, RX.DIR, RX.PER"
                        }
                    },
                      {
                          "CGC": "ELIG",
                          "CAO": {
                              "AR": "_ALL_",
                              "PSI": "ELIG.MHR"
                          }
                      },
                    {
                        "CGC": "ROST",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.AL, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCMPR, ROST.CCMPT, ROST.MCR, ROST.HCC, ROST.HM.CMR, ROST.HM.AR, ROST.HM.DR" +
                                "ROST.PC.CI, ROST.PC.WC015, ROST.PC.WC36, ROST.PC.WCA, ROST.PC.BC, ROST.PC.CC, ROST.PC.DC, ROST.PC.ADHD"
                        }
                    },
                    {
                        "CGC": "ROST.CCS",
                                      "CAO": {
                                          "AR": "_ALL_",
                                          "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                                      }
                    },
                    {
                      "CGC": "ROST.CCMPR",
                                      "CAO": {
                                          "AR": "_ALL_", 
                                          "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCMPR, ROST.CCMPT, ROST.MCR, ROST.HCC"
                                      }
                    }, {
                        "CGC": "ROST.CCMPT",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCMPR,ROST.CCMPT, ROST.MCR, ROST.HCC"
                        }
                    },

                        {
                            "CGC": "ROST.AR",
                            "CAO": {
                                "AR": "_ALL_",
                                "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                            }
                        },
                        {
                            "CGC": "ROST.DS",
                            "CAO": {
                                "AR": "_ALL_",
                                "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                            }
                        },
                        {
                            "CGC": "ROST.DA",
                            "CAO": {
                                "AR": "_ALL_",
                                "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                            }
                        },
                         {
                             "CGC": "ROST.HM",
                             "CAO": {
                                 "AR": "_ALL_",
                                 "PSI": "ROST, ROST.HM.CMR, ROST.HM.AR, ROST.HM.DR, CROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                             }
                         },
                         {
                             "CGC": "ROST.HMAR",
                             "CAO": {
                                 "AR": "_ALL_",
                                 "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                             }
                         },
                         {
                             "CGC": "ROST.HMCMR",
                             "CAO": {
                                 "AR": "_ALL_",
                                 "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                             }
                         },
                         {
                             "CGC": "ROST.HMDR",
                             "CAO": {
                                 "AR": "_ALL_",
                                 "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                             }
                         },
                         {
                             "CGC": "ROST.PC",
                             "CAO": {
                                 "AR": "_ALL_",
                                 "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC" +
                                     "ROST.PCCI, ROST.PCWC015, ROST.PCWC36, ROST.PCWCA, ROST.PCBC, ROST.PCCC, ROST.PCDC, ROST.PCADHD"
                             }
                         }, {
                             "CGC": "ROST.ED",
                             "CAO": {
                                 "AR": "_ALL_",
                                 "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                             }
                         },
                          {
                              "CGC": "ROST.PCCI",
                              "CAO": {
                                  "AR": "_ALL_",
                                  "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                              }
                          },
                           {
                               "CGC": "ROST.PCWC",
                               "CAO": {
                                   "AR": "_ALL_",
                                   "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                               }
                           }, {
                               "CGC": "ROST.PCWC015",
                               "CAO": {
                                   "AR": "_ALL_",
                                   "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                               }
                           }, {
                               "CGC": "ROST.PCWC36",
                               "CAO": {
                                   "AR": "_ALL_",
                                   "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                               }
                           }, {
                               "CGC": "ROST.PCWCA",
                               "CAO": {
                                   "AR": "_ALL_",
                                   "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                               }
                           }, {
                               "CGC": "ROST.PCBC",
                               "CAO": {
                                   "AR": "_ALL_",
                                   "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                               }
                           },
                           {
                               "CGC": "ROST.PCCC",
                               "CAO": {
                                   "AR": "_ALL_",
                                   "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                               }
                           },
                           {
                               "CGC": "ROST.PCDC",
                               "CAO": {
                                   "AR": "_ALL_",
                                   "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                               }
                           }, {
                               "CGC": "ROST.PCADHD",
                               "CAO": {
                                   "AR": "_ALL_",
                                   "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                               }
                           }, {
                               "CGC": "ROST.HCC",
                               "CAO": {
                                   "AR": "_ALL_",
                                   "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                               }
                           },
                           {
                               "CGC": "ROST.EA",
                               "CAO": {
                                   "AR": "_ALL_",
                                   "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                               }
                           },
                           {
                               "CGC": "ROST.IHA",
                               "CAO": {
                                   "AR": "_ALL_",
                                   "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC, ROST.IHA, IHA"
                               }
                           },
                            {
                                "CGC": "ROST.MCR",
                                "CAO": {
                                    "AR": "_ALL_",
                                    "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC, ROST.IHA, IHA"
                                }
                            },

                             {
                                 "CGC": "ROST.NA",
                                 "CAO": {
                                     "AR": "_ALL_",
                                     "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC, ROST.IHA, IHA"
                                 }
                             },






                       {
                           "CGC": "MHR",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                           }
                       },
                       {
                           "CGC": "PC",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC" +
                                   "ROST.PCCI, ROST.PCWC015, ROST.PCWC36, ROST.PCWCA, ROST.PCBC, ROST.PCCC, ROST.PCDC, ROST.PCADHD"
                           }
                       },
                    {
                        "CGC": "PCADHD",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC" +
                                "ROST.PCCI, ROST.PCWC015, ROST.PCWC36, ROST.PC.WCA, ROST.PCBC, ROST.PC.CC, ROST.PCDC, ROST.PCADHD"
                        }
                    },
                    {
                        "CGC": "PCDC",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC" +
                                "ROST.PCCI, ROST.PCWC015, ROST.PCWC36, ROST.PCWCA, ROST.PCBC, ROST.PCCC, ROST.PCDC, ROST.PCADHD"
                        }
                    },
                    {
                        "CGC": "PCCC",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC" +
                                "ROST.PCCI, ROST.PCWC015, ROST.PCWC36, ROST.PCWCA, ROST.PCBC, ROST.PCCC, ROST.PCDC, ROST.PCADHD"
                        }
                    },
                    {
                        "CGC": "PCBC",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC" +
                                "ROST.PCCI, ROST.PCWC015, ROST.PCWC36, ROST.PCWCA, ROST.PCBC, ROST.PCCC, ROST.PCDC, ROST.PCADHD"
                        }
                    },
                    {
                        "CGC": "PCWCA",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC" +
                                "ROST.PCCI, ROST.PCWC015, ROST.PCWC36, ROST.PCWCA, ROST.PCBC, ROST.PCCC, ROST.PCDC, ROST.PCADHD"
                        }
                    },
                    {
                        "CGC": "PCWC36",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC" +
                                "ROST.PCCI, ROST.PCWC015, ROST.PCWC36, ROST.PCWCA, ROST.PCBC, ROST.PCCC, ROST.PCDC, ROST.PCADHD"
                        }
                    },
                    {
                        "CGC": "PCWC015",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC" +
                                "ROST.PCCI, ROST.PCWC015, ROST.PCWC36, ROST.PCWCA, ROST.PCBC, ROST.PCCC, ROST.PCDC, ROST.PCADHD"
                        }
                    },
                    {
                        "CGC": "PCCI",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC" +
                                "ROST.PCCI, ROST.PCWC015, ROST.PCWC36, ROST.PCWCA, ROST.PCBC, ROST.PCCC, ROST.PCDC, ROST.PCADHD"
                        }
                    },
                    {
                        "CGC": "HM",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.HM.CMR, ROST.HM.AR, ROST.HM.DR, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                        }
                    }, {
                        "CGC": "HMAR",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                        }
                    },
                      {
                          "CGC": "HMCMR",
                          "CAO": {
                              "AR": "_ALL_",
                              "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                          }
                      },
                       {
                           "CGC": "HMDR",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                           }
                       },
                        {
                           "CGC": "ED",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                           }
                        },
                         
                        
                        {
                            "CGC": "DSCTH",
                            "CAO": {
                                "AR": "_ALL_",
                                "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                            }
                        },
                        {
                            "CGC": "DSHD",
                            "CAO": {
                                "AR": "_ALL_",
                                "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                            }
                        },
                        {
                            "CGC": "DSLD",
                            "CAO": {
                                "AR": "_ALL_",
                                "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                            }
                        },
                        {
                            "CGC": "DSR",
                            "CAO": {
                                "AR": "_ALL_",
                                "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                            }
                        },
                        {
                            "CGC": "DSSBP",
                            "CAO": {
                                "AR": "_ALL_",
                                "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                            }
                        },
                        {
                            "CGC": "DSWSB",
                            "CAO": {
                                "AR": "_ALL_",
                                "PSI": "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS,ROST.CCM, ROST.MCR, ROST.HCC"
                            }
                        }, 
           
                       {
                           "CGC": "UCL",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": "UCL"
                           }
                       },
                       
                       {
                           "CGC": "ENC",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": "NAV.ENC,ENC"
                           }
                       },
                        
                       {
                           "CGC": "RX",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": ""
                           }
                       },
                       {
                           "CGC": "RX.UPA",
                                "CAO": {
                                    "AR": "_ALL_",
                                    "PSI": "NAV.RX,RX,RX.UPA"
                                }
                            },

                        
                       {
                           "CGC": "CLARA",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": "CLARA.STAT,CLARA.RA, CLARA.P4PRA"
                           }
                       },
                        
                       {
                           "CGC": "CLARA.STAT",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": "CLARA.STAT,CLARA.RA, CLARA.P4PRA"
                           }
                       },
                        {
                           "CGC": "CLARA.RA",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": "CLARA.STAT,CLARA.RA, CLARA.P4PRA"
                           }
                       },
                       {
                           "CGC": "CLARA.P4PRA",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": "CLARA.STAT,CLARA.RA, CLARA.P4PRA"
                           }
                       },
                        {
                           "CGC": "CLARA.DET",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": ""
                           }
                       },
                         {
                           "CGC": "CEN",
                           "CAO": {
                               "AR": "_ALL_",
                               "PSI": ""
                           }
                       },
                    {
                        "CGC": "BEH",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "NAV.BEH, BEH.INIT, BEH.COC, BEH.HAV, BEH.MEH"
                        }
                    },
                    {
                        "CGC": "BEH.INIT",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "NAV.BEH, BEH.INIT, BEH.COC"
                        }
                    },
                    {
                        "CGC": "BEH.COC",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "NAV.BEH, BEH.INIT, BEH.COC"
                        }
                    },
                    {
                        "CGC": "BEH.AUT",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "NAV.BEH, BEH.INIT, BEH.COC"
                        }
                    },
                    {
                        "CGC": "AUTR",
                        "CAO": {
                            "AR": "_ALL_",
                            "PSI": "NAV.AUTR,AUTR, AUTR.REQ, AUTR.STAT"
                        }
                    },
                      {
                          "CGC": "AUTR.REQ",
                          "CAO": {
                              "AR": "_ALL_",
                              "PSI": "AUTR, AUTR.REQ, AUTR.STAT"
                          }
                      },
                      {
                          "CGC": "AUTR.STAT",
                          "CAO": {
                              "AR": "_ALL_",
                              "PSI": "AUTR, AUTR.REQ, AUTR.STAT"
                          }
                      },
                     {
                         "CGC": "FIN",
                         "CAO": {
                             "AR": "_ALL_",
                             "PSI": "FIN,FIN.REM,FIN.CAP"
                         }
                     },
                     {
                         "CGC": "FIN.REM",
                         "CAO": {
                             "AR": "_ALL_",
                             "PSI": "FIN,FIN.REM,FIN.CAP"
                         }
                     },
                     {
                         "CGC": "FIN.CAP",
                         "CAO": {
                             "AR": "_ALL_",
                             "PSI": "FIN,FIN.REM,FIN.CAP"
                         }
                     }
                ]; 

                  
                var arrContentGroup = contentAuthorization.GetObjectsFromJSON(contentAuthObject, "CGC", contentGroupCode);
                var contentGroupItem = arrContentGroup[0]; 
                 
                if (contentAuthObject.length > 0)
                        items = contentAuthorization.processAuthorizations(contentGroupItem.CAO.AR, contentGroupItem.CAO.PSI);
                    return items; 
            } 
            return contentAuthorization;
    }]);
})();


