using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TaskTracker.Models;

namespace TaskTracker.Interfaces
{
    public interface IProjectRepository
    {
        Project GetById(int id);
        void Add(Project Project);
        IQueryable<Project> GetAll();
        IQueryable<Project> GetByDateRange(DateTime start, DateTime end);
        IQueryable<Project> GetByPriority(int priority);
        void Update(Project Project);
        void Delete(Project Project);
    }
}
