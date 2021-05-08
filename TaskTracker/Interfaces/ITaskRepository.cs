using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using TaskTracker.Models;

namespace TaskTracker.Interfaces
{
    public interface ITaskRepository
    {
        Task GetById(int id);
        IQueryable<Task> GetByProjectId(int id);
        void Add(Task Task);
        IQueryable<Task> GetAll();
        void Update(Task Task);
        void Delete(Task Task);
    }
}
