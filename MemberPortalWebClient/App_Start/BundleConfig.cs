using System.Web.Configuration;
using System.Web.Optimization;

namespace MemberPortalWebClient
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/lib").Include(
				//jQuery
				"~/Scripts/jquery-{version}.js",
				"~/Scripts/jquery.cookie.js",
				"~/Scripts/jquery.mobile-1.4.5.min.js",
				"~/Scripts/jquery.maskedinput.min.js",
				"~/Scripts/jQuery.print.js",

				//Bootstrap
				"~/Scripts/bootstrap.js",
				"~/Scripts/respond.js",

				//Angular
				"~/Scripts/angular.js",
				"~/Scripts/angular-animate.js",
				"~/Scripts/angular-cookies.js",
				"~/Scripts/angular-filter.min.js",
				"~/Scripts/angular-local-storage.js",
				"~/Scripts/angular-ui/ui-bootstrap-tpls.js",
				"~/Scripts/angular-ui-router.js",
				"~/Scripts/angular-resource.js",
				"~/Scripts/angular-sanitize.js",
				"~/Scripts/angular-translate.js",
				"~/Scripts/lodash.min.js",
				"~/Scripts/dialogs-main.min.js",
				"~/Scripts/dialogs.min.js",
				"~/Scripts/dialogs-controllers.js",
				"~/Scripts/angulartics.min.js",
				"~/Scripts/angulartics-ga.min.js",
				"~/Scripts/angular-datepicker.min.js",

				//KP's thing here
				//"~/Scripts/angular-datepicker.min.js",
				"~/Scripts/surveyClient/SurveyClientEngine.js",

				//Highlight
				"~/Scripts/highlight.min.js",
				"~/Scripts/angular-highlightjs.min.js",

				//Moment
				"~/Scripts/moment.min.js",
				"~/Scripts/angular-moment.min.js",

				//ngMask
				"~/Scripts/ngMask.min.js",

                "~/Scripts/checklist-model.js",

                /*Plupload file uploader Javascript */
                "~/Scripts/PlupLoadScripts/moxie.js",
                "~/Scripts/PlupLoadScripts/plupload.dev.js",
                "~/Scripts/PlupLoadScripts/queue.js")
                );

			// Use the development version of Modernizr to develop with and learn from. Then, when you're
			// ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
			bundles.Add(new ScriptBundle("~/bundles/InitialScripts")
				.Include("~/Scripts/JavaScriptPolyfills.js",
					"~/Scripts/modernizr-*"));

			bundles.Add(new ScriptBundle("~/bundles/app")
            //bundles.Add(new Bundle("~/bundles/app")

				/* Filters */
				.IncludeDirectory("~/app/filters", "*.js", true)

				/* Services */
				.Include("~/app/services/servicesModule.js")//Services Module
				.IncludeDirectory("~/app/services", "*.js", true)

				/* Directives */
				.Include("~/app/services/directivesModule.js")//Services Module
				.IncludeDirectory("~/app/directives", "*.js", true)
				.Include(
					/* Member Portal App */
					"~/app/appModule.js",
					"~/app/appRoute.js")

				/* Configs */
				.IncludeDirectory("~/app/configs", "*.js", true)

				/* Controllers */
				.IncludeDirectory("~/app/controllers", "*.js", true)

				/* Components */
				.IncludeDirectory("~/app", "*.js", true)
				);

			bundles.Add(new StyleBundle("~/Content/css").Include(
				"~/Content/bootstrap.css",
				"~/Content/Navigation.css",
				"~/Content/dialogs.min.css",
				"~/Content/font-awesome.min.css",
				"~/Content/angular-awesome-slider.min.css",
				"~/content/angular-datepicker.min.css",
				"~/Content/highlightjs-github-theme.css",
				"~/Content/site.css",
				"~/Content/plupload.css")
				/* Components */
				.IncludeDirectory("~/app", "*.css", true));


			// Set EnableOptimizations to false for debugging. For more information,
			// visit http://go.microsoft.com/fwlink/?LinkId=301862

			var EnableOptimizations = WebConfigurationManager.AppSettings["EnableBundleOptimizations"].ToLower() == "true";
			BundleTable.EnableOptimizations = EnableOptimizations;
		}
	}
}