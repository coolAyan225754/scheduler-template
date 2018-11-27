$(document).ready(function () {


    var hourList = [];
    var minuteList = [];
    var hourMinuteList = [];
    var theme = "material";

    // Prepare the data
    var source =
    {
        dataType: "array",
        dataFields: [
            { name: 'id', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'subject', type: 'string' },
            { name: 'calendar', type: 'string' },
            { name: 'start', type: 'date' },
            { name: 'end', type: 'date' }
        ],
        id: 'id',
        localData: []
    };
    var isFirstLoad = true;
    var adapter = new $.jqx.dataAdapter(source);
    $("#scheduler").jqxScheduler({
        date: new $.jqx.date(),
        width: 850,
        height: 600,
        source: adapter,
        theme: theme,
        view: 'weekView',
        showLegend: true,
        // Called when the dialog is craeted.
        editDialogCreate: function (dialog, fields, editAppointment) {
            // Hide location option
            fields.locationContainer.hide();
            fields.resourceContainer.hide();
            // Hide to option
            fields.toContainer.hide();
            // Hide color option
            fields.colorContainer.hide();
            // Hide All Day option
            fields.allDayContainer.hide();
            // Hide Status Container
            fields.statusContainer.hide();
            //Fields.OwnerContainer.hide();
            fields.fromLabel.html("Start");
            fields.subjectLabel.html("Template");
            var itemToRemove = fields.repeat.jqxDropDownList('getItemByValue', "Never");
            var items = fields.repeat.jqxDropDownList('getItems');
            console.log(items);
            fields.repeat.jqxDropDownList('removeItem', items[4]);
            fields.repeat.jqxDropDownList('addItem', { label: 'Hourly', value: 'Hourly' })
            fields.repeat.jqxDropDownList('addItem', { label: 'Minutes', value: 'Minutes' })
            fields.repeat.jqxDropDownList('updateItem', { label: "Select Recurrence", value: "Select Recurrence" }, "Never");
            var hourField = ''
            var minuteField = ""
            var labelField = ""
            hourField += "<div id='hour'>"
            hourField += "<div class='jqx-scheduler-edit-dialog-label'>Hours</div>"
            hourField += "<div class='jqx-scheduler-edit-dialog-field'><input type='number' id='hour' />"
            hourField += "<button id='addHour'  style='margin-left: 5px; float:right;border-radius:10px;'>Add</button></div>"
            hourField += "</div>"
            minuteField += "<div id='minute'>"
            minuteField += "<div class='jqx-scheduler-edit-dialog-label'>Minutes</div>"
            minuteField += "<div class='jqx-scheduler-edit-dialog-field'><input type='number' min='0' id='minute' step='5' />"
            minuteField += "<button id='addMinutes'  style='margin-left: 5px; float:right;border-radius:10px;'>Add</button></div>"
            minuteField += "</div>"
            labelField += "<div id='scheduleLabel'>"
            labelField += "<div class='jqx-scheduler-edit-dialog-label'>Execution Times</div>"
            labelField += "<div class='jqx-scheduler-edit-dialog-field'><span id='recurrenceLabel'></span>"
            labelField += "<button id='clearLabel'  style='margin-left: 5px; float:right;border-radius:10px;'>Clear</div>"
            labelField += "</div>"
            var i = 0;
            $('#dialogscheduler').children('div').each(function () { // Loop trough the div's (only first level childs) elements in dialogscheduler
                i += 1;
                if (i == 7) { // places the field in the third position.
                    $(this).after(labelField);
                    $(this).after(minuteField);
                    $(this).after(hourField);
                    $('#hour').hide();
                    $('#minute').hide();
                    $('#scheduleLabel').hide();
                };
            });
        },
        /**
         * Called when the dialog is opened. Returning true as a result disables the built-in handler.
         * @param {Object} dialog - jqxWindow's jQuery object.
         * @param {Object} fields - Object with all widgets inside the dialog.
         * @param {Object} the Selected appointment instance or NULL when the dialog is opened from cells selection.
         */
        editDialogOpen: function (dialog, fields, editAppointment) {
            var firstChange = true;
            fields.repeat.on('change', function (event) {
                var args = event.args;
                if (args) {
                    // Index represents the item's index.                      
                    var index = args.index;
                    var item = args.item;
                    // Get item's label and value.
                    var label = item.label;
                    var value = item.value;
                    var type = args.type; // keyboard, mouse or null depending on how the item was selected.
                    if (value === 'Daily' || value === 'Monthly' || value === 'Weekly') {
                        $('#hour').show();
                        $('#minute').show();
                        $('#scheduleLabel').show();
                        $('#addHour').jqxButton({ theme: theme, disabled: true });
                        $('#addMinutes').jqxButton({ theme: theme, disabled: true });
                        $('#clearLabel').jqxButton({ theme: theme });                       
                    }
                    else {
                        $('#hour').hide();
                        $('#minute').hide();
                        $('#scheduleLabel').hide();
                    }
                    if (value == "Hourly") {
                        var j = 0;
                        fields.yearly.panel.hide();
                        var hourlyField = ""
                        hourlyField += "<div id='hourly'>"
                        hourlyField += "<div class='jqx-scheduler-edit-dialog-label jqx-scheduler-edit-dialog-label-material'>Repeat Every</div>"
                        hourlyField += "<div class='jqx-scheduler-edit-dialog-field jqx-scheduler-edit-dialog-field-material'><div id='hourlyField' style='float: left; width: 48px; height: 23px;'></div> <div style='float: left; margin-left: 5px; line-height:25px;'>hour(s)</div></div>"
                        $("#minField").hide();
                        $('#dialogscheduler').children('div').each(function () {//Loop trough the div's (only first level childs) elements in dialogscheduler
                            j += 1;
                            if (j == 7) { // places the field in the third position.
                                $(this).after(hourlyField);
                            };
                        });

                        $("#hourlyField").jqxNumberInput({ theme: theme, height: '23px', width: '48px', spinButtons: true, inputMode: 'simple', min: 1, max: 99999, decimalDigits: 0 });
                        $('#hourlyField').val(1);
                    }

                    else if (value == "Minutes") {
                        var k = 0;
                        var minField = "";
                        minField += "<div id='minField'>"
                        minField += "<div class='jqx-scheduler-edit-dialog-label jqx-scheduler-edit-dialog-label-material'>Repeat Every</div>"
                        minField += "<div class='jqx-scheduler-edit-dialog-field jqx-scheduler-edit-dialog-field-material'><div id='minuteField' style='float: left; width: 48px; height: 23px;'></div> <div style='float: left; margin-left: 5px; line-height:25px;'>minute(s)</div></div>"
                        $("#hourly").hide();
                        $('#dialogscheduler').children('div').each(function () { // Loop trough the div's (only first level childs) elements in dialogscheduler
                            k += 1;
                            if (k == 7) { 
                                $(this).after(minField);
                            };
                        });
                        $("#minuteField").jqxNumberInput({ theme: theme, height: '23px', width: '48px', spinButtons: true, inputMode: 'simple', min: 1, max: 99999, decimalDigits: 0 });
                        $('#minuteField').val(1);
                    }
                    else{
                        $("#minField").hide();
                        $("#hourly").hide();
                    }
                }
            });
            $('#dialogscheduler > div').find('#hour').val(0);
            $('#dialogscheduler > div').find('#minute').val(0);
            $('#dialogscheduler > div').find('#from').val('');
            $('#dialogscheduler > div').find('#description').val('');
        },
        /**
         * Called when the dialog is closed.
         * @param {Object} dialog - jqxWindow's jQuery object.
         * @param {Object} fields - Object with all widgets inside the dialog.
         * @param {Object} the selected appointment instance or NULL when the dialog is opened from cells selection.
         */
        editDialogClose: function (dialog, fields, editAppointment) {
        },
        /**
        * Called when a key is pressed while the dialog is on focus. Returning true or false as a result disables the built-in keyDown handler.
        * @param {Object} dialog - jqxWindow's jQuery object.
        * @param {Object} fields - Object with all widgets inside the dialog.
        * @param {Object} the selected appointment instance or NULL when the dialog is opened from cells selection.
        * @param {jQuery.Event Object} the keyDown event.
        */
        editDialogKeyDown: function (dialog, fields, editAppointment, event) {
        },

        ready: function () {
            $("#scheduler").jqxScheduler('openDialog');
            $("#scheduler").css("visibility", "hidden");
        },
        resources:
        {
            colorScheme: "scheme05",
            dataField: "calendar",
            source: new $.jqx.dataAdapter(source)
        },
        appointmentDataFields:
        {
            from: "start",
            id: "id",
            description: "description",
            location: "place",
            subject: "subject",
            resourceId: "calendar",
            recurrencePattern: "recurrencePattern",
            timeZone: "timeZone"
        },
        views:
            [
                'dayView',
                'weekView',
                'monthView'
            ]
    });
    $('#scheduler').on('appointmentAdd', function (event) {
        var myObject = new Object();
        myObject.USER_NAME = "sapuser";
        myObject.UPDATED_ON = Date.today();
        myObject.TEMPLATE_NAME = "TEMPLATE NAME NEW";
        myObject.TABLE_CONFIG_ID = "1";
        myObject.FREQUENCY = event.args.appointment.recurrencePattern.freq;
        myObject.FREQUENCY_ID = "1";
        myObject.START_DATE = Date.parse(event.args.appointment.from.toString()).toString('d-MMM-yyyy');
        myObject.START_TIME = Date.parse(event.args.appointment.from.toString()).toString("HH:mm");
        myObject.TIME_ZONE = event.args.appointment.timeZone;
        myObject.HAS_ADVANCED_SHCEDULE = "true";
        myObject.INTERVAL = event.args.appointment.recurrencePattern.interval;
        myObject.END_AFTER_OCCURANCES = event.args.appointment.recurrencePattern.count;
        if (myObject.FREQUENCY === 'daily') {
            var recurrenceObject = new Object();
            recurrenceObject.SELECTED_HOUR = hourList;
            recurrenceObject.SELECTED_MINUTE = minuteList;
            myObject.DAILY_SETTING = recurrenceObject;
            myObject.WEEKLY_SETTING = [];
            myObject.MONTHLY_SETTING = [];
        }
        if (myObject.FREQUENCY === 'weekly') {
            myObject.WEEKLY_SETTING = [];
            for (i = 0; i < event.args.appointment.recurrencePattern.byweekday.length; i++) {
                var weekDayObject = new Object();
                weekDayObject.WEEK_DAY_LOV_ID = event.args.appointment.recurrencePattern.byweekday[i] + 1;
                myObject.WEEKLY_SETTING.push(weekDayObject);

            }
            var recurrenceObject = new Object();
            recurrenceObject.SELECTED_HOUR = hourList;
            recurrenceObject.SELECTED_MINUTE = minuteList;
            myObject.DAILY_SETTING = recurrenceObject;
            myObject.MONTHLY_SETTING = [];
        }
        if (myObject.FREQUENCY === 'monthly') {
            myObject.MONTHLY_SETTING = [];
            var monthdayObject = new Object();
            if (event.args.appointment.recurrencePattern.bymonthday !== null) {
                monthdayObject.MONTHLY_OCCURANCES = "MONTH_DAYS";
                monthdayObject.WEEK_DAY_LOV_ID = [];
                monthdayObject.WEEK_OCCURANCE_LOV_ID = [];
                monthdayObject.SELECTED_DAY_OF_THE_MONTH = event.args.appointment.recurrencePattern.bymonthday;
            }
            else {
                monthdayObject.MONTHLY_OCCURANCES = "WEEK_DAYS";
                monthdayObject.SELECTED_DAY_OF_THE_MONTH = [];
                monthdayObject.WEEK_DAY_LOV_ID = [(event.args.appointment.recurrencePattern.bynweekday[0])[0] + 1];
                monthdayObject.WEEK_OCCURANCE_LOV_ID = [(event.args.appointment.recurrencePattern.bynweekday[0])[1]];
            }
            myObject.MONTHLY_SETTING.push(monthdayObject);
            var recurrenceObject = new Object();
            recurrenceObject.SELECTED_HOUR = hourList;
            recurrenceObject.SELECTED_MINUTE = minuteList;
            myObject.DAILY_SETTING = recurrenceObject;
            myObject.WEEKLY_SETTING = [];
        }
        var jsonOutput = JSON.stringify(myObject);
        console.log(jsonOutput);
    });
    $('#addHour').on('click', function () {
        var hour = $('#dialogscheduler > div').find('#hour').val();
        hourList.push(hour);
        console.log(hourList);
        if (minuteList.length == 0) {
            var value = hour + ":00"
            if (hourMinuteList.indexOf(value) === -1)
                hourMinuteList.push(value);
        }
        else {
            hourMinuteList = [];
            for (i = 0; i < hourList.length; i++) {
                for (j = 0; j < minuteList.length; j++) {
                    var val = hourList[i] + ":" + minuteList[j];
                    if (hourMinuteList.indexOf(val) === -1)
                        hourMinuteList.push(val);
                }
            }
        }
        console.log(hourMinuteList);
        var text = '';
        for (k = 0; k < hourMinuteList.length; k++) {
            if (text === '')
                text = hourMinuteList[k];
            else
                text = text + ", " + hourMinuteList[k];
        }
        $('#recurrenceLabel').text(text);
        $('#dialogscheduler > div').find('#hour').val(0);
        $('#addHour').jqxButton({ disabled: true });
    });
    $('#addMinutes').on('click', function () {
        var minute = $('#dialogscheduler > div').find('#minute').val();
        minuteList.push(minute);
        console.log(minuteList);
        if (hourList.length == 0) {
            var value = "0:" + minute;
            if (hourMinuteList.indexOf(value) === -1)
                hourMinuteList.push(value);

        }
        else {
            hourMinuteList = [];
            for (i = 0; i < hourList.length; i++) {
                for (j = 0; j < minuteList.length; j++) {
                    var val = hourList[i] + ":" + minuteList[j];
                    if (hourMinuteList.indexOf(val) === -1)
                        hourMinuteList.push(val);
                }
            }
        }
        console.log(hourMinuteList);
        var text = '';
        for (k = 0; k < hourMinuteList.length; k++) {
            if (text === '')
                text = hourMinuteList[k];
            else
                text = text + ", " + hourMinuteList[k];
        }
        $('#recurrenceLabel').text(text);
        $('#dialogscheduler > div').find('#minute').val(0);
        $('#addMinutes').jqxButton({ disabled: true });
    });

    $('#clearLabel').on('click', function () {
        hourList = [];
        minuteList = [];
        hourMinuteList = [];
        text = '';
        $('#recurrenceLabel').text(text);
        $('#dialogscheduler > div').find('#hour').val(0);
        $('#dialogscheduler > div').find('#minute').val(0);
    });

    $('#dialogscheduler > div').find('#hour').on("propertychange change keyup paste input", function () {
        if ($(this).val.length != 0) {
            $('#addHour').jqxButton({ disabled: false });
        }
    });
    $('#dialogscheduler > div').find('#minute').on("propertychange change keyup paste input", function () {
        if ($(this).val.length != 0) {
            $('#addMinutes').jqxButton({ disabled: false });
        }
    });
});