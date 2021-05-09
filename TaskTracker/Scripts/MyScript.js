$(document).ready(function () {

    //>>>>>>>>>>>>>>>>> Global variable initialization on start <<<<<<<<<<<<<<<<<<<<<<<<<
    var host = window.location.host;
    var tasksEndpoint = "/api/tasks";
    var projectsEndpoint = "/api/projects";
    var tableFlag = 1;

    var editingId;
    var httpAction = "POST";
    var filterValue = "0";

    var tasksUrl = "http://" + host + tasksEndpoint;
    console.log(tasksUrl);
    var projectsUrl = "http://" + host + projectsEndpoint;

    

    $("body").on("click", "#btnDelete", deleteTask); 
    $("body").on("click", "#btnEdit", editTask); 
    $("body").on("click", "#btnView", getTasks);
    $("body").on("click", "#btnTasks", showTasks); 
    $("body").on("click", "#btnProjects", showProjects);
    $("body").on("click", "#giveUpBtn", cleanForm); 
    $("body").on("click", "#filterBtn", filterTable);
    $("#filterBy").on("change", loadFilter);

    //>>>>>>>>>>>>>>>> Filtering option <<<<<<<<<<<<<<<<
    function loadFilter(e) {
        console.log(e.target.value);
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
        $("#divTasks").removeClass("hidden"); 
        $("#formTasks").removeClass("hidden");
        tableFlag = 1;

    }

    //>>>>>>>>>>>>>>>> Show projects <<<<<<<<<<<<<<<<

    function showProjects() {
        $.getJSON(projectsUrl, loadMainEntity);
        $("#topDiv").addClass("hidden");
        $("#divTasks").removeClass("hidden");
        $("#formProjects").removeClass("hidden"); 
        $("#filterDiv").removeClass("hidden");
        tableFlag = 2;

    }

    //>>>>>>>>>>>>>>>> Clean creation form <<<<<<<<<<<<<<

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

    //>>>>>>>>>>>>>>>>>>>>>>>>> Edit entity fill form <<<<<<<<<<<<<<<<<<<<<<
    function editTask() {
        var editId = this.name;
        if (tableFlag === 1) {
            var editingUrl = tasksUrl + "/" + editId.toString();
        } else {
            var editingUrl = projectsUrl + "/" + editId.toString();
        }
        
        console.log(editingUrl);
        //$("#validationMsgInput1").empty();
        //$("#validationMsgInput2").empty();
        //$("#validationMsgInput3").empty();
        //$("#validationMsgInput5").empty();
        //$("#validationMsgInput6").empty();

        $.ajax({
            "url": editingUrl,
            "type": "GET"
        })
            .done(function (data, status) {
                editingId = data.Id;
                console.log(data);
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
                //$("#addEdit").empty().text("Izmeni");

                //$("#editForm").removeClass("hidden");
                httpAction = "PUT";
            })
            .fail(function (data, status) {
                alert("Error getting entry from database!");
            })



    };




    //>>>>>>>>>>>>>> Submit form for Tasks <<<<<<<<<<<<<<<<<<
    $("#formTasks").submit(function (e) {

        e.preventDefault();
        submitingForm();
    });

    //>>>>>>>>>>>>>> Submit form for Projects <<<<<<<<<<<<<<<<<<
    $("#formProjects").submit(function (e) {

        e.preventDefault();
        submitingForm();
    });

    //>>>>>>>>>>>>>> Submiting function <<<<<<<<<<<<<<<<<<
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

        console.log(dataCreate);
        console.log(submitUrl);
        console.log(httpAction);

        
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
                //validation();
                alert("Error while adding object!");
            })

    }


    //>>>>>>>>>>>>>> Load entity into dropdown menu in task form <<<<<<<<<<<<<<<<<<
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

    //>>>>>>>>>>>>>> Load table with task/project entity <<<<<<<<<<<<<<<<<<
    function loadMainEntity(data, status) {
        console.log("Status: " + status);
        $("#tableTasks").empty();



        var container = $("#tableTasks");
        container.empty();

        if (status == "success") {
            console.log(data);

            // ispis naslova
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

            var table = $("<table style=\"width: auto; margin:auto\" border='1'  class=\"table table-hover text-center\" ></table>");
            var header = $("<tr style=\"background-color : lightgreen; height:20px\"><th class=\"text-center\" style=\"width:100px\">" + id + "</th><th class=\"text-center\" style=\"width:250px\">" + name + "</th><th class=\"text-center\" style=\"width:200px\">" + description + "</th><th colspan=" + colSpanVal +" class=\"text-center\" style=\"width:200px\">" + action + "</th></tr>");
            head.append(header);
            table.append(head);
            table.append(body);


            for (i = 0; i < data.length; i++) {

                var row = "<tr style=\"height:20px\">";

                var stringId = data[i].Id.toString();

                console.log(stringId);
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

            // ispis novog sadrzaja
            container.append(div);
        }
        else {
            var div = $("<div></div>");
            var h3 = $("<h3>Error loading Tasks!</h3>");
            div.append(h3);
            container.append(div);
        }
           
    }

    //>>>>>>>>>>>>> Get all tasks for specific project <<<<<<<<<<<<<<<
    function getTasks() {
        tableFlag = 1;
        var getTaskByIdUrl = tasksUrl + "/project?id=" + this.name;
        console.log(getTaskByIdUrl);
        console.log(tableFlag);

        $.getJSON(getTaskByIdUrl, loadMainEntity);
        $.getJSON(projectsUrl, getProjects);
        $("#formProjects").addClass("hidden");
        $("#filterDiv").addClass("hidden");
        $("#formTasks").removeClass("hidden");
    }

    //>>>>>>>>>>>>>> Removing entry from table <<<<<<<<<<<<<<<<<<
    function deleteTask() {
        var deleteId = this.name;
        console.log(this.name);
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



    //>>>>>>>>>>>>>>>>>>>>>> Search form <<<<<<<<<<<<<<<<<<<<<<<<<
    //function pretrazi() {
    //    var start = $("#findInput1").val();
    //    var kraj = $("#findInput2").val();
    //    httpAction = "POST";

    //    if (token) {
    //        headers.Authorization = "Bearer " + token;
    //    }

    //    var searchUrl = pretragaUrl + "?min=" + start + "&max=" + kraj;
    //    $.ajax({
    //        "url": searchUrl,
    //        "type": httpAction,
    //        "headers": headers
    //    })
    //        .done(loadMainEntity)
    //        .fail(function (data, status) {
    //            alert("Greska prilikom pretrage!");
    //        });

    //};


});



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Data validation before creating an object and submiting it to controller <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//function validation() {
//    var name = $("#createInput1").val();
//    var year = $("#createInput3").val();
//    var author = $("#createInput2").val();
//    var price = $("#createInput5").val();

