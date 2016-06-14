using System;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;

namespace MemberPortalWebClient.Controllers
{
    public class ApiControllerBase : ApiController
    {
        protected string ApplicationName { get; set; }

        public ApiControllerBase()
        {
            ApplicationName = "WebMemberPortal";
        }

        internal string GetUserId()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return (claimsIdentity != null)
                ? claimsIdentity.Name
                : "N/A";
        }

        internal string GetApplicationId()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return (claimsIdentity != null)
                ? claimsIdentity.Claims.Single(c => c.Type.Contains("aud")).Value
                : "N/A";
        }

        internal string GetLob()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return (claimsIdentity != null)
                ? claimsIdentity.Claims.Single(c => c.Type.Contains("LOB")).Value
                : "N/A";
        }

        internal string GetLastName()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return (claimsIdentity != null)
                ? claimsIdentity.Claims.Single(c => c.Type.Contains("LName")).Value
                : "N/A";
        }

        internal string GetFirstName()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return (claimsIdentity != null)
                ? claimsIdentity.Claims.Single(c => c.Type.Contains("FName")).Value
                : "N/A";
        }

        internal string GetMiddleInitial()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return (claimsIdentity != null)
                ? claimsIdentity.Claims.Single(c => c.Type.Contains("Mi")).Value
                : "N/A";
        }

        internal string GetDateOfBirth()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return (claimsIdentity != null)
                ? claimsIdentity.Claims.Single(c => c.Type.Contains("Dob")).Value
                : "N/A";
        }

        internal string GetPin()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return (claimsIdentity != null)
                ? claimsIdentity.Claims.Single(c => c.Type.Contains("PcpPinCode")).Value
                : "N/A";
        }

        internal string GetLastFour()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return (claimsIdentity != null)
                ? claimsIdentity.Claims.Single(c => c.Type.Contains("Ssn")).Value
                : "N/A";
        }
        
        internal string GetEmail()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return (claimsIdentity != null)
                ? claimsIdentity.Claims.Single(c => c.Type.Contains("EmailMem")).Value
                : "N/A";
        }
        
        internal long GetSubscriberNumber()
        {
            var claimsIdentity = User.Identity as ClaimsIdentity;
            return (claimsIdentity != null)
                ? Convert.ToInt64(claimsIdentity.Claims.Single(c => c.Type.Contains("SubNo")).Value)
                : 0;
        }
    }
}