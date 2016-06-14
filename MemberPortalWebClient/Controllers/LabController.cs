using MemberPortalWebClient.MemberLabService;
using MemberPortalWebClient.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MemberPortalWebClient.Controllers
{
    [Authorize]
    public class LabController : ApiControllerBase
    {
        public List<Lab_Extraction_Combined> LabData()
        {

            var subscriberNumber = GetSubscriberNumber().ToString();

            //var client = new MemberLabServiceClient("WS2007FederationHttpBinding_IMemberLabService");
            //client.ClientCredentials.UserName.UserName = "TestMember";
            //client.ClientCredentials.UserName.Password = "t3stm3mb3r";

            var client = new WcfServiceHelperBase();
            client.Initialize(ServiceType.MemberLabService, "TestMember", "t3stm3mb3r");

            var result = client.MemberLabsChannel.LabData(subscriberNumber);
            
            return result;
        }
    }
}
