using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaskTracker.Models
{
    //class ProjectDTO is meant to be transferred over the network instead of original Project object
    public class ProjectDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime CompletionDate { get; set; }
        public ProjectStatuses Status { get; set; }
        public int Priority { get; set; }
    }
}