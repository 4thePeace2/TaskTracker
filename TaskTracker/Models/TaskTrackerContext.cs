using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace TaskTracker.Models
{
    public class TaskTrackerContext : DbContext
    {
        public TaskTrackerContext() : base("name=TaskTrackerDbContext") { }

        public DbSet<Task> Tasks { get; set; }
        public DbSet<Project> Projects { get; set; }

    }
}