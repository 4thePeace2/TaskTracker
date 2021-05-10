using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TaskTracker.Models
{
    //custom enum made for class Tasks's property Status
    public enum TaskStatuses
    {
        ToDo,
        InProgress,
        Done
    }

    //Task entity class
    public class Task
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public TaskStatuses Status { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        [Range(1,3)]
        public int Priority { get; set; }
        //Foreign key
        public virtual int ProjectId { get; set; }
        public virtual Project Project { get; set; }


    }
}