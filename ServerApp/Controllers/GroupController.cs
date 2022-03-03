using IntegrationTestingTool.Model.Entities;
using IntegrationTestingTool.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace IntegrationTestingTool.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    [Produces("application/json")]
    public class GroupController : Controller
    {
        private IGroupService GroupService { get; }

        public GroupController(IGroupService groupService)
        {
            GroupService = groupService;
        }

        [HttpGet]
        public async Task<IEnumerable<Group>> GetAll() =>
             await GroupService.GetAll();

        [HttpPost]
        public async Task<string> Add([FromForm] Group group)
        {
            var result = await GroupService.Add(group);
            return (result != null) ? string.Empty : "An error occured during endpoint creating";
        }

        [HttpGet]
        public async Task<IActionResult> Get(Guid id)
        {
            var group = await GroupService.GetOne(id);
            return group == null ?
                (IActionResult)new BadRequestResult() :
                new OkObjectResult(group);
        }

        [HttpPost]
        public async Task Update([FromForm] Group group) =>
            await GroupService.Rename(group.Id, group.Name);

        [HttpGet]
        public async Task<bool> Delete(Guid id) =>
            await GroupService.Delete(id);
    }
}
