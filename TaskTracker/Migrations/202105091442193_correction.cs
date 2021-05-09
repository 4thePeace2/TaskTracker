namespace TaskTracker.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class correction : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Projects", "CompletionDate", c => c.DateTime(nullable: false));
            DropColumn("dbo.Projects", "CompletitionDate");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Projects", "CompletitionDate", c => c.DateTime(nullable: false));
            DropColumn("dbo.Projects", "CompletionDate");
        }
    }
}