//    var pName = $("#validationMsgInput1");
//    var pAuthor = $("#validationMsgInput2");
//    var pYear = $("#validationMsgInput3");
//    var pPrice = $("#validationMsgInput5");



//    var isValid = true;

//    //>>>>>>>>>>>>>> Galery name validation <<<<<<<<<<<<<<<<<<<<<<<<
//    if (!name) {
//        pName.text("Naziv slike je obavezno polje!");
//        isValid = false;
//    }
//    else if (name.length > 120) {
//        pName.text("Naziv slike ne moze biti duzi od 120 karaktera!");
//        isValid = false;
//    }

//    //>>>>>>>>>>>>>> Author name validation <<<<<<<<<<<<<<<<<<<<<<<<
//    if (!author) {
//        pAuthor.text("Autor slike je obavezno polje!");
//        isValid = false;
//    }
//    else if (author.length > 70) {
//        pAuthor.text("Ime autora ne moze biti duze od 70 karaktera!");
//        isValid = false;
//    }

//    //>>>>>>>>>>>>>> Year validation <<<<<<<<<<<<<<<<<<<<<<<<
//    if (!year || year < 1520 || year > 2019) {
//        pYear.text("Godina mora biti iz intervala od 1520. do 2019.");
//        isValid = false;
//    }

//    //>>>>>>>>>>>>>> Price validation <<<<<<<<<<<<<<<<<<<<<<<<

//    if (!price) {
//        pPrice.text("Cena je obavezno polje!");
//        isValid = false;
//    }

//    else if (price < 100.00 || price > 49999.99) {
//        pPrice.text("Cena mora biti iz intervala od 100 do 49999.99!");
//        isValid = false;
//    }

//    return isValid;
//}