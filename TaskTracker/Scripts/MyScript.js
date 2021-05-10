//>>>>>>>>>>>>>>>> MyScript.js is used to manipulated the DOM <<<<<<<<<<<<<<<<

$(document).ready(function () {

    //>>>>>>>>>>>>>>>> Global variable initialization start <<<<<<<<<<<<<<<<

    //>>>>>>>>>>>>>>>> Default host <<<<<<<<<<<<<<<<
    var host = window.location.host;

    //>>>>>>>>>>>>>>>> Default end points <<<<<<<<<<<<<<<<
    var tasksEndpoint = "/api/tasks";
    var projectsEndpoint = "/api/projects";

    //>>>>>>>>>>>>>>>> Default table flag used to fill table with entries and for some other cases <<<<<<<<<<<<<<<<
    var tableFlag = 1;

    //>>>>>>>>>>>>>>>> Default sort direction <<<<<<<<<<<<<<<<
    var sortDirection = 1;

    //>>>>>>>>>>>>>>>> Id collector for view/edit/delete buttons in table <<<<<<<<<<<<<<<<
    var editingId;

    //>>>>>>>>>>>>>>>> Default http method <<<<<<<<<<<<<<<<
    var httpAction = "POST";

    //>>>>>>>>>>>>>>>> Default filter option <<<<<<<<<<<<<<<<
    var filterValue = "0";

    //>>>>>>>>>>>>>>>> Default urls <<<<<<<<<<<<<<<<
    var tasksUrl = "http://" + host + tasksEndpoint;
    var projectsUrl = "http://" + host + projectsEndpoint;

    
    //>>>>>>>>>>>>>>>> Clicks and other events <<<<<<<<<<<<<<<<
    $("body").on("click", "#btnDelete", deleteTask); 
    $("body").on("click", "#btnEdit", editTask); 
    $("body").on("click", "#btnView", getTasks);
    $("body").on("click", "#goProjects", showProjects);
    $("body").on("click", "#goTasks", showTasks);
    $("body").on("click", "#btnTasks", showTasks); 
    $("body").on("click", "#btnProjects", showProjects);
    $("body").on("click", "#giveUpBtn", cleanForm);
    $("body").on("click", "#giveUpBtn2", cleanForm);
    $("body").on("click", "#filterBtn", filterTable);
    $("body").on("click", "#sortId", sortById);
    $("body").on("click", "#sortName", sortByName);
    $("body").on("click", "#sortDesc", sortByDescription);
    $("#filterBy").on("change", loadFilter);

    
    //>>>>>>>>>>>>>>>> Global variable initialization end  <<<<<<<<<<<<<<<<


    //>>>>>>>>>>>>>>>> Sort by Name- direction <<<<<<<<<<<<<<<<
    function sortByName() {
        sortDirection === 1 ? sortDirection = 2 : sortDirection = 1;
        sortTable();
    }
    //>>>>>>>>>>>>>>>> Sort by Description- direction <<<<<<<<<<<<<<<<
    function sortByDescription() {
        sortDirection === 3 ? sortDirection = 4 : sortDirection = 3;
        sortTable();
    }

    //>>>>>>>>>>>>>>>> Sort by Id- direction <<<<<<<<<<<<<<<<
    function sortById() {
        sortDirection === 5 ? sortDirection = 6 : sortDirection = 5;
        sortTable();
    }

    //>>>>>>>>>>>>>>>> Sort table <<<<<<<<<<<<<<<<
    function sortTable() {
        var rows = $('#mainTable tbody  tr').get();

        rows.sort(function (a, b) {

            var i = 1;
            if (sortDirection === 3 || sortDirection === 4) {
                i = 2;
            } else {
                i = 0;
            }

            var A = $(a).children('td').eq(i).text().toUpperCase();
            var B = $(b).children('td').eq(i).text().toUpperCase();

            if (sortDirection === 1 || sortDirection === 3 || sortDirection === 5) {
                return -1;
            }

            if (sortDirection === 2 || sortDirection === 4 || sortDirection === 6) {
                return 1;
            }

            return 0;

        });

        $.each(rows, function (index, row) {
            $('#mainTable').children('tbody').append(row);
        });
    }

    //>>>>>>>>>>>>>>>> Filtering option <<<<<<<<<<<<<<<<
    function loadFilter(e) {
        switch (e.target.value) {
            case "1":
                $("#filterDate").addClass("hidden");
                $("#filterPriority").removeClass("hidden");
                $("#filterStatus").addClass("hidden");
                filterValue = "1";
                break;
            case "2":
                $("#filterDate").addClass("hidden");
                $("#filterPriority").addClass("hidden");
                $("#filterStatus").removeClass("hidden");
                filterValue = "2";
                break;
            default:
                $("#filterDate").removeClass("hidden");
                $("#filterPriority").addClass("hidden");
                $("#filterStatus").addClass("hidden");
                filterValue = "0";
                break;
        }
    }

    //>>>>>>>>>>>>>>>> Filter submit <<<<<<<<<<<<<<<<
    function filterTable() {
        switch (filterValue) {
            case "1":
                var priorityFilter = $("#prioritySelect").val();
                filterUrl = projectsUrl + "/with?priority=" + priorityFilter;
                break;
            case "2":
                var statusFilter = $("#statusSelect").val();
                filterUrl = projectsUrl + "/by?status=" + statusFilter;
                break;
            default:
                var startDate = $("#filterStartDate").val();
                var endDate = $("#filterEndDate").val();

                filterUrl = projectsUrl + "?start=" + startDate + "&end=" + endDate;
                break;
        }

        $.ajax({
            "url": filterUrl,
            "type": "GET"
        })
            .done(function (data, status) {
                if (data) {
                    loadMainEntity(data, status);
                } else {
                    alert("No data found!");
                }
                $("#prioritySelect").val('1');
                $("#statusSelect").val('0');
                $("#filterStartDate").val('');
                $("#filterEndDate").val('');
                
                
            })
            .fail(function (data, status) {
                alert("Error occurred while filtering data!");
            })

    }

    //>>>>>>>>>>>>>>>> Show tasks <<<<<<<<<<<<<<<<

    function showTasks() {
        $.getJSON(tasksUrl, loadMainEntity);
        $.getJSON(projectsUrl, getProjects);
        $("#topDiv").addClass("hidden"); 
        $("#goTasks").addClass("hidden");
        $("#goProjects").removeClass("hidden");
        $("#divMain").removeClass("hidden"); 
        $("#formTasks").removeClass("hidden");
        $("#filterDiv").addClass("hidden");
        $("#formProjects").addClass("hidden"); 


        tableFlag = 1;

    }

    //>>>>>>>>>>>>>>>> Show projects <<<<<<<<<<<<<<<<

    function showProjects() {
        $.getJSON(projectsUrl, loadMainEntity);
        $("#topDiv").addClass("hidden");
        $("#formTasks").addClass("hidden");
        $("#goProjects").addClass("hidden");
        $("#goTasks").removeClass("hidden");
        $("#divMain").removeClass("hidden");
        $("#formProjects").removeClass("hidden"); 
        $("#filterDiv").removeClass("hidden");

        tableFlag = 2;

    }

    //>>>>>>>>>>>>>>>> Clean creation form <<<<<<<<<<<<<<<<

    function cleanForm() {
        $("#createInput1").val('');
        $("#createInput2").val('');
        $("#createInput3select").val('0');
        $("#createInput4select").val('1');
        $("#createInput5").val('');
        $("#createInput6").val('');
        $("#createInput7").val('');
        $("#createInput8").val('');
        $("#createInput9select").val('0');
        $("#createInput10").val('');
        $("#createInput11").val('');

    }

    //>>>>>>>>>>>>>>>> Edit entity fill form <<<<<<<<<<<<<<<<
    function editTask() {
        var editId = this.name;
        if (tableFlag === 1) {
            var editingUrl = tasksUrl + "/" + editId.toString();
        } else {
            var editingUrl = projectsUrl + "/" + editId.toString();
        }
        
        $("#validationMsgInput1").empty();
        $("#validationMsgInput2").empty();
        $("#validationMsgInput5").empty();
        $("#validationMsgInput6").empty();
        $("#validationMsgInput7").empty();
        $("#validationMsgInput8").empty();
        $("#validationMsgInput11").empty();


        $.ajax({
            "url": editingUrl,
            "type": "GET"
        })
            .done(function (data, status) {
                editingId = data.Id;
                if (tableFlag === 1) {
                    $("#createInput1").val(data.Name);
                    $("#createInput2").val(data.Description);
                    $("#createInput3select").val(data.Status);
                    $("#createInput4select").val(data.ProjectId);
                    $("#createInput5").val(data.Priority);
                } else {

                    $("#createInput6").val(data.Name);
                    $("#createInput7").val(data.StartDate.substring(0, 10));
                    $("#createInput8").val(data.CompletionDate.substring(0, 10));
                    $("#createInput9select").val(data.Status);
                    $("#createInput10").val(data.Code);
                    $("#createInput11").val(data.Priority);
                }
                httpAction = "PUT";
            })
            .fail(function (data, status) {
                alert("Error getting entry from database!");
            })



    };




    //>>>>>>>>>>>>>>>> Submit form for Tasks <<<<<<<<<<<<<<<<
    $("#formTasks").submit(function (e) {

        e.preventDefault();
        $("#validationMsgInput1").empty();
        $("#validationMsgInput2").empty();
        $("#validationMsgInput5").empty();
        if (validation()) {
            submitingForm();
        }
        
    });

    //>>>>>>>>>>>>>>>> Submit form for Projects <<<<<<<<<<<<<<<<
    $("#formProjects").submit(function (e) {

        e.preventDefault();
        $("#validationMsgInput6").empty();
        $("#validationMsgInput7").empty();
        $("#validationMsgInput8").empty();
        $("#validationMsgInput11").empty();

        if (validationProject()) {
            submitingForm();
        }
    });

    //>>>>>>>>>>>>>>>> Submiting function <<<<<<<<<<<<<<<<
    function submitingForm() {
        if (tableFlag === 1) {
            var submitUrl = tasksUrl;
            var inputName = $("#createInput1").val();
            var inputDescription = $("#createInput2").val();
            var inputStatus = $("#createInput3select").val();
            var inputProject = $("#createInput4select").val();
            var inputPriority = $("#createInput5").val();

            $("#validationMsgInput1").empty();
            $("#validationMsgInput2").empty();
            $("#validationMsgInput5").empty();

            if (httpAction === "PUT") {
                submitUrl += "?id=" + editingId;
                var dataCreate = {
                    "Id": editingId,
                    "Name": inputName,
                    "Description": inputDescription,
                    "Status": inputStatus,
                    "ProjectId": inputProject,
                    "Priority": inputPriority,

                }
            } else {
                var dataCreate = {

                    "Name": inputName,
                    "Description": inputDescription,
                    "Status": inputStatus,
                    "ProjectId": inputProject,
                    "Priority": inputPriority,

                }
            }
            
        } else {
            var submitUrl = projectsUrl;
            var inputName = $("#createInput6").val();
            var inputStartDate = $("#createInput7").val();
            var inputEndDate = $("#createInput8").val();
            var inputStatus = $("#createInput9select").val();
            var inputCode = $("#createInput10").val();
            var inputPriority = $("#createInput11").val();

            $("#validationMsgInput6").empty();
            $("#validationMsgInput7").empty();
            $("#validationMsgInput8").empty();
            $("#validationMsgInput10").empty();
            $("#validationMsgInput11").empty();

            if (httpAction === "PUT") {
                submitUrl += "?id=" + editingId;
                var dataCreate = {
                    "Id": editingId,
                    "Name": inputName,
                    "Code": inputCode,
                    "Status": inputStatus,
                    "StartDate": inputStartDate,
                    "CompletionDate": inputEndDate,
                    "Priority": inputPriority
                }
            } else {
                var dataCreate = {
                    "Name": inputName,
                    "Code": inputCode,
                    "Status": inputStatus,
                    "StartDate": inputStartDate,
                    "CompletionDate": inputEndDate,
                    "Priority": inputPriority
                }
            }
            
        }

        
        $.ajax({
            "url": submitUrl,
            "type": httpAction,
            "data": dataCreate
        })
            .done(function (data, status) {
                if (tableFlag === 1) {
                    $.getJSON(tasksUrl, loadMainEntity);
                    $("#createInput1").val('');
                    $("#createInput2").val('');
                    $("#createInput3select").val('0');
                    $("#createInput4select").val('1');
                    $("#createInput5").val('');
                    httpAction = "POST";
                } else {
                    $.getJSON(projectsUrl, loadMainEntity);
                    $("#createInput6").val('');
                    $("#createInput7").val('');
                    $("#createInput8").val('');
                    $("#createInput9select").val('0');
                    $("#createInput10").val('');
                    $("#createInput11").val('');
                    httpAction = "POST";
                }
                
                
                alert("Successfully added!");



            })
            .fail(function (data, status) {
                
                alert("Error while adding object!");
            })

    }




    //>>>>>>>>>>>>>>>> Load entity into dropdown menu in task form <<<<<<<<<<<<<<<<
    function getProjects(data, status) {
        var project = $("#createInput4select");
        project.empty();

        if (status === "success") {

            for (var i = 0; i < data.length; i++) {
                var option = "<option value=" + data[i].Id + ">" + data[i].Name + "</option>";
                project.append(option);
            }
        }
        else {
            var div = $("<div></div>");
            var h3 = $("<h3>Error loading projects!</h3>");
            div.append(h3);
            project.append(div);
        }



    }

    //>>>>>>>>>>>>>>>> Load table with task/project entity <<<<<<<<<<<<<<<<
    function loadMainEntity(data, status) {
        $("#tableDiv").empty();

        



        var container = $("#tableDiv");
        container.empty();

        if (status == "success") {
            var div = $("<div></div>");
            
            
            var name = "Name";
            var id = "Id";
            var action = "Action";
            var deleteAction = "remove";
            
            if (tableFlag === 1) {
                var h3 = $("<h3 class=\"text-center\">Tasks</h3>");
                var description = "Description";
                var editAction = "view/edit";
                var colSpanVal = "2";
            } else {
                var h3 = $("<h3 class=\"text-center\">Projects</h3>");
                var description = "Code";
                var editAction = "edit";
                var colSpanVal = "3";
            }
            
            
            

            var head = $("<thead></thead>");
            var body = $("<tbody></tbody>");

            div.append(h3);

            var table = $("<table id=\"mainTable\" style=\"width: auto; margin:auto\" border='1'  class=\"table table-hover text-center\" ></table>");
            var header = $("<tr style=\"background-color : lightgreen; height:20px\"><th class=\"text-center\" style=\"width:100px\"><a style=\"color: black\" id=\"sortId\">" + id + "</a></th><th class=\"text-center\" style=\"width:250px\"><a style=\"color: black\" id=\"sortName\">" + name + "</a></th><th class=\"text-center\" style=\"width:200px\"><a style=\"color: black\" id=\"sortDesc\">" + description + "</a></th><th colspan=" + colSpanVal +" class=\"text-center\" style=\"width:200px\">" + action + "</th></tr>");
            head.append(header);
            table.append(head);
            table.append(body);


            for (i = 0; i < data.length; i++) {

                var row = "<tr style=\"height:20px\">";

                var stringId = data[i].Id.toString();

                var displayDelete = "<td><a href=\"#\" id=btnDelete name=" + stringId + ">[" + deleteAction + "]</a></td>";
                var displayEdit = "<td><a href=\"#\" id=btnEdit  name=" + stringId + ">[" + editAction + "]</a></td>";

                if (tableFlag === 1) {
                    var displayData = "<td>" + data[i].Id + "</td><td>" + data[i].Name + "</td><td>" + data[i].Description + "</td>";
                    row += displayData + displayEdit + displayDelete + "</tr>";
                } else {
                    var displayData = "<td>" + data[i].Id + "</td><td>" + data[i].Name + "</td><td>" + data[i].Code + "</td>";
                    var displayView = "<td><a href=\"#\" id=btnView  name=" + stringId + ">[view tasks]</a></td>";
                    row += displayData + displayView + displayEdit + displayDelete + "</tr>";
                }
                
                



                
                body.append(row);

            }

            div.append(table);

            // adding div with a generated table
            container.append(div);
        }
        else {
            var div = $("<div></div>");
            var h3 = $("<h3>Error loading Tasks!</h3>");
            div.append(h3);
            container.append(div);
        }
           
    }

    //>>>>>>>>>>>>>>>> Get all tasks for specific project <<<<<<<<<<<<<<<<
    function getTasks() {
        tableFlag = 1;
        var getTaskByIdUrl = tasksUrl + "/project?id=" + this.name;

        $.getJSON(getTaskByIdUrl, loadMainEntity);
        $.getJSON(projectsUrl, getProjects);
        $("#formProjects").addClass("hidden");
        $("#goTasks").addClass("hidden");
        $("#goProjects").removeClass("hidden");
        $("#filterDiv").addClass("hidden");
        $("#formTasks").removeClass("hidden");
    }

    //>>>>>>>>>>>>>>>> Removing entry from table <<<<<<<<<<<<<<<<
    function deleteTask() {
        var deleteId = this.name;
        httpAction = "DELETE";
        if (tableFlag === 1) {
            var deleteUrl = tasksUrl;
        } else {
            var deleteUrl = projectsUrl;
        }
        
        $.ajax({
            "url": deleteUrl + "?id=" + deleteId,
            "type": httpAction

        })
            .done(function (data, status) {
                if (tableFlag === 1) {
                    $.getJSON(tasksUrl, loadMainEntity);
                } else {
                    $.getJSON(projectsUrl, loadMainEntity);
                }
                
                httpAction = "POST";

            })
            .fail(function (data, status) {
                httpAction = "POST";
                alert("Greska prilikom brisanja proizvoda!")
            })

    };


});



