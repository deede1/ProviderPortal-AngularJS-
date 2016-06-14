using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace MemberPortalWebClient
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("html/{*pathInfo}");

            routes.MapRoute(
                name: "InternalLogin",
                url: "InternalLogin",
                defaults: new { controller = "App", action = "InternalLogin" }
            );

            routes.MapRoute(
                name: "DebugModule",
                url: "DebugModule",
                defaults: new { controller = "App", action = "DebugModule" }
            );

            //This Route is for the main application which is written in AngularJS.  This route is sectioned on from the rest because the routing in the area, will be handled by Angular. So as long as /App/ is the first part of the URL it will be handled by the AppController, and use the Index Action. Anything included in the URL is for Angular to handle.
            routes.MapRoute(
                name: "App",
                url: "{*angularRoutes}",
                defaults: new { controller = "App", action = "Index" }
            );


            //routes.MapRoute(
	        //  name: "Print",
	        //  url: "Print/{*angularRoutes}",
	        //  defaults: new { controller = "App", action = "Print" }
            //);

			//This Route is for the main application which is written in AngularJS.  This route is sectioned on from the rest because the routing in the area, will be handled by Angular. So as long as /App/ is the first part of the URL it will be handled by the AppController, and use the Index Action. Anything included in the URL is for Angular to handle.
            //routes.MapRoute(
            //    name: "ThanksIe",
            //    url: "#!/App/{*angularRoutes}",
            //    defaults: new { controller = "App", action = "Index" }
            //);

            //This route allows us to use Razor views (.cshtml), in addition to .html files as the templates that feed Angular views. The AppController is still being used, but since the previous route doesn't accept an action as a parameter, any request to "AppViews" will expect an action to be named.
            //routes.MapRoute(
            //    name: "AppViews",
            //    url: "AppViews/{action}",
            //    defaults: new { controller = "App", action = "Index" }
            //);

            //This is the default route, it expects and controller and action to be named explicitly.  If none are explicitly requested, you will get returned the the App/Index controller/action which engages the 1st route we configured.
            //routes.MapRoute(
            //    name: "Default",
            //    url: "{controller}/{action}/{id}",
            //    defaults: new { controller = "App", action = "Index", id = UrlParameter.Optional }
            //);
        }
    }
}
