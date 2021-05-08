using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaskTracker.Models
{
    public class TaskDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public TaskStatuses Status { get; set; }
        public string Description { get; set; }
        public int Priority { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
    }
}