//>>>>>>>>>>>>>>>> Data validation for tasks before submiting it to controller <<<<<<<<<<<<<<<<
function validation() {
    var name = $("#createInput1").val();
    var description = $("#createInput2").val();
    var priority = $("#createInput5").val();

    var pName = $("#validationMsgInput1");
    var pDescription = $("#validationMsgInput2");
    var pPriority = $("#validationMsgInput5");



    var isValid = true;

    //>>>>>>>>>>>>>> Task name validation <<<<<<<<<<<<<<<<<<<<<<<<
    if (!name) {
        pName.text("Name is required!");
        isValid = false;
    }

    //>>>>>>>>>>>>>> Description validation <<<<<<<<<<<<<<<<<<<<<<<<
    if (!description) {
        pDescription.text("Description is required!");
        isValid = false;
    }

    //>>>>>>>>>>>>>> Priority validation <<<<<<<<<<<<<<<<<<<<<<<<

    if (!priority) {
        pPriority.text("Priority is required and has to be an number 1(high), 2(normal) or 3(low)!");
        isValid = false;
    }
    return isValid;
}

//>>>>>>>>>>>>>>>> Data validation for projects before submiting it to controller <<<<<<<<<<<<<<<<
function validationProject() {
    var projectName = $("#createInput6").val();
    var startDate = $("#createInput7").val();
    var endDate = $("#createInput8").val();
    var projectPriority = $("#createInput11").val();


    var pProjectName = $("#validationMsgInput6");
    var pStartDate = $("#validationMsgInput7");
    var pEndDate = $("#validationMsgInput8");
    var pProjectPriority = $("#validationMsgInput11");




    var isValid = true;

    //>>>>>>>>>>>>>> Project name validation <<<<<<<<<<<<<<<<<<<<<<<<
    if (!projectName) {
        pProjectName.text("Name is required!");
        isValid = false;
    }

    //>>>>>>>>>>>>>> Start date validation <<<<<<<<<<<<<<<<<<<<<<<<
    if (!startDate) {
        pStartDate.text("Start date is required and has to be older then completion date!");
        isValid = false;
    } else if(dates.compare(startDate, endDate) === -1) {
        pStartDate.text("test");
        isValid = false;
    }

    //>>>>>>>>>>>>>> End date validation <<<<<<<<<<<<<<<<<<<<<<<<
    if (!endDate) {
        pEndDate.text("Completion date is required and has to be younger then start date!");
        isValid = false;
    }

    //>>>>>>>>>>>>>> Priority validation <<<<<<<<<<<<<<<<<<<<<<<<

    if (!projectPriority) {
        pProjectPriority.text("Priority is required and has to be an number 1(high), 2(normal) or 3(low)!");
        isValid = false;
    }
    return isValid;
}