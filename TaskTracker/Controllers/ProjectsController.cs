using AutoMapper;
using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using TaskTracker.Interfaces;
using TaskTracker.Models;

namespace TaskTracker.Controllers
{
    public class ProjectsController : ApiController
    {
        IProjectRepository _repository { get; set; }

        public ProjectsController(IProjectRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [ResponseType(typeof(IQueryable<ProjectDTO>))]
        public IQueryable<ProjectDTO> GetAll()
        {
            return _repository.GetAll().ProjectTo<ProjectDTO>();
        }

        [ResponseType(typeof(ProjectDTO))]
        public IHttpActionResult GetById(int id)
        {
            if (id < 0)
            {
                return BadRequest();
            }
            if (_repository.GetById(id) == null)
            {
                return NotFound();
            }
            return Ok(Mapper.Map<ProjectDTO>(_repository.GetById(id)));
        }

        [ResponseType(typeof(ProjectDTO))]
        public IHttpActionResult Post(Project Project)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _repository.Add(Project);
            return CreatedAtRoute("DefaultApi", new { id = Project.Id }, Mapper.Map<ProjectDTO>(Project));
        }

        [ResponseType(typeof(ProjectDTO))]
        public IHttpActionResult Put(int id, Project Project)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != Project.Id)
            {
                return BadRequest();
            }
            try
            {
                _repository.Update(Project);
            }
            catch (Exception)
            {

                return BadRequest();
            }

            return Ok(Mapper.Map<ProjectDTO>(Project));
        }

        [ResponseType(typeof(HttpStatusCode))]
        public IHttpActionResult Delete(int id)
        {
            Project Project = _repository.GetById(id);
            if (Project == null)
            {
                return NotFound();
            }

            _repository.Delete(Project);

            return StatusCode(HttpStatusCode.NoContent);
            //return Ok();
        }

        [HttpGet]
        public IHttpActionResult GetByDateRange(DateTime start, DateTime end)
        {
            if (start != null && end != null && start < end)
            {
                try
                {
                    var projects = _repository.GetByDateRange(start, end).ProjectTo<ProjectDTO>();
                    if (projects.Count() > 0)
                    {
                        return Ok(projects);
                    }
                    return NotFound();
                    
                }
                catch (Exception)
                {
                    return BadRequest();
                }
                
            }
            return BadRequest();
        }

        [HttpGet]
        [Route("api/projects/with")]
        public IHttpActionResult GetByPriority(int priority)
        {
            if (priority > 0 && priority < 4)
            {
                var projects = _repository.GetByPriority(priority).ProjectTo<ProjectDTO>();
                if (projects.Count() > 0)
                {
                    return Ok(projects);
                }
                return NotFound();
            }

            return BadRequest();
            
        }
        [HttpGet]
        [Route("api/projects/by")]
        public IHttpActionResult GetByStatus(int status)
        {
            if (status >= 0 && status < 3)
            {
                var projects = _repository.GetByStatus(status).ProjectTo<ProjectDTO>();
                if (projects.Count() > 0)
                {
                    return Ok(projects);
                }
                return NotFound();
            }

            return BadRequest();

        }
    }
}
