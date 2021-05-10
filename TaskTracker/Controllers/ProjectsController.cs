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
    //Projects controller used to serve data from backend to frontend when certain endpoint is hit!
    public class ProjectsController : ApiController
    {
        IProjectRepository _repository { get; set; }

        // Constuctor with parameter 
        public ProjectsController(IProjectRepository repository)
        {
            _repository = repository;
        }

        //GetAll action- returns all data from table Projects in DB
        [HttpGet]
        [ResponseType(typeof(IQueryable<ProjectDTO>))]
        public IQueryable<ProjectDTO> GetAll()
        {
            return _repository.GetAll().ProjectTo<ProjectDTO>();
        }

        //GetById action- returns Project with certain id from table Projects in DB
        //or returns BadRequest if Task id is lower than 0 or returns NotFound if no object meets criteria
        [HttpGet]
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

        //Post action- adds new Project in table Projects in DB or returns BadRequest
        //if ModelState is not valid(doesnt have all required fields filled)
        [HttpPost]
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

        //Put action- updates Project with certain id in table Projects in DB or returns BadRequest
        //if ModelState is not valid(doesnt have all required fields filled) or id from uri is not same as Project.Id from body
        [HttpPut]
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

        //Delete action- deletes Project with certain id in table Projects in DB or returns NotFound if that id/project doesn't exists
        [HttpDelete]
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
        }

        //GetByDateRange action- returns Ok with array of objects from table Projects in DB who are between range of start and end date
        //or returns BadRequest if start date is younger then end date or returns NotFound if no object meets criteria
        [HttpGet]
        [Route("api/projects/{start}/{end}")]
        [ResponseType(typeof(IQueryable<ProjectDTO>))]
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

        //GetByPriority action- returns Ok with array of objects from table Projects in DB who have certain priority
        //or returns BadRequest if priority is higher than 3/lower than 1 or returns NotFound if no object meets criteria
        [HttpGet]
        [Route("api/projects/with/{priority}")]
        [ResponseType(typeof(IQueryable<ProjectDTO>))]
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
        //GetByStatus action- returns Ok with array of objects from table Projects in DB who have certain status
        //or returns BadRequest if status is higher than 2/lower than 0 or returns NotFound if no object meets criteria
        [HttpGet]
        [Route("api/projects/by/{status}")]
        [ResponseType(typeof(IQueryable<ProjectDTO>))]
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
