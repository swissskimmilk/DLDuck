document.querySelector('#add-submit').onclick = function () {

    //clear previous alerts
    document.querySelector('#alert').innerHTML = '';

    //error checking all fields 
    if (document.querySelector('#add-name').value.length == 0)
    {
        createAlert("Must enter class name!")
        return;
    }

    else if (document.querySelector('#add-date').value.length == 0) {
        createAlert("Must enter class start date!")
        return;
    }

    else if (document.querySelector('#add-time').value.length == 0) {
        createAlert("Must enter class time!")
        return;
    }

    else if (document.querySelector('#add-frequency').value.length == 0) {
        createAlert("Must enter class frequency!")
        return;
    }

    else if (document.querySelector('#add-link').value.length == 0) {
        createAlert("Must enter class link!")
        return;
    }

    //get array of classes
    chrome.storage.local.get({ classes: [] }, function (result) {

        //store current value
        var classes = result.classes;

        //get html elements 
        var name = document.querySelector('#add-name').value;
        if (name.includes(",")) {
            createAlert("Name can not include commas")
            return;
        }

        var date = document.querySelector('#add-date').value;
        var time = document.querySelector('#add-time').value;
        var frequency = document.querySelector('#add-frequency').value;
        var link = document.querySelector('#add-link').value;
        var days = [document.querySelector('#sun').checked,
            document.querySelector('#mon').checked,
            document.querySelector('#tues').checked,
            document.querySelector('#weds').checked,
            document.querySelector('#thurs').checked,
            document.querySelector('#fri').checked,
            document.querySelector('#sat').checked]
        var newClass = [name, date, time, frequency, link, days];
        console.log(newClass)
        for (var i = 0; i < classes.length; i++) {
            if (name == classes[i][0]) {
                createAlert("Each class must use a unique name!")
                return;
            }
        }

        classes.push(newClass);

        //create datetime string 
        var currentTime = new Date();
        var builtString = date + "T" + time + ":00";
        var mainAlarmName = "main," + name;
        var datetime = new Date(builtString);
        var notifAlarmName = "notif," + name;

        //check if datetime is valid 
        if (days[datetime.getDay()] == false) {
            createAlert("Class start date must be on a selected day of the week!");
            return;
        }
        if (datetime < currentTime) {
            createAlert("Class must start in the future!");
            return;
        }

        //add alarms 
        createAlarms(mainAlarmName, datetime, days, frequency);
        chrome.storage.local.get({ notificationSettings: null }, function (result) {
            if (result.notificationSettings == null) {
                return;
            }
            var notifAlarmDateTime = new Date(datetime.getTime() - result.notificationSettings * 60000);
            createAlarms(notifAlarmName, notifAlarmDateTime, days, frequency);
        })

        //store classes array
        chrome.storage.local.set({ classes: classes })

        //redirect to home
        window.location.href = 'classes.html';
    });
}

//creates alerts
function createAlert(text) {
    var alert = document.querySelector('#alert');
    var div = document.createElement('div')
    div.className = "custom-alert";
    var textNode = document.createTextNode(text)
    alert.appendChild(div).appendChild(textNode);
}