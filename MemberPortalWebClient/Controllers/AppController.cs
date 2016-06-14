using System.Web.Mvc;

namespace MemberPortalWebClient.Controllers
{
    public class AppController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

		public ActionResult Print()
		{
			return View();
		}

        [HttpPost]
        public ActionResult InternalLogin(string authString)
        {
            ViewBag.authString = authString;
            return View("Index");
        }

        public ActionResult DebugModule()
        {
            return View();
        }
        

    }
}