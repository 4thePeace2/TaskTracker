using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TaskTracker.Models
{
    //custom enum made for class Project's property Status
    public enum ProjectStatuses
    {
        NotStarted,
        Active,
        Completed
    }

    //Project entity class
    public class Project
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Code { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime CompletionDate { get; set; }
        [Required]
        public ProjectStatuses Status { get; set; }
        [Required]
        [Range(1,3)]
        public int Priority { get; set; }
        public ICollection<Task> Tasks { get; set; }

    }
}