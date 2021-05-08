using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TaskTracker.Interfaces;
using TaskTracker.Models;

namespace TaskTracker.Repository
{
    public class TaskRepository : ITaskRepository, IDisposable
    {
        private TaskTrackerContext db = new TaskTrackerContext();
        protected void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (db != null)
                {
                    db.Dispose();
                    db = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        public void Add(Task Task)
        {
            db.Tasks.Add(Task);
            db.SaveChanges();
        }

        public void Delete(Task Task)
        {
            db.Tasks.Remove(Task);
            db.SaveChanges();
        }

        
        public IQueryable<Task> GetAll()
        {
            return db.Tasks.OrderBy(x => x.Id);
        }

        public IQueryable<Task> GetByProjectId(int id)
        {
            return db.Tasks.Where(x => x.ProjectId == id);
        }

        public void Update(Task Task)
        {
            db.Entry(Task).State = EntityState.Modified;
            db.SaveChanges();

        }

        public Task GetById(int id)
        {
            return db.Tasks.Find(id);
        }
    }
}