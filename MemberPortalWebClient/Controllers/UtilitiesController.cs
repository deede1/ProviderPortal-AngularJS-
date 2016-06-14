using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MemberPortalWebClient.Controllers
{
    public class UtilitiesController : ApiControllerBase
    {
        //[Authorize]
        public string[] GetRoles()
        {
          return new [] {"yay","boo"};
        }
    }
}
