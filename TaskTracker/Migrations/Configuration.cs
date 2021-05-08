namespace TaskTracker.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using TaskTracker.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<TaskTracker.Models.TaskTrackerContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(TaskTracker.Models.TaskTrackerContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data.
            

            //Seeding Projects table in database: TaskTrackerDB
            context.Projects.AddOrUpdate(
                    new Project() { Id= 1, Code= "PR001", Name= "First Project", StartDate = new DateTime(2016, 6, 28), CompletitionDate = new DateTime(2016, 9, 28), Priority = 1, Status = ProjectStatuses.Completed },
                    new Project() { Id = 2, Code = "PR002", Name = "Second Project", StartDate = new DateTime(2017, 2, 15), CompletitionDate = new DateTime(2017, 8, 1), Priority = 3, Status = ProjectStatuses.Active },
                    new Project() { Id = 3, Code = "PR003", Name = "Third Project", StartDate = new DateTime(2019, 1, 31), CompletitionDate = new DateTime(2019, 5, 1), Priority = 2, Status = ProjectStatuses.NotStarted }
                );
            context.SaveChanges();

            //Seeding Tasks table in database: TaskTrackerDB
            context.Tasks.AddOrUpdate(
                    new Task() { Id = 1, Name = "Main task project 2", Description = "Do the main task using .net technologies!", Priority = 2, ProjectId = 2, Status = TaskStatuses.InProgress },
                    new Task() { Id = 2, Name = "Side task project 2", Description = "Do the side task using before you finish main task!", Priority = 1, ProjectId = 2, Status = TaskStatuses.Done },
                    new Task() { Id = 3, Name = "Main task project 1", Description = "Do the main task using .net technologies!", Priority = 3, ProjectId = 1, Status = TaskStatuses.Done },
                    new Task() { Id = 4, Name = "Side task 1 project 1", Description = "Do the side task using before you finish main task!", Priority = 2, ProjectId = 1, Status = TaskStatuses.Done },
                    new Task() { Id = 5, Name = "Side task 2 project 1", Description = "Do the side task using before you finish side task 1!", Priority = 1, ProjectId = 1, Status = TaskStatuses.Done },
                    new Task() { Id = 6, Name = "Main task project 3", Description = "Do the main task using .net technologies!", Priority = 2, ProjectId = 3, Status = TaskStatuses.ToDo }
                );
            context.SaveChanges();

        }
    }
}
