using System;
using System.Globalization;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace MemberPortalWebClient
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_BeginRequest()
        {
            string language = "en-us"; 
            var cookie = Request.Cookies.Get("__APPLICATION_LANGUAGE");
            if (cookie != null)
                language = cookie.Value; 
            Thread.CurrentThread.CurrentCulture   = new CultureInfo(language);
            Thread.CurrentThread.CurrentUICulture = new CultureInfo(language);
            HttpCookie cookieAppLanguage = new HttpCookie("__APPLICATION_LANGUAGE");
            DateTime now = DateTime.Now;
            cookieAppLanguage.Value = language;
            // Set the cookie expiration date.
            cookieAppLanguage.Expires = now.AddMonths(12);
            Request.Cookies.Add(cookieAppLanguage); 
        }
    } 
}
