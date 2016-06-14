(function() {
	'use strict';

	var urlBase = $('meta[name="ApplicationRoot"]').attr('content'),
			cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

	//use this helper function to minimize repeated code in the routes
	function url(url) {
		return urlBase + url + cacheBust;
	}

	angular
		.module('MemberPortal')
		.config(stateConfig);

	stateConfig.$inject = ['$stateProvider', '$locationProvider', '$httpProvider', '$urlRouterProvider'];

	function stateConfig($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) {

		//Configure for html5 routing
		$locationProvider.html5Mode(true);

		//Wires in the interceptor service that injects the bearer token to all request if available.
		$httpProvider.interceptors.push('dataInterceptorService');

		//Make requests as Ajax Requests, allows the Request.IsAjaxRequest == true //Turned  off because it interfied with cors requests...
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

		$urlRouterProvider.otherwise('/');
		$urlRouterProvider.rule(function($injector, $location) {
		    

			//what this function returns will be set as the $location.url
		    var path = $location.path();

            //Detect if the path contians a trialing slash
		    var hasTrailingSlash = path[path.length - 1] === '/';
		    if (hasTrailingSlash) {
		        //if last charcter is a slash, remove it
		        path = path.substr(0, path.length - 1);
		    }

		    var normalized = path.toLowerCase();
			if (path != normalized || hasTrailingSlash) {
				//instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
				$location.replace().path(normalized);
			}
			// because we've returned nothing, no state change occurs
		});


		$stateProvider
			.state('home', {
				url: '/',
				views: {
					'': { templateUrl: url('/App/layout/two-column-wide-right.html') },
					'content@home': { templateUrl: url('/app/home/home.html') },
					'navigation@home': { template: '<div left-navigation></div>' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'HOME' } }]
				}
			})
			//================ ACCOUNT =============//
			.state('login', {
				url: '/account/login?authString&referral',
				views: {
					'': { templateUrl: url('/App/layout/single-column-transparent.html') },
					'content@login': { templateUrl: url('/App/account/login-page.html'), controller: 'loginPageController' }
				}
			})
			//================ AUTHORIZATIONS =============//
			.state('authorizations', {
				url: '/authorizations',
				views: {
					'': { templateUrl: url('/App/layout/two-column-wide-right.html') },
					'navigation@authorizations': { template: '<div left-navigation></div>' },
					'content@authorizations': { templateUrl: url('/app/authorizations/authorization-status.html') }
				},
				abstract: true,
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'AUTR' } }]
				}
			})
			.state('authorizations.status', {
				url: '/status',
				views: {
				    'content@authorizations': { templateUrl: url('/app/authorizations/authorization-status.html'), controller: 'AuthorizationStatusController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'AUTR.STAT' } }]
				}
			})
            .state('authorizations.request', {
                url: '/request',
                views: {
                    'content@authorizations': { templateUrl: url('/app/authorizations/request/authorization-request.html'), controller: 'AuthorizationRequestController' }
                },
                resolve: {
	                permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'AUTR.REQ' } }]
                }
            })
			//.state('authorizations.request', {
			//	url: '/request',
			//	controller: function() {},
			//	templateUrl: url('/html/authorizations/AuthorizationsHome.html'),
			//	resolve: {
			//		permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
			//		params: [function() { return { 'CGC': 'AUTH' } }]
			//	}
			//})
			//=========== URGENT CARE LIST   ==========// 
			.state('urgentcarelistPartial', {
				url: '^/urgentcarelist',
				views: {
					//'': { templateUrl: urlBase + '/html/DefaultLayout.html' + cacheBust, controller: 'UrgentCareListController' },
					'': { templateUrl: 'html/UrgentCareList/default.html' + cacheBust, controller: 'UrgentCareListController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'UCL' } }]
					//      contAuthServE: ['contentAuthorizationService', '$http', '$stateParams', function (contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ELIG'); }]
				}
			})
            //=========== DOFR ==========//
            .state('dofr', {
                url: '/dofr',
                views: {
                    '': { templateUrl: url('/App/layout/two-column-wide-right.html') },
                    'navigation@dofr': { template: '<div left-navigation></div>' },
                    'content@dofr': { templateUrl: url('/App/dofr/views/dofr.html'), controller: 'dofrController' }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'NAV.DOFR' } }]
                }

            })

			//=========== ELIGIBILITY ==========//
			.state('eligibility', {
				url: '/eligibility',
				views: {
					'': { templateUrl: url('/App/layout/two-column-wide-right.html') },
					'content@eligibility': { templateUrl: url('/app/components/eligibility/Eligibility.html'), controller: 'EligibilityController' },
					'navigation@eligibility': { template: '<div left-navigation></div>' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'ELIG' } }]
				}
			})
			.state('eligibility.searchresults', {
				url: '/search-results',
				params: { JSONObject: null },
				views: {
					'@eligibility': { templateUrl: url('/app/components/eligibility/EligibilitySearchResults.html'), controller: 'EligibilitySearchResultsController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'ELIG', 'SearchType': '', 'JSONObject': {} } }]
				}
			})

            //=================Member Health Records ====================//
			.state('memberHealthRecord', {
			    url: '/memberhealthrecord?iehpId=',
                params: {
				   iehpID: null
				},
			    views: {
			        '': { templateUrl: url('/App/components/MemberHealthRecord/MemberHealthRecord.html'), controller: 'MemberHealthRecordController' }
			    },
			    resolve: {
			        permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
			        contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function (contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('MHR'); }],
			        params: [function () { return { 'CGC': 'MHR', "StateView": 'Main' } }]
			    }
			})
			//===========Census Report ==========//
			.state('censusreport', {
				url: '/census-report',
				views: {
					'': { templateUrl: url('/App/layout/two-column-wide-right.html') },
					'navigation@censusreport': { template: '<div left-navigation></div>' },
					'content@censusreport': { templateUrl: url('/App/components/CensusReport/CensusReport.html'), controller: 'CensusReportController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'CEN' } }]
				}
			})
			//========== FINANCE ===========//
			.state('finance', {
				url: '/finance',
				views: {
					'': { templateUrl: url('/App/layout/two-column-wide-right.html') },
					'navigation@finance': { template: '<div left-navigation></div>' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'FIN' } }]
				}
			})
			.state('finance.index', {
				url: '/index',
				views: {
					'content@finance': { templateUrl: url('/html/Finance/landing-page.html') }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'FIN' } }]
				}
			})
			.state('finance.capitation', {
				url: '/capitation-reports',
				views: {
					'content@finance': { templateUrl: url('/app/finance/capitation-reports.html'), controller: 'CapitationReportsController' }
				},
				resolve: {
	                permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'FIN.CAP' } }]
				}
			})
			.state('finance.remittance', {
				url: '/remittance-advice',
				views: {
	                'content@finance': { templateUrl: url('/app/finance/claims-ra.html'), controller: 'ClaimsRAController' }
				},
				resolve: {
	                permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'FIN.REM' } }]
				}
			})
			//============== PHARMACY =========//
			.state('pharmacy', {
				url: '/pharmacy',
				views: {
					'': { templateUrl: url('/App/layout/two-column-wide-right.html'), controller: 'HomeController' },
					'content@pharmacy': { templateUrl: url('/html/PharmacyHome.html') },
					'navigation@pharmacy': { template: '<div left-navigation></div>' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'RX' } }]
				}
			})
            .state('pharmacy.DIR', {
                url: '/update-your-directory',
                views: {
                    'content@pharmacy': { templateUrl: url('/app/pharmacy/Views/UpdateYourDirectory.html'), controller: 'pharmController' }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'RX' } }]
                }
            })
             .state('pharmacy.PER', {
                 url: '/per-status',
                 views: {
                     'content@pharmacy': { templateUrl: url('/app/pharmacy/Views/PERStatus.html'), controller: 'pharmController' }
                 },
                 resolve: {
                     permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                     params: [function () { return { 'CGC': 'RX' } }]
                 }
             })
			.state('pharmacy.UPA', {
				url: '/universal-pharmacy-authorization',
				views: {
					'content@pharmacy': { templateUrl: url('/html/UniversalPriorAuthorization.html') },
					controller: 'InitializeUpaController'
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'RX.UPA' } }]
				}
			})
			.state('pharmacy.FRMLY', {
				url: '/formulary',
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'RX' } }]
				}
			})
			.state('pharmacy.FRMLY.MDCAL', {
				url: '/medi-cal',
				views: {
					'content@pharmacy': { templateUrl: url('/html/Medi-Cal_HealthyKids_Formulary.html'), controller: '' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'RX' } }]
				}
			})
			.state('pharmacy.FRMLY.CMC', {
				url: '/cmc',
				views: {
					'content@pharmacy': { templateUrl: url('/html/CMC.html') }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'RX' } }]
				}
			})
            
			//========== CLAIMS ==========//
			.state('claims', {
				url: '/claims',
				views: {
					'': { templateUrl: url('/App/layout/two-column-wide-right.html') },
					'navigation@claims': { template: '<div left-navigation></div>' },
					'content@claims': { template: '<h1>Claims and Ra\'s</h1>' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'CLARA' } }]
				}
			})
			.state('claims.status', {
				url: '/status',
				views: {
					'content@claims': { templateUrl: url('/App/claims/claims-status.html'), controller: 'ClaimsStatusController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'CLARA.STAT' } }]
				}
			})
//			.state('claims.ra', {
//				url: '/remittance-advice',
//				views: {
//					'content@claims': { templateUrl: url('/app/finance/claims-ra.html'), controller: 'ClaimsRAController' }
//				},
//				resolve: {
//					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
//					params: [function() { return { 'CGC': 'CLARA.RA' } }]
//				}
//			})
			.state('claims.p4pra', {
				params: { 'CGC': 'CLARA.P4PRA' },
				url: '/p4p-remittance-advice',
				views: {
					'content@claims': { templateUrl: url('/app/claims/p4p-ra.html'), controller: 'P4PRAController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'CLARA.P4PRA' } }]
				}
			})
			.state('claims.raDetails', {
				url: '/details?list&claimId&date',
				views: {
	                '': { templateUrl: url('/App/layout/single-column.html') },
	                'content@claims': { templateUrl: url('/app/remittance-advice/detail/ra-detail.html'), controller: 'RaDetailController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'CLARA.DET' } }]
				}
	        })
			//========== BEHAVIORAL HEALTH ==========//
			.state('bh', {
				url: '/behavioral-health',
				views: {
					'': { templateUrl: url('/App/layout/two-column-wide-right.html') },
	                'content@bh': { templateUrl: url('/html/BehavioralHealthHome.html') },
					'navigation@bh': { template: '<div left-navigation></div>' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'BEH' } }]
	            }
			})
			.state('bh.pcp', {
				url: '/pcp-init',
				views: {
					'content@bh': {
					    templateUrl: url('app/behavioralhealth/forms/initPcp/BHInitialPcpReferral.html'),
				        controller: 'InitializeBhController'
				    } 
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'BEH.INIT' } }]
				}
			})
			.state('bh.coc', {
				url: '/coodination-of-care',
				views: {
					'content@bh': {
					    templateUrl: url('/app/behavioralhealth/forms/initialCoc/BHInitialCoc.html'),
				         controller: 'InitializeBhController'
					}
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'BEH.COC' } }]
				}
			})
			.state('bh.autism', {
				url: '/autism-form',
				views: {
					'content@bh': {
					    templateUrl: url('/app/behavioralhealth/forms/autism/autism-form.html'),
					    controller: 'AutismMemberVerificationController'
					}
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'BEH.AUT' } }]
				}
			})
            .state('bh.claims', {
                url: '/claims-submission',
                views: {
                    'content@bh': {
                        templateUrl: url('/app/behavioralhealth/views/claimsSubmission.html'),
                        controller: 'bhController'
                    }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'BEH.CLA' } }]
                }
            })
            .state('bh.memberhistory', {
                url: '/member-history',
                views: {
                    'content@bh': {
                        templateUrl: url('/app/behavioralhealth/forms/memberHistory/BHMemberHistoryViewer.html'),
                        controller: 'MemberHistoryController'
                    }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'BEH.MEH' } }]
                }
            })
            .state('bh.promis', {
                url: '/promis-survey',
                views: {
                    'content@bh': { template: '<new-survey survey-id="34"></new-survey>'}
                },
                params: { 'surveyId': '5678' }
            })
            //========== HOSPITAL ==========//
               	.state('hospital', {
               	    url: '/hospital',
               	    views: {
               	        '': { templateUrl: url('/App/layout/two-column-wide-right.html') },
               	        'navigation@hospital': { template: '<div left-navigation></div>' }
               	        //   ,
               	        //   'content@P4P': { templateUrl: url('/App/P4P/Views/default.html'), controller: 'P4PController' }
               	    },
               	    //resolve: {
               	    //    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
               	    //    params: [function () { return { 'CGC': 'ROST' } }]
               	    //}
               	})
            	.state('hospital.nia', {
            	    url: '/nia-radiology',
            	    views: {
            	        'content@hospital': { templateUrl: url('/app/hospital/Views/nia.html'), controller: 'hospitalController' }
            	    },
            	    //    resolve: {
            	    //        permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
            	    //        params: [function () { return { 'CGC': 'FIN.REM' } }]
            	    //    }
            	})

			//================ ENCOUNTER =================//
			.state('encounter', {
				url: '/encounter',
				views: {
					'': { templateUrl: url('/App/layout/two-column-wide-right.html') },
					'navigation@encounter': { template: '<div left-navigation></div>' },
					'content@encounter': { templateUrl: url('/App/encounter/Encounter.html'), controller: 'EncounterController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'ENC' } }]
				}

			})

            //================ P4P =================//

            //============ P4P ENTRY
			.state('P4P', {
			    url: '/p4p',
			    views: {
			        '': { templateUrl: url('/App/layout/two-column-wide-right.html') },
			        'navigation@P4P': { template: '<div left-navigation-p4p></div>' },
			        'content@P4P': { templateUrl: url('/App/P4P/Views/default.html'), controller: 'P4PController' }
			    },
			    //resolve: {
			    //    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
			    //    params: [function () { return { 'CGC': 'ROST' } }]
			    //}
			})
		    .state('P4P.Entry', {
		        url: '/entry' //,
		        //views: {
		        //    'content@p4p': { templateUrl: 'app/P4P/Views/Entry.html' + cacheBust }
		        //},
		        //resolve: {
		        //    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
		        //    params: [function () { return { 'CGC': 'ROST.HM' } }],
		        //    contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function (contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.HM'); }]
		        //}
		    })
               .state('P4P.Status', {
                   url: '/status' //,
                   //views: {
                   //    'content@p4p': { templateUrl: 'app/P4P/Views/Entry.html' + cacheBust }
                   //},
                   //resolve: {
                   //    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                   //    params: [function () { return { 'CGC': 'ROST.HM' } }],
                   //    contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function (contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.HM'); }]
                   //}
               })
			.state('P4P.Entry.DCAV', {
			    url: '/dcav_entry',
			    views: {
			        'content@P4P': { templateUrl: url('/app/P4P/Views/EntryDualChoiceAnnualVisit.html'), controller: 'P4PController' }
			    },
			    resolve: {
			        permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
			        params: [function () { return { 'CGC': 'ROST.AR' } }]
			    }
			})
			.state('P4P.Entry.PM160', {
			    url: '/pm160_entry',
			    views: {
			        'content@P4P': { templateUrl: url('/app/P4P/Views/EntryPM160.html'), controller: 'P4PController' }
			    },
			    resolve: {
			        permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
			        params: [function () { return { 'CGC': 'ROST.AR' } }]
			    }
			})
            .state('P4P.Entry.YC', {
                url: '/yellowcard_entry',
                views: {
                    'content@P4P': { templateUrl: url('/app/P4P/Views/EntryYellowCard.html'), controller: 'P4PController' }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'ROST.AR' } }]
                }
            })
             .state('P4P.Entry.DIAB', {
                 url: '/diabetes_entry',
                 views: {
                     'content@P4P': { templateUrl: url('/app/P4P/Views/EntryDiabetes.html'), controller: 'P4PController' }
                 },
                 resolve: {
                     permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                     params: [function () { return { 'CGC': 'ROST.AR' } }]
                 }
             })
            .state('P4P.Entry.PS', {
                url: '/papscreen_entry',
                views: {
                    'content@P4P': { templateUrl: url('/app/P4P/Views/EntryPapScreen.html'), controller: 'P4PController' }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'ROST.AR' } }]
                }
            })
        
            .state('P4P.Entry.PP', {
                url: '/peripost_entry',
                views: {
                    'content@P4P': { templateUrl: url('/app/P4P/Views/EntryPerinatalPostpartum.html'), controller: 'P4PController' }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'ROST.AR' } }]
                }
            })
            .state('P4P.Entry.AP', {
                url: '/asthma_entry',
                views: {
                    'content@P4P': { templateUrl: url('/app/P4P/Views/EntryAsthmaProgram.html'), controller: 'P4PController' }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'ROST.AR' } }]
                }
            })

            //=============== P4P STATUS
               .state('P4P.Status.DCAV', {
                   url: '/dcav_status',
                   views: {
                       'content@P4P': { templateUrl: url('/app/P4P/Views/StatusDualChoice.html'), controller: 'P4PController' }
                   },
                   resolve: {
                       permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                       params: [function () { return { 'CGC': 'ROST.AR' } }]
                   }
               })
             .state('P4P.Status.PM160', {
                 url: '/pm160_status',
                 views: {
                     'content@P4P': { templateUrl: url('/app/P4P/Views/StatusPM160.html'), controller: 'P4PController' }
                 },
                 resolve: {
                     permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                     params: [function () { return { 'CGC': 'ROST.AR' } }]
                 }
             })
             .state('P4P.Status.PS', {
                 url: '/papscreen_status',
                 views: {
                     'content@P4P': { templateUrl: url('/app/P4P/Views/StatusPapScreen.html'), controller: 'P4PController' }
                 },
                 resolve: {
                     permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                     params: [function () { return { 'CGC': 'ROST.AR' } }]
                 }
             })
             .state('P4P.Status.YC', {
                 url: '/yellowcard_status',
                 views: {
                     'content@P4P': { templateUrl: url('/app/P4P/Views/StatusYellowCard.html'), controller: 'P4PController' }
                 },
                 resolve: {
                     permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                     params: [function () { return { 'CGC': 'ROST.AR' } }]
                 }
             })
             .state('P4P.Status.DIAB', {
                 url: '/diabetes_status',
                 views: {
                     'content@P4P': { templateUrl: url('/app/P4P/Views/StatusDiabetes.html'), controller: 'P4PController' }
                 },
                 resolve: {
                     permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                     params: [function () { return { 'CGC': 'ROST.AR' } }]
                 }
             })
             .state('P4P.Status.PP', {
                 url: '/pap_status',
                 views: {
                     'content@P4P': { templateUrl: url('/app/P4P/Views/StatusPapScreen.html'), controller: 'P4PController' }
                 },
                 resolve: {
                     permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                     params: [function () { return { 'CGC': 'ROST.AR' } }]
                 }
             })
             .state('P4P.Status.AP', {
                 url: '/asthma_status',
                 views: {
                     'content@P4P': { templateUrl: url('/app/P4P/Views/StatusAsthmaProgram.html'), controller: 'P4PController' }
                 },
                 resolve: {
                     permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                     params: [function () { return { 'CGC': 'ROST.AR' } }]
                 }
             })
      

            //================ HEALTH EDUCATION =================//
            .state('healthEducation', {
                url: '/health-education',
                views: {
                    '': { templateUrl: url('/App/layout/two-column-wide-right.html') },
                    'navigation@healthEducation': { template: '<div left-navigation></div>' }
                    //   ,
                 //   'content@P4P': { templateUrl: url('/App/P4P/Views/default.html'), controller: 'P4PController' }
                },
                //resolve: {
                //    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                //    params: [function () { return { 'CGC': 'ROST' } }]
                //}
            })
            .state('healthEducation.referrals', {
                url: '/referrals',
                views: {
                    'content@healthEducation': { templateUrl: url('/app/healthEducation/Views/Referrals.html'), controller: 'healthEducationController' }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'NAV.REF' } }]
                }
            })
            .state('healthEducation.referralstatus', {
                url: '/status',
                views: {
                    'content@healthEducation': { templateUrl: url('/app/healthEducation/Views/Status.html'), controller: 'healthEducationController' }
                },
                    resolve: {
                        permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                        params: [function () { return { 'CGC': 'NAV.REFSTAT' } }]
                    }
            })

			//================ ROSTERS =================//
			.state('rosters', {
				url: '/rosters',
				views: {
					'': { templateUrl: url('/App/layout/two-column-wide-right.html') },
					'navigation@rosters': { template: '<div left-navigation-rosters></div>' },
				    'content@rosters': { templateUrl: url('/App/components/Rosters/Views/RosterHome.html'), controller: 'RosterController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'ROST' } }]
				}
			})
            	.state('rosters.AL', {
            	    url: '/admitterslist',
            	    views: {
            	        'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterIPAAdmitters.html'), controller: 'P4PController' }
            	    },
            	    resolve: {
            	        permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
            	        params: [function () { return { 'CGC': 'ROST.AR' } }]
            	    }
            	})
			.state('rosters.AR', {
				url: '/assigned', 
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterAssigned.html'), controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'ROST.AR' } }]
				}
			})
			.state('rosters.CCS', {
				url: '/ccs',
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterCCS.html'), controller: 'RosterPartialViewController' }

				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.CCS' } }],
					contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.CCS'); }]
				}
			})
			.state('rosters.CCMPR', {
				url: '/ccmpr',
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterCCMPlanReferrals.html'), controller: 'RosterController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.CCMPR' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.CCMPR'); }]
				}
			})
            .state('rosters.CCMPT', {
                url: '/ccmpt',
                views: {
                    'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterCCMPlanTransfer.html'), controller: 'RosterController' }
                },
                resolve: {
	                permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.CCMPT' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.CCMPT'); }]
                }
            })
			.state('rosters.IHA', {
				url: '/initial-health-assessment',
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterInitialHealthAssessment.html'), controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
					params: [function() { return { 'CGC': 'ROST.IHA' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.IHA'); }]
				}
			})
			.state('rosters.DA', {
				url: '/direct-ancillary',
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterDirectAncillary.html'), controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.DA' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.DA'); }]
				}
			})
			.state('rosters.DS', {
				url: '/direct-specialty',
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterDirectSpecialty.html'), controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.DS' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.DS'); }]

				}
			})
			.state('rosters.ESR', {
				url: '/early-start',
				views: {
					'content@rosters': { templateUrl: 'app/components/rosters/views/RosterEarlyStartRoster.html' + cacheBust, controller: 'RosterController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.EA' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.EA'); }]
				}
			})
			.state('rosters.HCC', {
				url: '/hcc',
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterHCC.html'), controller: 'RosterController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.HCC' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.HCC'); }]
				}
			})
			.state('rosters.MCR', {
				url: '/mcr',
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterMCR.html'), controller: 'RosterController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.MCR', "StateView": 'Partial' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.MCR'); }]
				}
			})
			.state('rosters.ED', {
				url: '/encounter-data',
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterEncounterData.html'), controller: 'RosterController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.ED' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.ED'); }]
				}
			})
			.state('rosters.NA', {
				url: '/na',
				views: {
					'content@rosters': { templateUrl: 'app/components/rosters/views/RosterNurseAdviseLine.html' + cacheBust, controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.NA' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.NA'); }]
				}
			})
			//================ ROSTERS - PREVENTATIVE CARE =================//
			.state('rosters.PC', {
				url: '/preventative-care', 
				views: {
					'content@rosters': { templateUrl: 'app/components/rosters/views/RosterPreventiveCare.html' + cacheBust, controller: 'RosterController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.PC' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.PC'); }]
				}
			})
			.state('rosters.PC.CI', {
				url: '/childhood-immunizations',
				views: {
	                'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterPC_ChildhoodImmunizations.html' + cacheBust), controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.PC.CI' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.PC.CI'); }]
				}
			})
			.state('rosters.PC.WC015', {
				url: '/well-care-0-15-months',
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterPC_WellCare015.html' + cacheBust), controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.PC.WC015' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.PC.WC015'); }]
				}
			})
			.state('rosters.PC.WC36', {
				url: '/well-care-3-6-years',
				views: {
					'content@rosters': { templateUrl: '/app/components/rosters/views/RosterPC_WellCare36.html' + cacheBust, controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.PC.WC36' } }],
					contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.PC.WC36'); }]
				}
			})
			.state('rosters.PC.WCA', {
				url: '/well-care-adolescent',
				views: {
					'content@rosters': { templateUrl: '/app/components/rosters/views/RosterPC_WellCareAdolescent.html' + cacheBust, controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.PC.WCA' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.PC.WCA'); }]
				}
			})
			.state('rosters.PC.BC', {
				url: '/breast-cancer',
				views: {
					'content@rosters': { templateUrl: '/app/components/rosters/views/RosterPC_BreastCancer.html' + cacheBust, controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.PC.BC' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.PC.BC'); }]
				}
			})
			.state('rosters.PC.CC', {
				url: '/cervical-cancer',
				views: {
					'content@rosters': { templateUrl: '/app/components/rosters/views/RosterPC_CervicalCancer.html' + cacheBust, controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.PC.CC' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.PC.CC'); }]
				}
			})
			.state('rosters.PC.DC', {
				url: '/diabetes-care',
				params: { 'CGC': 'PCDC' },
				views: {
					'content@rosters': { templateUrl: '/app/components/rosters/views/RosterPC_DiabetesCare.html' + cacheBust, controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.PC.DC' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.PC.DC'); }]
				}
			})
			.state('rosters.PC.ADHD', {
				url: '/adhd',
				views: {
					'content@rosters': { templateUrl: 'app/components/rosters/views/RosterPC_ADHDMedication.html' + cacheBust, controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.PC.ADHD' } }],
					contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.PC.ADHD'); }]
				}
			})
			//================ ROSTERS - HEALTH MANAGEMENT =================//
			.state('rosters.HM', {
				url: '/health-management',
				views: {
					'content@rosters': { templateUrl: 'app/components/rosters/views/RosterHealthManagement.html' + cacheBust }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.HM' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.HM'); }]
				}
			})
			.state('rosters.HM.AR', {
				url: '/asthma',
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterHM_AsthmaRoster.html'), controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.HMAR' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.HMAR'); }]
				}
			})
			.state('rosters.HM.CMR', {
				url: '^/rosters/health-management/care-management-report',
				views: {
					'content@rosters': {
						templateUrl: url('/app/components/rosters/views/RosterHM_CareManagementReports.html'),
						controller: 'RosterHM_HMCMRController'
					}
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.HMCMR' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.HMCMR'); }]
				}
			})
               //...... PartialView.....//
            .state('rostersHMCMRPartial', {
                url: '^/rosters/health-management/care-management-report/partial',
            
                views: {
                    '': {
                         templateUrl: 'app/components/rosters/views/RosterHM_CareManagementReports.html' + cacheBust, controller: 'RosterHM_HMCMRController'
                    }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'ROST.HMCMR','isPartial': true  } }],
                    contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function (contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.HMCMR'); }]

                    //       contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function (contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('HMCMR'); }]
                }
            })


			.state('rosters.HM.DR', {
				url: '/diabetes',
				views: {
					'content@rosters': { templateUrl: url('/app/components/rosters/views/RosterHM_DiabetesRoster.html'), controller: 'RosterPartialViewController' }
				},
				resolve: {
					permission: ['authService', function(authService) { return authService.AuthenticationCheck(); }],
	                params: [function() { return { 'CGC': 'ROST.HMDR' } }],
	                contAuthServ: ['contentAuthorizationService', '$http', '$stateParams', function(contentAuthorizationService, $http, $stateParams) { return contentAuthorizationService.processContentAuth('ROST.HMDR'); }]

				}
			})

           //================ VISION =================//
           	.state('vision', {
           	    url: '/vision',
           	    views: {
           	        '': { templateUrl: url('/App/layout/two-column-wide-right.html') },
           	        'navigation@vision': { template: '<div left-navigation></div>' }
           	    },
           	    resolve: {
           	        permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
           	        params: [function () { return { 'CGC': 'NAV.VSN' } }]
           	    }
           	})
			.state('vision.index', {
			    url: '/index',
			    views: {
			        'content@vision': { templateUrl: url('/app/vision/Views/landing-page.html') }
			    },
			    resolve: {
			        permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
			        params: [function () { return { 'CGC': 'VSN' } }]
			    }
			})
			.state('vision.ver', {
			    url: '/vision-exception-request',
			    views: {
			        'content@vision': { templateUrl: url('/app/vision/Views/VisionExceptionRequest.html'), controller: 'visionController' }
			    },
			    resolve: {
			        permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
			        params: [function () { return { 'CGC': 'VSN.VER' } }]
			    }
			})
			.state('vision.vers', {
			    url: '/vision-exception-request-status',
			    views: {
			        'content@vision': { templateUrl: url('/app/vision/Views/VisionExceptionRequestStatus.html'), controller: 'visionController' }
			    },
			    resolve: {
			        permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
			        params: [function () { return { 'CGC': 'VSN.VERS' } }]
			    }

			})
            .state('vision.diabetes', {
                url: '/diabetes-care',
                views: {
                    'content@vision': { templateUrl: url('/app/vision/Views/DiabetesCare.html'), controller: 'visionController' }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'VSN.DIA' } }]
                }

            })
            .state('vision.icdcodes', {
                url: '/icd-codes',
                views: {
                    'content@vision': { templateUrl: url('/app/vision/Views/ICDCodes.html'), controller: 'visionController' }
                },
                resolve: {
                    permission: ['authService', function (authService) { return authService.AuthenticationCheck(); }],
                    params: [function () { return { 'CGC': 'VSN.ICD' } }]
                }

            })
	    ;
	}
})();