var routeURL = location.protocol + "//" + location.host;
$(document).ready(function () {
    $("#appointmentDate").kendoDateTimePicker({
        value: new Date(),
        dateInput: false,
        
    });
    InitializeCalendar();
});
var calendar;

function InitializeCalendar() {
    try {

        var calendarEl = document.getElementById('calendar');
        if (calendarEl != null) {
            calendar = new FullCalendar.Calendar(calendarEl,
                {
                    initialView: 'dayGridMonth',
                    headerToolbar: {
                        left: 'prev,next,today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    },
                    
                    selectable: true,
                    editable: false,
                    select: function (event) {
                        onShowModal(event, null)
                    },
                    eventDisplay: 'block',
                    events: function (fetchInfo, successCallback, failureCallback) {
                        $.ajax({
                            url: routeURL + '/Api/Appointment/GetCalendarData?doctorId=' + $("#doctorId").val(),
                            type: 'GET',
                            dataType: 'JSON',
                            success: function (response) {
                                var events = [];
                                if (response.status === 1) {
                                    $.each(response.dataenum, function (i, data) {
                                        events.push({
                                            title: data.title,

                                            description: data.description,
                                            start: data.startDate,
                                            end: data.endDate,
                                            backgroundColor: data.isDoctorApproved ? "#28a745" : "#dc3545",
                                            borderColor: "#162466",
                                            textColor: "white",
                                            id: data.id

                                        });
                                    })
                                }
                                successCallback(events);
                            },
                            error: function (xhr) {
                                $.notify("Error", "error");
                            }
                        });
                    },
                    eventClick: function (info) {
                        getEventDetailsByEventId(info.event);
                    }
                });
            calendar.render();
        }

    } catch (e) {
        if (e instanceof TypeError) {
            printError(e, true);
        } else {
            printError(e, false);
        }
    }

}


function onShowModal(obj, isEventDetail) {
    if (isEventDetail != null) {

        $("#title").val(obj.title);
        $("#description").val(obj.description);
        $("#appointmentDate").val(obj.startDate);
        $("#duration").val(obj.duration);
        $("#doctorId").val(obj.doctorId);
        $("#patientId").val(obj.patientId);
        $("#id").val(obj.id);
        $("#lblPatientName").html(obj.patientName);
        $("#lblDoctorName").html(obj.doctorName);
        if (obj.isDoctorApproved ) {
            $("#lblStatus").html('Approved');
            $("#btnConfirm").addClass("d-none");
            $("#btnSubmit").addClass("d-none");
        }
        else {
            $("#lblStatus").html('Pending');
            $("#btnConfirm").removeClass("d-none");
            $("#btnSubmit").removeClass("d-none");
        }
        $("#btnDelete").removeClass("d-none");

    }
    else {
        $("#appointmentDate").val(obj.startStr + " " + new moment().format("hh:mm A"));
        $("#id").val(0);
        $("#btnDelete").addClass("d-none");
        $("#btnSubmit").removeClass("d-none");
    }
    $("#appointmentInput").model("show");
}

function onCloseModal() {
    $("#appointmentForm")[0].reset();
    $("#id").val(0);
    $("#title").val('');
    $("#description").val('');
    $("#appointmentDate").val('');
    

    $("#appointmentInput").model("hide");
}

function onSubmitForm() {
    if (checkValidation()) {

        var requestData = {
            Id: parseInt($("#id").val()),
            Title: $("#title").val(),
            Description: $("#description").val(),
            StartDate: $("#appointmentDate").val(),
            Duration: $("#duration").val(),
            DoctorId: $("#doctorId").val(),
            PatientId: $("#patientId").val(),
        }

        $.ajax({
            url: routeURL + '/Api/Appointment/SaveCalendarData',
            type: 'POST',
            data: JSON.stringify(requestData),
            contentType: 'application/json',
            success: function (response) {
                if (response.status === 1 || response.status === 2) {
                    calendar.refetchEvents();
                    $.notify(response.message, "success");
                    onCloseModel();
                }
                else {
                    $.notify(response.message, "error");
                }
            },
            error: function (xhr) {
                $.notify("Error", "error");
            }
        });

    }

    function checkValidation() {
        var isValid = true;
        if ($("#title").val() === undefined || $("#title").val()==="") {
            isValid = false;
            $("#title").addClass('error');
        }
        else {
            $("#title").removeClass('error');
        }

        if ($("#appointmentDate").val() === undefined || $("#appointmentDate").val() === "") {
            isValid = false;
            $("#appointmentDate").addClass('error');
        }
        else {
            $("#appointmentDate").removeClass('error');
        }

        return isValid;
    }
}
function getEventDetailsByEventId(info) {
    $.ajax({
        url: routeURL + '/Api/Appointment/GetCalendarDataById/' + info.id,
       
        success: function (response) {
           
            if (response.status === 1 && response.dataenum !== undefined) {
                onShowModal(response.dataenum, true);
            }
            successCallback(events);
        },
        error: function (xhr) {
            $.notify("Error", "error");
        }
    });
}

function onDoctorChange() {
    calendar.refetchEvents();
}

function onDeleteAppointment() {
    var id = parseInt($("#id").val());
    $.ajax({
        url: routeURL + '/Api/Appointment/DeleteAppointment/' + id,

        success: function (response) {

            if (response.status === 1) {
                $.notify(response.message, "success");
                calendar.refetchEvents();
                onCloseModal();
            }
            else {
                $.notify(response.message, "error");
            }
        },
        error: function (xhr) {
            $.notify("Error", "error");
        }
    });
}

function onConfirm() {
    var id = parseInt($("#id").val());
    $.ajax({
        url: routeURL + '/Api/Appointment/ConfirmEvent/' + id,

        success: function (response) {

            if (response.status === 1) {
                $.notify(response.message, "success");
                calendar.refetchEvents();
                onCloseModal();
            }
            else {
                $.notify(response.message, "error");
            }
        },
        error: function (xhr) {
            $.notify("Error", "error");
        }
    });
}