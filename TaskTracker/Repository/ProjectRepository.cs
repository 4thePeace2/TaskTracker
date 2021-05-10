using TaskTracker.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TaskTracker.Models;

namespace TaskTracker.Repository
{
    //Project repository defined to communicate with DB through context object
    //Implements IProjectRepository interface(who has all methods difined in it) and IDisposable interface for freeing resources
    public class ProjectRepository : IProjectRepository, IDisposable
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
        public void Add(Project Project)
        {
            db.Projects.Add(Project);
            db.SaveChanges();
        }

        public void Delete(Project Project)
        {
            db.Projects.Remove(Project);
            db.SaveChanges();
        }

        public IQueryable<Project> GetAll()
        {
            return db.Projects.OrderBy(x => x.Id);
        }

        public Project GetById(int id)
        {
            return db.Projects.Find(id);
        }

        public void Update(Project Project)
        {
            db.Entry(Project).State = EntityState.Modified;
            db.SaveChanges();
        }

        public IQueryable<Project> GetByDateRange(DateTime start, DateTime end)
        {
            return db.Projects.Where(x => x.StartDate >= start && x.CompletionDate <= end).OrderBy(x => x.StartDate);
        }

        public IQueryable<Project> GetByPriority(int priority)
        {
            return db.Projects.Where(x => x.Priority == priority);
        }

        public IQueryable<Project> GetByStatus(int status)
        {
            return db.Projects.Where(x => (int)x.Status == status);
        }
    }
}