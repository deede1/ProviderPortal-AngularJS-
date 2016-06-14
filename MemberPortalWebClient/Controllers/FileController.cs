using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace MemberPortalWebClient.Controllers
{
    public class FileController : Controller
    {
        public async Task<ActionResult> MemberLetter(string authorizationId)
        {

            var bearerToken = (HttpContext.Request).Cookies["ls.token"].Value;


            using (var client = new HttpClient())
            {
                var message = new HttpRequestMessage()
                {
                    RequestUri = new Uri(WebConfigurationManager.AppSettings["dataServiceBase"] + "Member/Authorizations/Medical/GetLetter?authorizationNumber=" + authorizationId),
                    Method = HttpMethod.Get
                };
                message.Headers.Add("Authorization", "Bearer " + bearerToken);
                message.Headers.Add("User-Agent", Request.Headers.Get("User-Agent"));
                var response = await client.SendAsync(message);
                if (response == null) return null; // We are checking here if the response of the service doesn't contain any data
                var fileBytes = await response.Content.ReadAsByteArrayAsync();
                var contentType = response.Content.Headers.ContentType.ToString();
                var fileName = response.Content.Headers.ContentDisposition.FileName;
                return File(fileBytes, contentType, fileName);
            }
            return null;
        }
        public async Task<ActionResult> ViewMemberLetter(string authorizationId)
        {

            var bearerToken = (HttpContext.Request).Cookies["ls.token"].Value;


            using (var client = new HttpClient())
            {
                var message = new HttpRequestMessage()
                {
                    RequestUri = new Uri(WebConfigurationManager.AppSettings["dataServiceBase"] + "Member/Authorizations/Medical/GetLetter?authorizationNumber=" + authorizationId),
                    Method = HttpMethod.Get
                };
                message.Headers.Add("Authorization", "Bearer " + bearerToken);
                message.Headers.Add("User-Agent", Request.Headers.Get("User-Agent"));
                var response = await client.SendAsync(message);
                if (response == null) return null; // We are checking here if the response of the service doesn't contain any data
                var fileBytes = await response.Content.ReadAsByteArrayAsync();
                var contentType = response.Content.Headers.ContentType.ToString();
                var fileName = response.Content.Headers.ContentDisposition.FileName;
                return File(fileBytes, contentType);
            }
            return null;
        }
    }
}