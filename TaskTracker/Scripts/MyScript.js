$(document).ready(function () {

    //>>>>>>>>>>>>>>>>> Global variable initialization on start <<<<<<<<<<<<<<<<<<<<<<<<<
    var host = window.location.host;
    var token = null;
    var headers = {};
    var tasksEndpoint = "/api/tasks";
    var projectsEndpoint = "/api/projects";

    var editingId;

    var tasksUrl = "http://" + host + tasksEndpoint;
    console.log(tasksUrl);
    var projectsUrl = "http://" + host + projectsEndpoint;

    $.getJSON(tasksUrl, loadMainEntity);
    $.getJSON(projectsUrl, getProjects);

    $("body").on("click", "#btnDelete", deleteTask);
    $("body").on("click", "#btnEdit", editTask);

    //>>>>>>>>>>>>>>>> Clean creation form <<<<<<<<<<<<<<

    function cleanForm() {
        $("#createInput1").val('');
        $("#createInput2").val('');
        $("#createInput3").val('');
        $("#createInput5").val('');

    }




    //>>>>>>>>>>>>>> Adding main entity(picture) <<<<<<<<<<<<<<<<<<<<<<<<<

    $("#create").submit(function (e) {

        e.preventDefault();



        var name = $("#createInput1").val();
        var author = $("#createInput2").val();
        var year = $("#createInput3").val();
        var galerie = $("#createInput4select").val();
        var price = $("#createInput5").val();

        $("#validationMsgInput1").empty();
        $("#validationMsgInput2").empty();
        $("#validationMsgInput3").empty();
        $("#validationMsgInput5").empty();




        if (token) {
            headers.Authorization = "Bearer " + token;
        }

        var dataCreate = {
            "Name": name,
            "Author": author,
            "MadeYear": year,
            "GaleryId": galerie,
            "Price": price,

        }
        httpAction = "POST";

        $.ajax({
            "url": tasksUrl,
            "type": httpAction,
            "data": dataCreate,
            "headers": headers
        })
            .done(function (data, status) {
                $.getJSON(tasksUrl, loadMainEntity);
                $("#createInput1").val('');
                $("#createInput2").val('');
                $("#createInput3").val('');
                $("#createInput5").val('');



            })
            .fail(function (data, status) {
                validation();
                //alert("Greska prilikom dodavanja!");
            })

    })


    //>>>>>>>>>>>>>>>> Load 2nd entity into dropdown menu-create form <<<<<<<<<<<<<<<<<<

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

    //>>>>>>>>>>>>>>>>>> Load table with main entity <<<<<<<<<<<<<<<<<<<<<<
    function loadMainEntity(data, status) {
        console.log("Status: " + status);
        $("#tableTasks").empty();



        var container = $("#tableTasks");
        container.empty();

        if (status == "success") {
            console.log(data);

            // ispis naslova
            var div = $("<div></div>");
            
            var h3 = $("<h3 class=\"text-center\">Tasks</h3>");
            var name = "Name";
            var id = "Id";
            var description = "Description";
            var deleteAction = "remove";
            var editAction = "view/edit";

            var head = $("<thead></thead>");
            var body = $("<tbody></tbody>");

            div.append(h3);

            var table = $("<table style=\"width: 600px; margin:auto\" border='1'  class=\"table table-hover text-center\" ></table>");
            var header = $("<tr style=\"background-color : lightblue; height:20px\"><th class=\"text-center\" style=\"width:100px\">" + id + "</th><th class=\"text-center\" style=\"width:250px\">" + name + "</th><th class=\"text-center\" style=\"width:200px\">" + description + "</th></tr>");
            head.append(header);
            table.append(head);
            table.append(body);


            for (i = 0; i < data.length; i++) {

                // prikazujemo novi red u tabeli
                var row = "<tr style=\"height:20px\">";
                // prikaz podataka
                var displayData = "<td>" + data[i].Id + "</td><td>" + data[i].Name + "</td><td>" + data[i].Description + "</td>";
                // prikaz dugmadi za izmenu i brisanje
                var stringId = data[i].Id.toString();
                console.log(stringId);
                var displayDelete = "<td><a href=\"#\" id=btnDelete name=" + stringId + ">[" + deleteAction + "]</a></td>";
                var displayEdit = "<td><a href=\"#\" id=btnEdit  name=" + stringId + ">[" + editAction + "]</a></td>";



                row += displayData + displayDelete + displayEdit + "</tr>";
                body.append(row);
                //table.append(row);

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

    //>>>>>>>>>>>>>>>>>>>> Removing entry from table od button delete <<<<<<<<<<<<<<<<<<<<<<<
    function deleteTask() {
        var deleteId = this.name;
        console.log(this.name);
        httpAction = "DELETE";

        var tasksUrl = "http://" + host + tasksEndpoint;
        $.ajax({
            "url": tasksUrl + "?id=" + deleteId,
            "type": httpAction

        })
            .done(function (data, status) {
                tasksUrl = "http://" + host + tasksEndpoint;
                $.getJSON(tasksUrl, loadMainEntity);

            })
            .fail(function (data, status) {

                alert("Greska prilikom brisanja proizvoda!")
            })

    };

    //>>>>>>>>>>>>>>>>>>>>>>>>> Edit entity fill form <<<<<<<<<<<<<<<<<<<<<<
    function editTask() {
        var editId = this.name;
        var editTaskUrl = tasksUrl + "/" + editId.toString();
        console.log(editTaskUrl);
        //$("#validationMsgInput1").empty();
        //$("#validationMsgInput2").empty();
        //$("#validationMsgInput3").empty();
        //$("#validationMsgInput5").empty();
        //$("#validationMsgInput6").empty();

        $.ajax({
            "url": editTaskUrl,
            "type": "GET"
        })
            .done(function (data, status) {
                editingId = data.Id;
                $("#createInput1").val(data.Name);
                $("#createInput4select").val(data.ProjectId);
                $("#createInput2").val(data.Description);
                $("#createInput3select").val(data.Status);
                $("#createInput5").val(data.Priority);
                $("#createInput6").val(data.Price);
                //$("#addEdit").empty().text("Izmeni");

                //$("#editForm").removeClass("hidden");
                httpAction = "Update";
                console.log(data);
            })
            .fail(function (data, status) {
                alert("Greska prilikom dobavljanja nekretnine!");
            })



    };

    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Create/Edit Form for submit <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<    

    $("#create").submit(function (e) {
        e.preventDefault();
        if (token) {
            headers.Authorization = "Bearer " + token;
        }

        var createEditUrl = tasksUrl;
        var data = {
            "Id": editingId,
            "Name": $("#createInput1").val(),
            "CategoryId": $("#createInput4select").val(),
            //"Year": $("#createInput2").val(),
            //"Pass": $("#createInput3").val(),
            //"Quadrature": $("#createInput5").val(),
            "Price": $("#createInput6").val()
        };
        if (httpAction === "Create") {
            type = "POST";

            data = {
                "Name": $("#createInput1").val(),
                "CategoryId": $("#createInput4select").val(),
                "Price": $("#createInput6").val()
            };
        }
        else {
            type = "PUT";
            createEditUrl += "?id=" + editingId;
        }
        $.ajax({
            "url": createEditUrl,
            "type": type,
            "data": data,
            "headers": headers
        })
            .done(function (data) {
                //$("#editForm").addClass("hidden");
                $("#createInput1").val('');
                //$("#createInput2").val('');
                //$("#createInput3").val('');
                //$("#createInput5").val('');
                $("#createInput6").val('');
                //$("#createInput4select").val('');
                $("#addEdit").empty().text("Dodaj");


                $.getJSON(tasksUrl, loadMainEntity);
                httpAction = "Create";


            })
            .fail(function (data, status) {
                validation();
                //alert("Greška prilikom izmene!");
            });
    });

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