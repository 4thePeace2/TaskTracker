using AutoMapper;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Http;
using System.Web.Http.Results;
using TaskTracker.Controllers;
using TaskTracker.Interfaces;
using TaskTracker.Models;

namespace TaskTracker.Tests.Controllers
{
    [TestClass]
    public class TasksControllerTest
    {
        static List<Task> tasksList;

        [TestMethod]
        // GetByProjectId action returns Ok and list of Tasks
        public void GetByProjectId() 
        { 
            // Mapping objects to objectsDTO
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Project, ProjectDTO>();
                cfg.CreateMap<Task, TaskDTO>()
                .ForMember(dest => dest.ProjectName, opt => opt.MapFrom(src => src.Project.Name))
                .ForMember(dest => dest.ProjectId, opt => opt.MapFrom(src => src.Project.Id));
            });

            // Arrange
            tasksList = new List<Task>();
            Project p1 = new Project() { Id = 1, Name = "project1" };
            tasksList.Add(new Task()
            {
                Id = 1,
                Name = "task1",
                Status = TaskStatuses.Done,
                Description = "test description1",
                Priority = 1,
                Project = p1
            });
            tasksList.Add(new Task()
            {
                Id = 2,
                Name = "task2",
                Status = TaskStatuses.Done,
                Description = "test description2",
                Priority = 2,
                Project = p1
            });
            var mockRepository = new Mock<ITaskRepository>();
            mockRepository.Setup(x => x.GetByProjectId(1)).Returns(tasksList.AsQueryable());
            var controller = new TasksController(mockRepository.Object);

            // Act
            IHttpActionResult actionResult = controller.GetByProjectId(1);
            var contentResult = actionResult as OkNegotiatedContentResult<IQueryable<TaskDTO>>;

            // Assert
            Assert.IsNotNull(contentResult);
            Assert.AreEqual(tasksList.Count, contentResult.Content.ToList().Count);
            Assert.AreEqual(tasksList.ElementAt(0).Id, contentResult.Content.ToList().ElementAt(0).Id);
        }

        [TestMethod]
        // GetAll action returns list of Tasks
        public void GetAll()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Project, ProjectDTO>();
                cfg.CreateMap<Task, TaskDTO>()
                .ForMember(dest => dest.ProjectName, opt => opt.MapFrom(src => src.Project.Name))
                .ForMember(dest => dest.ProjectId, opt => opt.MapFrom(src => src.Project.Id));
            });

            // Arrange
            tasksList = new List<Task>();
            Project p1 = new Project() { Id = 1, Name = "project1" };
            Project p2 = new Project() { Id = 2, Name = "project2" };

            tasksList.Add(new Task()
            {
                Id = 1,
                Name = "task1",
                Status = TaskStatuses.Done,
                Description = "test description1",
                Priority = 1,
                Project = p1
            });
            tasksList.Add(new Task()
            {
                Id = 2,
                Name = "task2",
                Status = TaskStatuses.Done,
                Description = "test description2",
                Priority = 1,
                Project = p2
            });

            var mockRepository = new Mock<ITaskRepository>();
            mockRepository.Setup(x => x.GetAll()).Returns(tasksList.AsQueryable());
            var controller = new TasksController(mockRepository.Object);

            // Act
            IQueryable<TaskDTO> result = controller.GetAll();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(tasksList.Count, result.ToList().Count);
            Assert.AreEqual(tasksList.ElementAt(0).Id, result.ToList().ElementAt(0).Id);
            Assert.AreEqual(tasksList.ElementAt(1).Name, result.ToList().ElementAt(1).Name);

        }
    }
}
