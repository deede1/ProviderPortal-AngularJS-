(function () {
    'use strict';

    angular
		.module('MemberPortalServices')
		.factory('memberDataService', memberDataService);
    /////////////////////

    memberDataService.$inject = ['$http', '$rootScope'];

    function memberDataService($http, $rootScope) {

        var urlBase = $('meta[name="ApplicationRoot"]').attr('content');

        var memberDataService = {};

        //if you want to use alpha branch to test an endpoint, use 'var serviceBase=alphaBase;' ONLY in your method -LD
        var alphaBase = 'http://devserv.iehp.org/IehpWebApiAlpha/';
        var devBase = 'https://devserv.iehp.org/IehpWebApiDev/';

        //var serviceBase = devBase;
        var serviceBase = $('meta[name="dataServiceBase"]').attr('content');

        //====================== WSEDO
        //
        //Can be refactored to be retrived dynamically from a WS later on
        //
       // memberDataService.WebServiceEndpointDefinitionObject = [];


        //
        //===== This object will reside as a separate JSON file, and later can even be made available as a WebService
        //
        //


        memberDataService.getWebServiceObject = function(wsType) {

            var WebServiceEndpointDefinitionObject = [];
        
           WebServiceEndpointDefinitionObject['Rosters'] = [
                {
                    RosterTypeCode: 'ROST.AR',
                    RosterTitle: 'Assigned Roster ',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/Assigned/TaxId/Providers',
                        PCPEndPointURL: 'Provider/Portal/Roster/Assigned/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/Assigned/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 0 //0 = Ascending 1= Descending
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/Assigned/Members',
                            RequiredParams: {
                                Ipa: true //FOR PCP ONLY 
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 0
                                    }
                                ]
                            },
                            SubView: null
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.CCS',
                    RosterTitle: 'CCS Roster ',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/CCS/TaxId/Providers',
                        PCPEndPointURL: 'Provider/Portal/Roster/CCS/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/CCS/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 0
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/CCS/Members',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 0
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Roster/CCSAuthorization',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null, // "200711006623", //test
                                    PersonNumber: null, //"01", //test
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 5,
                                    Sort: [
                                        //{
                                        //    "name": 'EffectiveDates',
                                        //    "direction": 'descending'
                                        //}
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                }, {
                    RosterTypeCode: 'ROST.CCMPT',
                    RosterTitle: 'CCM Plan Transfer Roster ',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/CCM/TransferCarePlan/TaxId', 
                        PCPEndPointURL: 'Provider/Portal/Roster/CCM/TransferCarePlan/TaxId',
                        IPAEndPointURL: 'Provider/Portal/Roster/CCM/TransferCarePlan/IPA',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 0
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: ' ',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 0
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: ' ',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null, // "200711006623", //test
                                    PersonNumber: null, //"01", //test
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 5,
                                    Sort: [
                                        //{
                                        //    "name": 'EffectiveDates',
                                        //    "direction": 'descending'
                                        //}
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                }, {
                    RosterTypeCode: 'ROST.CCMPR',
                    RosterTitle: 'CCM Plan Referral Roster ',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/CCM/PlanReferrals/TaxId',
                        PCPEndPointURL: 'Provider/Portal/Roster/CCM/PlanReferrals/TaxId',
                        IPAEndPointURL: 'Provider/Portal/Roster/CCM/PlanReferrals/IPA',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 0
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: ' ',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 0
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: ' ',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null, // "200711006623", //test
                                    PersonNumber: null, //"01", //test
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 5,
                                    Sort: [
                                        //{
                                        //    "name": 'EffectiveDates',
                                        //    "direction": 'descending'
                                        //}
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.HCC',
                    RosterTitle: 'HCC Roster ',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/HCC/TaxId/Providers',
                        PCPEndPointURL: 'Provider/Portal/Roster/HCC/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/HCC/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 0
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/HCC/Provider/Members',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 0
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: ' ',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null, // "200711006623", //test
                                    PersonNumber: null, //"01", //test
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 5,
                                    Sort: [
                                        //{
                                        //    "name": 'EffectiveDates',
                                        //    "direction": 'descending'
                                        //}
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.DA',
                    RosterTitle: 'Direct Ancillary Roster ',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/DirectAncillary/ContractedServices/Specialties',
                        PCPEndPointURL: 'Provider/Portal/Roster/DirectAncillary/ContractedServices/Specialties',
                        IPAEndPointURL: 'Provider/Portal/Roster/DirectAncillary/ContractedServices/Specialties',
                        RequiredParams: {
                        
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/DirectAncillary/ContractedServices/Specialty/Providers',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ContractedService: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    { name: 'Contract', direction: 0 }
                                ]
                            },
                            SubView: null
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.PCADHD',
                    RosterTitle: 'Preventive Care: ADHD (Followup Care)',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',

                        PCPEndPointURL: 'Provider/Portal/Roster/P4P/ADHD/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/P4P/ADHD/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/P4P/ADHD/Members',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Roster/P4P/ADHDDetail',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null, // "200711006623", //test
                                    PersonNumber: null, //"01", //test
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": 'DateOfService',
                                            "direction": 'descending'
                                        }
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.PCDC',
                    RosterTitle: 'Preventive Care: Diabetes Care',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',

                        PCPEndPointURL: 'Provider/Portal/Roster/P4P/Diabetes/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/P4P/Diabetes/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/P4P/Diabetes/Members',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Roster/P4P/DiabetesDetail',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": 'ServiceDate',
                                            "direction": 'descending'
                                        }
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.PCCC',
                    RosterTitle: 'Preventive Care: Cervical Cancer Screen',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',

                        PCPEndPointURL: 'Provider/Portal/Roster/P4P/CervicalCancer/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/P4P/CervicalCancer/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true

                        },
                        Params: {
                            ProviderNumber: null,
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/P4P/CervicalCancer/Members',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                ReturnLastUpdate: true,
                                IsApiPaging: true,
                                Ipa: null,
                                lala: 'aaa',
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Roster/P4P/CervicalCancerDetail',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": 'ServiceDate',
                                            "direction": 'descending'
                                        }
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.PCBC',
                    RosterTitle: 'Preventive Care: Breast Cancer Screen',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        PCPEndPointURL: 'Provider/Portal/Roster/P4P/BreastCancer/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/P4P/BreastCancer/IPA/Providers',
                        RequiredParams: {
                            //PTI applies to PCP ONLY; IPA applies to IPA ONLY
                            ProviderTaxId: true,
                            Ipa: true
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/P4P/BreastCancer/Members',
                            RequiredParams: {
                                Ipa: true //FOR PCP ONLY 
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Roster/P4P/BreastCancerDetail',
                                RequiredParams: {
                                    SubscriberNumber: true,
                                    PersonNumber: true
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": 'ServiceDate',
                                            "direction": 'descending'
                                        }
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.PCWCA',
                    RosterTitle: 'Preventive Care: Well Care (Adolescent)',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        PCPEndPointURL: 'Provider/Portal/Roster/P4P/WellcareAdolescent/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/P4P/WellcareAdolescent/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true

                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/P4P/WellcareAdolescent/Members',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                Ipa: null,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Roster/P4P/WellcareAdolescentDetail',
                                RequiredParams: {
                                    SubscriberNumber: true,
                                    PersonNumber: true
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": 'ServiceDate',
                                            "direction": 'descending'
                                        }
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.PCWC36',
                    RosterTitle: 'Preventive Care: Well Care (3-6months)',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        PCPEndPointURL: 'Provider/Portal/Roster/P4P/Wellcare3To6Years/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/P4P/Wellcare3To6Years/IPA/Providers',
                        RequiredParams: { ProviderTaxId: true, Ipa: true },
                        Params: {
                            ProviderNumber: null,
                            ReturnLastUpdate: true,
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/P4P/WellCare3To6Years/Members',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,

                                IsApiPaging: true,
                                Ipa: null,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Roster/P4P/Wellcare3To6YearsDetail',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.PCWC015',
                    RosterTitle: 'Preventive Care: Well Care (0-15months)',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        PCPEndPointURL: 'Provider/Portal/Roster/P4P/WellCare0To15Months/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/P4P/WellCare0To15Months/IPA/Providers',

                        RequiredParams: { ProviderTaxId: true, Ipa: true },
                        Params: {
                            ProviderNumber: null,
                            ReturnLastUpdate: true,
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/P4P/WellCare0To15Months/Members',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                Ipa: null,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Roster/P4P/WellCare0To15MonthsDetail',
                                RequiredParams: {
                                    ProviderTaxId: true
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": 'DateOfService',
                                            "direction": 1 //descending
                                        }
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.PCCI',
                    RosterTitle: 'Preventive Care: Childhood Immunizations',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        PCPEndPointURL: 'Provider/Portal/Roster/P4P/ChildhoodImmunization/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/P4P/ChildhoodImmunization/IPA/Providers',

                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true

                        },
                        Params: {
                            ProviderNumber: null,
                            ReturnLastUpdate: true,
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/P4P/ChildhoodImmunization/Members',

                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                Ipa: null,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Roster/P4P/ChildhoodImmunizationDetail',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": "ServiceType",
                                            "direction": 0
                                        },
                                        {
                                            "name": 'DateOfService',
                                            "direction": 1
                                        }
                                    ]
                                },
                                SubView: {
                                    ViewLevel: 'CSV',
                                    RosterDescription: 'Returns a list of Procedures per given Member',
                                    EndPointURL: 'Provider/Portal/Roster/P4P/ChildhoodImmunization/Members/CSV',
                                    RequiredParams: {
                                    
                                    },
                                    Params: {
                                        ProviderNumber: null,
                                        ProviderTaxId: null,
                                        IPA: null,
                                        IsApiPaging: false,
                                        PageNumber: 1,
                                        RowsPerPage: 25,
                                        Sort: [
                                        ]
                                    },
                                    SubView: null
                                }
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.NA',
                    RosterTitle: 'Nurse Advice Line',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/NurseLine/TaxId/Providers',
                        PCPEndPointURL: 'Provider/Portal/Roster/NurseLine/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/NurseLine/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true

                        },
                        Params: {
                            IsApiPaging: true,
                            daysBack: '2000',
                            ProviderType: 'PCP',
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/NurseLine/Provider/Members',
                            RequiredParams: {
                                ProviderTaxId: true,
                                Ipa: true
                            },
                            Params: {
                                ProviderNumber: null,
                                ReturnLastUpdate: true,
                                IsApiPaging: true,
                                Ipa: null,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: '',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": 'ServiceDate',
                                            "direction": 'descending'
                                        }
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.MCR',
                    RosterTitle: 'MCR Member Transfer',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/MCRTransferSummary',
                        PCPEndPointURL: 'Provider/Portal/Roster/MCRTransferSummary',
                        IPAEndPointURL: 'Provider/Portal/Roster/MCRTransferSummary',
                        RequiredParams: { ProviderTaxId: true, Ipa: true },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: '',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderTaxId: null,
                                ProviderNumber: null,
                                ReturnLastUpdate: true,
                                IsApiPaging: true,
                                Ipa: null,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: '',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": 'ServiceDate',
                                            "direction": 'descending'
                                        }
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.HMAR',
                    RosterTitle: 'Asthma Roster',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/Asthma/TaxId/Providers',
                        PCPEndPointURL: 'Provider/Portal/Roster/Asthma/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/Asthma/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/Asthma/Provider/Members',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 0
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Roster/AsthmaDetail/ED',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": "BeginDateOfService",
                                            "direction": 0
                                        }
                                    ]
                                },
                                SubView: {
                                    ViewLevel: '4',
                                    RosterDescription: 'Returns a list',
                                    EndPointURL: 'Provider/Portal/Roster/AsthmaDetail/HospitalVisits',
                                    RequiredParams: {
                                    
                                    },
                                    Params: {
                                        SubscriberNumber: null,
                                        PersonNumber: null,
                                        IsApiPaging: true,
                                        PageNumber: 1,
                                        RowsPerPage: 25,
                                        Sort: [
                                            //{
                                            //    "name": "ServiceDate",
                                            //    "direction": "descending"
                                            //}
                                        ]
                                    },
                                    SubView: {
                                        ViewLevel: '5',
                                        RosterDescription: 'Returns a list',
                                        EndPointURL: 'Provider/Portal/Roster/AsthmaDetail/Rx',
                                        RequiredParams: {
                                        
                                        },
                                        Params: {
                                            SubscriberNumber: null,
                                            PersonNumber: null,
                                            IsApiPaging: true,
                                            PageNumber: 1,
                                            RowsPerPage: 25,
                                            Sort: [
                                                {
                                                    "name": "FFILLDATE",
                                                    "direction": 0
                                                }
                                            ]
                                        },
                                        SubView: null
                                    }
                                }
                            }


                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.HMDR',
                    RosterTitle: 'Diabetes Roster',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/Diabetes/TaxId/Providers',
                        PCPEndPointURL: 'Provider/Portal/Roster/Diabetes/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/Diabetes/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true

                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/Diabetes/Provider/Members',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Roster/Diabetes/Detail/ED',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": 'DOS',
                                            "direction": 'descending'
                                        }
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.ED',
                    RosterTitle: 'Encounter Data',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        EndPointURL: 'Provider/Portal/Roster/ ',
                        PCPEndPointURL: 'Provider/Portal/Roster/ /   ',
                        IPAEndPointURL: 'Provider/Portal/Roster/ / /',
                        RequiredParams: { ProviderTaxId: true, Ipa: true },
                        Params: {
                            ProviderNumberFilter: null,
                            ProviderTaxIdFilter: null,
                            IpaFilter: null,
                            SubscriberNumberFilter: null,
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/ ',
                            RequiredParams: {
                            
                            },
                            Params: {
                                SubscriberNumberFilter: null,
                                PersonNumberFilter: null,
                                TypeFilter: true,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": 'MemberLName',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: '',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    SubscriberNumber: null,
                                    PersonNumber: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": 'ServiceDate',
                                            "direction": 'descending'
                                        }
                                    ]
                                },
                                SubView: null
                            }
                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.DS',
                    RosterTitle: 'Direct Specialty',
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/DirectSpecialty/Region/',
                        PCPEndPointURL: 'Provider/Portal/Roster/DirectSpecialty/Region/',
                        IPAEndPointURL: 'Provider/Portal/Roster/DirectSpecialty/Region/',
                        RequiredParams: {},
                        Params: {
                            ProcessTypeFilter: null,
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'Region',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Procedures per given Member',
                            EndPointURL: '/Provider/Portal/Roster/DirectSpecialty/Region/SpecialtyGroups',
                            RequiredParams: {},
                            Params: {
                                Region: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 25,
                                Sort: [
                                    {
                                        "name": "SpecialtyGroups",
                                        "direction": 0
                                    },
                                    {
                                        "name": "Specialty",
                                        "direction": 0
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Members per given Provider',
                                EndPointURL: 'Provider/Portal/Roster/DirectSpecialty/Region/ProviderList',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    Region: null,
                                    SpecialtyGroup: null,
                                    Specialty: null,
                                    IsApiPaging: true,
                                    PageNumber: 1,
                                    RowsPerPage: 25,
                                    Sort: [
                                        {
                                            "name": "SpecialtyGroups",
                                            "direction": 0
                                        },
                                        {
                                            "name": "Specialty",
                                            "direction": 0
                                        },
                                        {
                                            "name": "ProviderName",
                                            "direction": 0
                                        },
                                        {
                                            "name": "Address",
                                            "direction": 0
                                        }
                                    ]
                                }
                            }
                        }

                    }
                },
                {
                    RosterTypeCode: 'ROST.HMCMR',
                    RosterTitle: "Care Plans/HRA's/Notes",
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/CarePlan/TaxId/Providers',
                        PCPEndPointURL: 'Provider/Portal/Roster/CarePlan/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/CarePlan/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/CarePlan/Providers/MembersList',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 10,
                                Sort: [
                                    {
                                        "name": 'EffectiveDate',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: 'Provider/Portal/Shared/CarePlan/MedHok?fileReference=',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    fileReference: null
                                },
                                SubView: {
                                    ViewLevel: '4',
                                    RosterDescription: 'Returns a list of Procedures per given Member',
                                    EndPointURL: 'Provider/Portal/Shared/CarePlan/Har?fileReference=', //200605003540_SPDLOWMOD_20150303.pdf",
                                    RequiredParams: {
                                    
                                    },
                                    Params: {
                                        fileReference: null
                                    },
                                    SubView: null
                                }
                            }

                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.ESR',
                    RosterTitle: "Early Start Roster",
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        //EndPointURL: 'Provider/Portal/Roster/',
                        PCPEndPointURL: 'Provider/Portal/Roster/CarePlan/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/CarePlan/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true

                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: ' //// ',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 10,
                                Sort: [
                                    {
                                        "name": 'EffectiveDate',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: ' ////',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    fileReference: null
                                },
                                SubView: {
                                    ViewLevel: '4',
                                    RosterDescription: 'Returns a list of Procedures per given Member',
                                    EndPointURL: ' ////',
                                    RequiredParams: {
                                    
                                    },
                                    Params: {
                                        fileReference: null
                                    },
                                    SubView: null
                                }
                            }

                        }
                    }
                },
                {
                    RosterTypeCode: 'ROST.IHA',
                    RosterTitle: "Initial Health Assessment",
                    EndPoint: {
                        ViewLevel: '1',
                        RosterDescription: 'Returns a list of Providers per given TIN',
                        EndPointURL: 'Provider/Portal/Roster/HealthAssessment/TaxId/Providers',
                        PCPEndPointURL: 'Provider/Portal/Roster/HealthAssessment/TaxId/Providers',
                        IPAEndPointURL: 'Provider/Portal/Roster/HealthAssessment/IPA/Providers',
                        RequiredParams: {
                            ProviderTaxId: true,
                            Ipa: true
                        },
                        Params: {
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 100,
                            Sort: [
                                {
                                    "name": 'ProviderLName',
                                    "direction": 'ascending'
                                }
                            ]
                        },
                        SubView: {
                            ViewLevel: '2',
                            RosterDescription: 'Returns a list of Members per given Provider',
                            EndPointURL: 'Provider/Portal/Roster/HCC/Provider/Members',
                            RequiredParams: {
                            
                            },
                            Params: {
                                ProviderNumber: null,
                                IsApiPaging: true,
                                PageNumber: 1,
                                RowsPerPage: 10,
                                Sort: [
                                    {
                                        "name": 'EffectiveDate',
                                        "direction": 'ascending'
                                    }
                                ]
                            },
                            SubView: {
                                ViewLevel: '3',
                                RosterDescription: 'Returns a list of Procedures per given Member',
                                EndPointURL: ' ////',
                                RequiredParams: {
                                
                                },
                                Params: {
                                    fileReference: null
                                },
                                SubView: {
                                    ViewLevel: '4',
                                    RosterDescription: 'Returns a list of Procedures per given Member',
                                    EndPointURL: ' ////',
                                    RequiredParams: {
                                    
                                    },
                                    Params: {
                                        fileReference: null
                                    },
                                    SubView: null
                                }
                            }

                        }
                    }
                },
                {
                    RosterTypeCode: 'UCL',
                    RosterTitle: 'Urgent Care List',
                    EndPoint: {
                        ViewLevel: '1',
                        Description: 'Returns a list of Urgent Care facilities per given location',
                        EndPointURL: 'IEHP/List/UrgentCare/',
                        PCPEndPointURL: 'IEHP/List/UrgentCare/',
                        IPAEndPointURL: 'IEHP/List/UrgentCare/',
                        RequiredParams: {},
                        Params: {
                            Distance: null, //integer
                            Longitude: null, //decimal
                            Latitude: null, // decimal
                            UseLatLongSearch: true,
                            City: null, //string
                            Zipcode: null, //string
                            DistanceType: 0, // 0= miles 1=Km
                            IsApiPaging: true,
                            PageNumber: 1,
                            RowsPerPage: 25,
                            Sort: [
                            ]
                        }

                    }
                }
            ];
            return WebServiceEndpointDefinitionObject[wsType];

        };
    

    /**
        * 
        * ************************************* ROSTER DETAILS  
        * JCAST 2.16.2016
        */
        memberDataService.GetRosterSubViewDetails = function (wsType, rosterType, level, params, pcpType) {
            var webserviceObject =[];
            webserviceObject = memberDataService.getWebServiceObject(wsType);

            var rt = memberDataService.GetObjectsFromJSON(webserviceObject, 'RosterTypeCode', rosterType);

            var vl = memberDataService.GetObjectsFromJSON(rt, 'ViewLevel', level);
            var endpointViewLevel = vl[0];

            //default
            var urlWebService = serviceBase + endpointViewLevel.EndPointURL;

            if (level == 1)
                switch (pcpType) {
                    case "PCP": urlWebService = serviceBase + endpointViewLevel.PCPEndPointURL; break;
                    case "IPA": urlWebService = serviceBase + endpointViewLevel.IPAEndPointURL; break;
                }

            switch (rosterType + level) {
                case 'ROST.HMCMR3':
                    return $http.get(urlWebService + JSON.parse(params).fileReference);
                    break;
                case 'ROST.HMCMR4':
                    return $http.get(urlWebService + JSON.parse(params).fileReference);
                    break;
                default:
                    return $http.post(urlWebService, params);
                    break;
            }

        };
      
        memberDataService.GetObjectsFromJSON = function (obj, key, val) {
            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) {
                    continue;
                }
                if (typeof obj[i] == 'object') {
                    objects = objects.concat(memberDataService.GetObjectsFromJSON(obj[i], key, val));
                } else if (i == key && obj[key] == val) {
                    objects.push(obj);
                }
            }
            return objects;
        };


        /**
* 
* *************************************  ROSTERS GET CSV   
*/
      memberDataService.fetchRosterCSV = function (rosterTypeCode, params) {
                    var config = {
                    params: params
                    };
                    var urlWebService = serviceBase + 'Provider/Portal/Roster/P4P/ChildhoodImmunization/Members/FileExport';
                    console.log('POST >', urlWebService, params);
          
                   //------ Get Roster Title 
          //   var reqO = memberDataService.WebServiceEndpointDefinitionObject[$scope.WSEDO];
                    var reqO = memberDataService.getWebServiceObject($scope.WSEDO);
	                var rosterObject = memberDataService.GetObjectsFromJSON(reqO, 'RosterTypeCode', rosterTypeCode); // (object, Key, Value)  
                    $scope.rosterTypeCode = rosterTypeCode;


            return $http.post(urlWebService, params);
        };




        /**
				* 
				* ************************************* NOTIFICATIONS   
				*/
        memberDataService.GetMemberNotifications = function () {

        };
        /** 
* ************************************* COMMON PROVIDER FORM
*/

        memberDataService.CheckIcdCode = function (params) {
            //	var serviceBase = alphaBase;
            var urlWebService = serviceBase + 'Provider/Portal/ProviderForms/Validation/IcdCode';
            console.log('POST >', urlWebService, params);
            return $http.post(urlWebService, params);
        };

        memberDataService.CheckProcCode = function (params) {
            //	var serviceBase = alphaBase;
            var urlWebService = serviceBase + 'Provider/Portal/ProviderForms/Validation/ProcedureCode';
            console.log('POST >', urlWebService, params);
            return $http.post(urlWebService, params);
        };

        memberDataService.CheckModCode = function (params) {
            //	var serviceBase = alphaBase;
            var urlWebService = serviceBase + 'Provider/Portal/ProviderForms/Validation/ModifierCode';
            console.log('POST >', urlWebService, params);
            return $http.post(urlWebService, params);
        };
        /**
	*************************************** ELIGIBILITY **********************************************/
        memberDataService.PPGetEligibility = function (searchType, params) {
            var config = {
                params: params
            };
            var urlWebService;


            switch (searchType.toUpperCase()) {
                case 'ELIG_SSN':
                    urlWebService = serviceBase + 'Provider/Portal/EligibilitySearchBySsn';
                    break;
                case 'ELIG_CIN':
                    urlWebService = serviceBase + 'Provider/Portal/EligibilitySearchByCin';
                    break;
                case 'ELIG_IEHPID':
                    urlWebService = serviceBase + 'Provider/Portal/EligibilitySearchByIehpId';
                    break;
                case 'ELIG_LASTNAME':
                    urlWebService = serviceBase + 'Provider/Portal/EligibilitySearchByLastName';
                    break;
                case 'ELIG_MULTIPLE':
                    urlWebService = serviceBase + 'Provider/Portal/EligibilitySearch';
                    break;
                default:
                    console.log('!!!ERROR NO CASE MET');
                    break;
            }
            return $http.post(urlWebService, params);
        };

        memberDataService.GetEligibility = function (params) {
            var config = {
                params: params
            };

            return $http.post(serviceBase + 'Provider/Portal/EligibilitySearch', params);
        };

        //   GET ELIGIBILITY NOTIFICATIONS
        memberDataService.GetEligibilityNotifications = function (subscriberNumber) {
            var urlWebService = serviceBase + 'Provider/Portal/GetEligibilityNotifications?subscriberNumber=' + subscriberNumber;
            console.log('@GET ELIG NOTIF GET >', urlWebService);
            return $http.get(urlWebService);

        };

        /**
	* 
	* ************************************* Encounter   
	*/
        memberDataService.GetEncounter = function (list, params) {
            var params = params || {};
            var urlWebService = serviceBase + 'Provider/Portal/Encounters/' + list;
            console.log('POST >', urlWebService, params);
            return $http.post(urlWebService, params);
        };

        memberDataService.GetProviderOfServices = function () {
            var urlWebService = serviceBase + 'Provider/Portal/P4P/GetProviderOfServicesList';
            console.log('POST >', urlWebService);
            return $http.post(urlWebService);
        };
        /**
        * 
        * ************************************* CLAIM STATUS   
        */
        memberDataService.GetClaimStatus = function (params) {
            var config = {
                params: params
            };
            var urlWebService = serviceBase + 'Provider/Portal/ClaimStatus';
            console.log('POST >', urlWebService, params);
            return $http.post(urlWebService, params);
        };




        /**
* 
* ************************************* CLAIM DETAILED   
*/
        memberDataService.PerepareHtmlData = function (htmlString) {
            //clean string data                              
            htmlString = htmlString.replace(/(\r\n|\n|\r|\t)/gm, '');
            htmlString = htmlString.replace(/ +(?= )/g, '');
            htmlString = htmlString.replace(/<!--(.*?)-->/gm, '');
            //grab CSS Link tags
            var htmlStringWithCss = '';
            $("link").each(function (key, value) {
                var templink = "<link href='" + value.href + "' rel='stylesheet'>";
                htmlStringWithCss += templink;
            });

            //append CSS Link tags to HtmlString
            htmlStringWithCss += htmlString;

            return htmlStringWithCss;
        };
        memberDataService.CreatePdfDownload = function (htmlString) {

            //Create Json Object to send 
            var htmlStringWithCss = memberDataService.PerepareHtmlData(htmlString);
            var paramObj = { "HtmlString": htmlStringWithCss };

            //send over the obj
            var urlWebService = serviceBase + 'Portal/ProviderForms/CreatePdfDownload'; //Service Method URL
            return $http.post(urlWebService, paramObj, { responseType: 'arraybuffer' });
        };
        memberDataService.GetPdfData = function (htmlString) {

            var htmlStringWithCss = memberDataService.PerepareHtmlData(htmlString);
            var paramObj = { "HtmlString": htmlStringWithCss, "UrlBase": null, "ConfirmationNumber": null };
            var urlWebService = serviceBase + 'Provider/Portal/ProviderForms/GetPdfData'; //Service Method URL
            return $http.post(urlWebService, paramObj, { responseType: 'arraybuffer' });
        };
        memberDataService.GetClaimDetail = function (params) {
            var urlWebService = serviceBase + 'Provider/Portal/ClaimDetail?claimNumber=' + params;
            console.log('POST >', urlWebService);
            return $http.post(urlWebService);
        };

        /** 
* ************************************* REMITTANCE ADVICE 
*/
        memberDataService.GetRemittanceAdvice = function (list, params) {

            var params = params || {};
            console.log(params);

            var urlWebService = serviceBase + 'Provider/Portal/RA/' + list;
            console.log('POST >', urlWebService, params);
            return $http.post(urlWebService, params);
        };
        /*************************************
		************** NCQA COURSES *****************
		*************************************/

        //Get Available Programs
        memberDataService.GetAvailableProgramsAndCourses = function (language, params) {
            return $http.get(serviceBase + '/HealthEd/Programs/All/?language=' + language);
        };

        //Get Requirements per Courses
        memberDataService.GetCourseRequirements = function (programId, courseId, language, params) {
            var config = {
                params: params
            };
            return $http.get(serviceBase + '/HealthEd/Program/Requirements/?programId= ' + programId + '&courseId=' + courseId + '&language=' + language); // serviceBase + '/AvailableCourses'); 
        };


        //Get Available Sections per Course
        memberDataService.GetAvailableSections = function (programId, courseId, language, params) {
            var config = {
                params: params
            };
            return $http.get(serviceBase + '/HealthEd/Sections?courseId=' + courseId + '&language=' + language);
        };


        //Get Options Per Program/Course/Section
        memberDataService.FetchCourseOptionsPerProgramCourseSection = function (programId, courseId, language, params) {
            var config = {
                params: params
            };
            return $http.get(serviceBase + '/HealthEd/Program/Options?programId=' + programId + '&courseId=' + courseId + '&language=' + language);
        };


        //Get Requested Course Sections 
        memberDataService.GetRequestedCourseSections = function (language, params) {
            var config = {
                params: params
            };
            return $http.get(serviceBase + '/HealthEd/RequestedCourses?language=' + language, params);
        };

        //Get Enrolled Course Sections 
        memberDataService.GetEnrolledCourseSections = function (language) {

            return $http.get(serviceBase + '/HealthEd/EnrolledCourses?language=' + language);
        };

        //Get Course History  
        memberDataService.GetCourseHistory = function (language) {
            return $http.get(serviceBase + '/HealthEd/CourseHistory?language=' + language);
        };

        //PP Get Temp Id Card  
        memberDataService.GetTempMemberIDCardImage = function (params) {
            var config = {
                params: params
            };
            //return $http.get('https://svc-dev.iehp.org/IEHPWebApi/IdCard/Download?side=' + side); //Binary?
            return $http.post(serviceBase + '/IdCard/DownloadBySubNo', params);
        };


        //Submit Course Request 
        memberDataService.SubmitCourseRequest = function (params) {
            var config = {
                params: params
            };
            return $http.post(serviceBase + '/HealthEd/SubmitApplication', params);

        };

        //Submit Cancellation 
        memberDataService.CancelSection = function (params) {
            var config = {
                params: params
            };
            return $http.post(serviceBase + '/HealthEd/CancelApplication', params);
            return $http.post(serviceBase + '/HealthEd/CancelApplication', params);

        };

        //------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------//

        //************* UPA Universal Prior Authorization ****************//

        memberDataService.GetDrugByGcnSequenceNumber = function (gcnSequenceNumber) {

            var urlWebService = serviceBase + 'Provider/Portal/UPA/GetDrugByGcnSequenceNumber?sequenceNumber=' + gcnSequenceNumber;
            return $http.post(urlWebService);
        };


        memberDataService.UpaGetMemberInformation = function (subscriberNumber) {

            var urlWebService = serviceBase + 'Provider/Portal/UPA/GetMemberInformation?subscriberNumber=' + subscriberNumber;
            return $http.get(urlWebService);
        };

        memberDataService.GetNdcPharamcy = function (paramObj) {

            var params = paramObj || {};
            var urlWebService = serviceBase + 'Provider/Portal/UPA/GetNdcPharmacies';
            return $http.post(urlWebService, params);
        };

        memberDataService.validateHcpcs = function (hcpcsCode) {

            var urlWebService = serviceBase + 'Provider/Portal/UPA/ValidateHcpcs?hcpcs=' + hcpcsCode;
            return $http.get(urlWebService);
        };


        memberDataService.searchDrugsHcpc = function (paramObj) {

            var params = paramObj || {};
            var urlWebService = serviceBase + 'Provider/Portal/UPA/SearchForHcpcs';
            return $http.post(urlWebService, params);
        };
        memberDataService.searchNdc = function (paramObj) {

            var params = paramObj || {};
            var urlWebService = serviceBase + 'Provider/Portal/UPA/SearchBrandNameOrGeneric';
            return $http.post(urlWebService, params);

        };
        memberDataService.GetSpecialtyPharmacies = function () {

            var urlWebService = serviceBase + 'Provider/Portal/UPA/GetSpecialtyPharmacies';
            return $http.get(urlWebService);

        };
        memberDataService.GetIcdCode = function (params) {

            var urlWebService = serviceBase + 'Provider/Portal/UPA/GetIcdCode';
            return $http.post(urlWebService, params);

        };
        memberDataService.GetCptCode = function (params) {

            var urlWebService = serviceBase + 'Provider/Portal/UPA/GetCptAndModifier';
            return $http.post(urlWebService, params);

        };

        //get dropdown
        memberDataService.GetSigDropDown = function () {
            var urlWebService = serviceBase + 'Provider/Portal/UPA/GetSigDropDown';
            return $http.get(urlWebService);
        };

        //get Pdf for viewing purposes
        memberDataService.GetPdf = function (recordId, confirmationNumber) {

            var urlWebService = serviceBase + 'Provider/Portal/UPA/GetDomForDisplay?formId=' + recordId + '&confNumber=' + confirmationNumber;
            return $http.post(urlWebService, {}, { responseType: 'arraybuffer' });
        };


        //SubmitForm
        memberDataService.UploadUPAForm = function (postObj) {


            var urlWebService = serviceBase + 'Provider/Portal/UPA/SaveUpaForm';
            return $http.post(urlWebService, postObj);

        };
        //*************************************************************************************//

        //------------------------------- FINANCE ----------------------------------------------
        //------------------------- Capitation Reports -----------------------------------------

        memberDataService.GetCapitationSummary = function () {

            var urlWebService = serviceBase + 'Provider/Portal/Capitation/Summary';
            return $http.post(urlWebService, {}, { responseType: 'arraybuffer' });
        };
        memberDataService.GetCapitationDetails = function () {

            var urlWebService = serviceBase + 'Provider/Portal/Capitation/Detail';
            return $http.post(urlWebService, {}, { responseType: 'arraybuffer' });
        };

        //***************************BehavioralHealth******************************************//
        //**************************Member Form History****************************************//

        memberDataService.FindMemberHistory = function (paramObj) {

            var params = paramObj || {};
            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/FindMemberHistory';
            return $http.post(urlWebService, params);

        };


        //get record from newer froms
        memberDataService.GetHtmlRecord = function (recordId) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/GenerateMemberHistoryRecord?recordId=' + recordId;
            return $http.post(urlWebService);

        };
        memberDataService.GetClassicHtmlRecord = function (paramObj) {


            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/GenerateMemberHistoryRecordClassical?recordNumber=' + paramObj.recordId
				+ '&formType=' + paramObj.formType
				+ '&subscriberNumber=' + paramObj.subscriberNumber;

            return $http.post(urlWebService);

        };

    	//**************************User Actions****************************************//
	    memberDataService.GetUserActions = function() {
	    	var urlWebService = serviceBase + 'Provider/Portal/GetUserActions?showEffectiveOnly=false';
	    	return $http.post( urlWebService );
	    };

        //**************************Shared BH Form Services****************************************//

        memberDataService.GetMemberRxHistory = function (memberId) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/GetMemberRxHistory?subscriberNumber=' + memberId;
            return $http.get(urlWebService);

        };
        memberDataService.GetMemberRxHistoryClaims = function (memberId) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/GetMemberRxHistoryClaims?subscriberNumber=' + memberId;
            return $http.get(urlWebService);

        };

        memberDataService.SearchIcdCode = function (params) {

            var urlWebService = serviceBase + 'Provider/Portal/ProviderForms/SearchIcdCode';
            return $http.post(urlWebService, params);

        };

        //**************************INIT PCP REFERRAL FORM****************************************//

        memberDataService.BhGetMemberInformation = function (subscriberNumber, dos) {
            var date = moment(dos).format('MM/DD/YYYY');
            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/GetMemberInformation?subscriberNumber=' + subscriberNumber
                                            + '&dos=' + date;
            return $http.post(urlWebService);
        };

        memberDataService.BhGetProivdersByTaxId = function (lob) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/InitGetProvidersByTaxId?lob=' + lob;
            return $http.get(urlWebService);

        };
        memberDataService.BhGetProviderInfromation = function (providerId) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/GetMemberProviderInformation?providerId=' + providerId;
            return $http.get(urlWebService);

        };

        memberDataService.BhGetProviderInfromationWithAltAddress = function (providerId, address1) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/GetMemberProviderInformationWithAltAddress?providerId=' + providerId + '&address=' + address1;
            return $http.get(urlWebService);

        };

        memberDataService.BhGetPdf = function (recordId, confirmationNumber) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/GetDomForDisplay?formId=' + recordId + '&confNumber=' + confirmationNumber;
            return $http.post(urlWebService, {
            }, { responseType: 'arraybuffer' });
        };

        //SubmitForm
        memberDataService.UploadBHINITForm = function (postObj) {
            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/SavePcpInitForm';
            return $http.post(urlWebService, postObj);

        };

        memberDataService.BhCheckMemberElig = function (postObj) {
            var urlWebService = serviceBase + 'Provider/Portal/ProviderForms/GetMembInfoAndCheckElig';
            return $http.post(urlWebService, postObj);

        };

        memberDataService.CheckMemberId = function (memberId) {

            var urlWebService = serviceBase + 'Provider/Portal/ProviderForms/CheckMemberId?memberId=' + memberId;
            return $http.get(urlWebService);

        };

        memberDataService.CheckMemberSsn = function (memberSsn) {

            var urlWebService = serviceBase + 'Provider/Portal/ProviderForms/CheckMemberSsn?memberSsn=' + memberSsn;
            return $http.get(urlWebService);

        };

        memberDataService.CheckMemberCin = function (memberCin) {

            var urlWebService = serviceBase + 'Provider/Portal/ProviderForms/CheckMemberCin?memberCin=' + memberCin;
            return $http.get(urlWebService);

        };
        //**************************INIT COC EVAL FROM    ****************************************//
        memberDataService.CocCheckAuthorization = function (postObj) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/CheckAuthorization';
            return $http.post(urlWebService, postObj);
        };

        memberDataService.BhGetProivdersByTaxIdCoc = function (lob) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/CocGetProviderListByTaxId';
            return $http.get(urlWebService);

        };
        memberDataService.BhGetRequestingAndPcpInfo = function (postObj) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/GetRequestingAndPcpInfo';
            return $http.post(urlWebService,postObj);

        };
        memberDataService.BhCocBroadSearchForProviders = function (searchString) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/CocBroadSearchForProviders?searchString=' + searchString ;
            return $http.get(urlWebService);

        };

        memberDataService.GetMentalHealthCodes = function (date) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/CocMentalHealthIcdCodes?currentDate=' + date;
            return $http.get(urlWebService);

        };
        memberDataService.GetDevelopmentalCodes = function (date) {

            var urlWebService = serviceBase + 'Provider/Portal/BehavioralHealth/CocGetDevelopmentalCodes?currentDate=' + date;
            return $http.get(urlWebService);

        };


        //get record from older forms
        /*************************************
		************* Demographics ****************
		*************************************/

        //Get Demographics
        memberDataService.GetDemographics = function () {
            return $http.get(serviceBase + 'Member/Demographics/Get');
        };
        //Update
        memberDataService.UpdateDemographics = function (params) {
            return $http.post(serviceBase + 'Member/Demographics/Update', params);
        };


        //***********************************AUTISM FORM****************************************//
        memberDataService.GetMemberInfoFromAutismAuth = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/BehavioralHealth/Autism/AuthorizationValidation', params);
        };

        memberDataService.SubmitAutismForm = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/BehavioralHealth/Autism/FormSubmit', params);
        };

        memberDataService.GetAutismMaladaptiveHistory = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/BehavioralHealth/Autism/MaladaptiveHistory', params);
        };

    
        //------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------//


        /*************************************
		*********** New Id Card **************
		*************************************/

        //Get
        memberDataService.GetCurrentIdCardRequests = function () {
            return $http.get(serviceBase + 'IdCard/Member/Get');
        };
        //Add
        memberDataService.SubmitNewIdCardRequest = function () {
            return $http.put(serviceBase + 'IdCard/Member/Add');
        };

        //Delete
        memberDataService.DeleteIdCardRequest = function (id) {
            var config = {
                params: { id: id }
            };
            return $http.put(serviceBase + 'IdCard/Member/Delete', null, config); //JCAST /Delete 3.18.2015 to /Put
        };

        //------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------//
        /*************************************
************* Sub User Accounts ****************
*************************************/
        memberDataService.GetSubAccounts = function () {

            var urlWebService = serviceBase + 'Provider/Portal/GetSubAccounts';
            console.log('POST >', urlWebService);
            return $http.post(urlWebService);
        };

        memberDataService.AddSubAccount = function (params) {

            var urlWebService = serviceBase + 'Provider/Portal/AddSubAccount';
            console.log('POST >', urlWebService, params);
            return $http.post(urlWebService, params);
        };

        memberDataService.UpdateSubAccount = function (params) {

            var urlWebService = serviceBase + 'Provider/Portal/UpdateSubAccount';
            console.log('POST >', urlWebService, params);
            return $http.post(urlWebService, params);
        };
        /*************************************
		************* Utility ****************
		*************************************/
        memberDataService.utility = {};


        //Determine Primary Elig Record
        memberDataService.utility.getPrimaryEligibilityRecord = function (eligArray) {
            //If there is only one elig record, just use that.
            if (eligArray.length < 2) {
                return eligArray[0];
            } else {
                //sort by persno (asceding), then loop over and pick first active record
                eligArray = eligArray.sort(function (a, b) { return a.PersonNumber.localeCompare(b.PersonNumber); });
                for (var i = 0; i < eligArray.length; i++) {
                    if (eligArray[i].EligibilityStatusCode == 'A') {
                        return eligArray[i];
                    }
                }
            }
        };


        memberDataService.utility.DetermineAuthStatus = function (item) {
            var type = item.authType == 0 ? 'Medical' :
									item.authType == 1 ? 'Pharmacy' : //Rx
									item.authType == 2 ? 'Vision' : '';

            var status = '';

            if (type == 'Medical') {
                //Medical
                status = item.reviewDecision || item.eventStatus;
                status = status != 'In Progress' && status != 'Approved' ? 'See PCP' : status; //Obfuscates un-favorable status.
            } else if (type == 'Pharmacy') {
                //Vision
                status = item.eventStatus;
                status = status != 'Approved' ? 'See PCP' : status; //Obfuscates un-favorable status.
            } else if (type == 'Vision') {
                //Vision
                status = item.eventStatus;
                status = status != 'Approved' ? 'See PCP' : status; //Obfuscates un-favorable status.
            }
            return status;
        };

        //------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------//

        ///*************************************
        //************* Care Plans****************
        //*************************************/
        ////Get care plan Providers
        //memberDataService.GetCarePlanProviders = function (params) {
        //    return $http.post(serviceBase + 'Provider/Portal/Roster/CarePlan/TaxId/Providers', params);
        //};

        ////Get care plan Providers' memebers list
        //memberDataService.GetCarePlanProviderMembersList = function (params) {
        //    return $http.post(serviceBase + 'Provider/Portal/Roster/CarePlan/Providers/MembersList', params);
        //};

        //Get care plans
        memberDataService.GetCarePlanHar = function (params) {

            return $http.get(serviceBase + 'Provider/Portal/Shared/CarePlan/Har?fileReference=' + params, { responseType: 'arraybuffer' });
        };
        //memberDataService.GetCarePlanMH = function (params) {
        //    return $http.get(serviceBase + 'Provider/Portal/Shared/CarePlan/MedHok?fileReference=' + params);
        //};
        //------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------//
        /*************************************
			************* Member Health Records**
			*************************************/
        //Get MemberDemographics
        memberDataService.GetMemberDemographics = function (params) {
            return $http.get(serviceBase + 'Provider/Portal/Encounters/MemberDemographics?MemberId=' + params);
        };

        //Get MemberImmunizations
        memberDataService.GetMemberImmunizations = function (params) {
            return $http.get(serviceBase + 'Provider/Portal/Encounters/MemberImmunizations?SubscriberNumber=' + params);
        };

        //Get MemberLabs
        memberDataService.GetMemberLabs = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/Encounters/MemberLabsDetailGrouped', params);
        };

        //Get MemberRX
        memberDataService.GetMemberRx = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/Encounters/MemberRX', params);
        };

        //Get MemberVisits
        memberDataService.GetMemberVisits = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/Encounters/MemberVisits', params);
        };

        //Get MemberAlerts
        memberDataService.GetMemberAlerts = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/Encounters/MemberAlerts', params);
        };

        //------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------//
        /*************************************
         ************* Census Report**
         *************************************/
        memberDataService.GetHospitalCensusReport = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/Census/CensusList', params);
        }
        //memberDataService.GetAuthsCensusReport = function (params) {
        //    return $http.post(serviceBase + 'Provider/Portal/Census/CensusDetailList', params);
        //}
        memberDataService.GetDiagnosisList = function (params) {
            return $http.get(serviceBase + 'Provider/Portal/Census/CensusDiagnosisList?AuthNumber=' + params);
        }
        //------------------------------------------------------------------------------//
        /*************************************
		*********** UserAccountInfo **************
		*************************************/
        memberDataService.GetUserAccountInfo = function (params) {
            return $http.post(serviceBase + 'api/SubAccounts/UserInfo', params);
        };
        //------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------//
        memberDataService.broadcastResults = function () {
            $rootScope.$broadcast('resultsUpdated');
        };


        /********************************************************************************
					Authorization Status & Request
			********************************************************************************/

        memberDataService.SearchAuthorizations = function (params) {

            /*
				{
					"beginDate": "2016-03-02T11:15:11.1167513-08:00",
					"endDate": "2016-03-02T11:15:11.1177514-08:00",
					"anyProviderId": "sample string 1",
					"anyProviderTaxId": "sample string 2",
					"requestingProviderId": "sample string 3",
					"requestingProviderTaxId": "sample string 4",
					"servicingProviderId": "sample string 5",
					"servicingProviderTaxId": "sample string 6",
					"facilityProviderId": "sample string 7",
					"facilityProviderTaxId": "sample string 8",
					"memberPcpId": "sample string 9",
					"memberPcpTaxId": "sample string 10",
					"category": "sample string 11",
					"status": "sample string 12",
					"statusReason": "sample string 13",
					"authorizationNumber": "sample string 14",
					"authRequestType": "sample string 15",
					"subscriberNumber": 1,
					"priority": "sample string 16",
					"inpatientOnly": true
				}  
				*/


            return $http.post(serviceBase + 'Provider/Portal/Authorizations/Search', params);
        };

        memberDataService.GetRequestingServiceList = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/eAuth/eAuthRetrieveSpecialties', params);
        };
        memberDataService.GetServiceList = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/eAuth/eAuthRetrieveServiceTypes', params);
        };
        memberDataService.GetRequestingProviderList = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/eAuth/eAuthRetrieveProviderListAll', params);
        };
        memberDataService.GetRequestingProviderAddrList = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/eAuth/eAuthRetrieveProviderListDetail', params);
        };
        memberDataService.GetMemberData = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/EAuth/EAuthRetrieveMember', params);
        };
        memberDataService.GetReferredToServiceProviders = function (params) {
            return $http.get(serviceBase + 'Provider/Portal/eAuth/eAuthRetrieveProvider?ProviderNumber=' + params);
        };
        memberDataService.GetReferringProviderInfo = function (params) {
            return $http.get(serviceBase + 'Provider/Portal/eAuth/eAuthRetrieveProvider?ProviderNumber=' + params);
        };
        memberDataService.ValidateIcdCode = function (params) {
            return $http.get(serviceBase + 'Provider/Portal/eAuth/eAuthICDCodeValidate?icdCode=' + params.icdCode + '&serviceDate=' + params.serviceDate);
        };
        memberDataService.GetReferredToProviderInfo = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/EAuth/EAuthRetrieveSpecialistList', params);
        };
        memberDataService.ValidateCPTCode = function (params) {
            return $http.get(serviceBase + 'Provider/Portal/eAuth/eAuthRetrieveProcedureByCode?ProcedureCode=' + params);
        };
        memberDataService.RetrieveFacility = function (params) {
            return $http.get(serviceBase + 'Provider/Portal/EAuth/EAuthRetrieveFacilityByproviderNumber?providerNumber=' + params);
        };
        memberDataService.RetrieveOutpatientServicecFacility = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/EAuth/EAuthRetrieveOutpatientHospitals', params);
        };
        memberDataService.RetrieveInpatientServicecFacility = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/EAuth/EAuthRetrieveIehpAffiliatedHospitals', params);
        };
        memberDataService.RetrieveAmbulatorySurgeryCenters = function (params) {
            return $http.post(serviceBase + 'Provider/Portal/EAuth/EAuthRetrieveAmbulatorySurgeryCenters', params);
        };
        memberDataService.ValidateModCode = function (params) {
            return $http.get(serviceBase + 'Provider/Portal/EAuth/EAuthRetrieveProcedureModifier?procedureModifierCode=' + params);
        };
        //------------------------------------------------------------------------------//
        //------------------------------------------------------------------------------//


        return memberDataService;

    }

})();