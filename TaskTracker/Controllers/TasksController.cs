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
    public class TasksController : ApiController
    {
        ITaskRepository _repository { get; set; }

        public TasksController(ITaskRepository repository)
        {
            _repository = repository;
        }

        //GetAll action- returns all data from table Projects in DB
        [HttpGet]
        [ResponseType(typeof(IQueryable<TaskDTO>))]
        public IQueryable<TaskDTO> GetAll()
        {
            return _repository.GetAll().ProjectTo<TaskDTO>();
        }

        //GetById action- returns Tasks with certain id from table Tasks in DB
        //or returns BadRequest if Task id is lower than 0 or returns NotFound if no object meets criteria
        [HttpGet]
        [ResponseType(typeof(TaskDTO))]
        public IHttpActionResult GetById(int id)
        {
            if (id < 0)
            {
                return BadRequest();
            }
            var task = _repository.GetById(id);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(Mapper.Map<TaskDTO>(task));
        }

        //GetByProjectId action(with custom route)- returns Ok with array of objects from table Tasks in DB who have certain Project id
        //or returns BadRequest if Project id is lower than 0 or returns NotFound if no object meets criteria
        [HttpGet]
        [Route("api/tasks/project")]
        [ResponseType(typeof(IQueryable<TaskDTO>))]
        public IHttpActionResult GetByProjectId(int id)
        {
            if (id < 0)
            {
                return BadRequest();
            }
            var tasks = _repository.GetByProjectId(id).ProjectTo<TaskDTO>();
            if (tasks.Count() == 0)
            {
                return NotFound();
            }
            return Ok(tasks);
        }

        //Post action- adds new Task in table Tasks in DB or returns BadRequest
        //if ModelState is not valid(doesnt have all required fields filled)
        [HttpPost]
        [ResponseType(typeof(TaskDTO))]
        public IHttpActionResult Post(Task Task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _repository.Add(Task);
            return CreatedAtRoute("DefaultApi", new { id = Task.Id }, Mapper.Map<TaskDTO>(Task));
        }

        //Put action- updates Task with certain id in table Tasks in DB or returns BadRequest
        //if ModelState is not valid(doesnt have all required fields filled) or id from uri is not same as Task.Id from body
        [HttpPut]
        [ResponseType(typeof(TaskDTO))]
        public IHttpActionResult Put(int id, Task Task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != Task.Id)
            {
                return BadRequest();
            }
            try
            {
                _repository.Update(Task);
            }
            catch (Exception)
            {

                return BadRequest();
            }

            return Ok(Mapper.Map<TaskDTO>(Task));
        }

        //Delete action- deletes Task with certain id in table Tasks in DB or returns NotFound if that id/project doesn't exists
        [HttpDelete]
        [ResponseType(typeof(HttpStatusCode))]
        public IHttpActionResult Delete(int id)
        {
            Task task = _repository.GetById(id);
            if (task == null)
            {
                return NotFound();
            }

            _repository.Delete(task);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
