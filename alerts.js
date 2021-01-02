chrome.alarms.onAlarm.addListener(function agh(alarm) {
    var alarmName = alarm.name;
    var splitString = alarmName.split(',')
    if (splitString[0] == "main") {
        chrome.storage.local.get({ autoOpen: [] }, function (autoOpen) {
            if (autoOpen.autoOpen == true) {
                chrome.storage.local.get({ classes: [] }, function (classes) {
                    var classes = classes.classes
                    for (var i = 0; i < classes.length; i++) {
                        if (classes[i][0] == splitString[1]) {
                            console.log("opening link")
                            chrome.tabs.create({ url: classes[i][4] })
                            return;
                        }
                    }
                })
            }
            else
                return;
        })
    }
    else if (splitString[0] == "notif") {
        chrome.storage.local.get({ notificationSettings: [] }, function (settings) {
            if (settings.notificationSettings == null) {
                return;
            }
            else {
                console.log("sending notif")
                createNotification("Class reminder", splitString[1] + " starts soon!")
            }
        })
    }
});

function createAlarms(name, datetime, weekdays, frequency) {
    var datetimeValue = datetime.valueOf();
    var i = datetime.getDay();
    var count = 0;
    while (true) {
        if (weekdays[i] == true) {
            var alarmName = name + "," + i;
            var alarmTime = datetime;
            alarmTime.setDate(datetime.getDate() + count);
            chrome.runtime.getBackgroundPage(function (bg) {
                if (frequency == "One time") {
                    bg.chrome.alarms.create(alarmName, { when: alarmTime.valueOf() })
                    bg.chrome.alarms.get(alarmName, function (alarm) {
                        console.log(alarm);
                    });
                }
                else if (frequency == "Weekly") {
                    bg.chrome.alarms.create(alarmName, { when: alarmTime.valueOf(), periodInMinutes: 10080 })
                    bg.chrome.alarms.get(alarmName, function (alarm) {
                        console.log(alarm);
                    });
                }
                else if (frequency == "Biweekly") {
                    bg.chrome.alarms.create(alarmName, { when: alarmTime.valueOf(), periodInMinutes: 10080*2 })
                    bg.chrome.alarms.get(alarmName, function (alarm) {
                        console.log(alarm);
                    });
                }
            });
        }
        count++;
        if (i < 6)
            i++;
        else
            i = 0;
        if (count == 6) {
            return;
        }
    }
}

function getAllAlarms() {
    chrome.runtime.getBackgroundPage(function (bg) {
        bg.chrome.alarms.getAll(function (alarm) {
            console.log(alarm);
        });
    });
}

function clearAlarm(name) {
    chrome.runtime.getBackgroundPage(function (bg) {
        bg.chrome.alarms.getAll(function (alarm) {
            for (var i = 0; i < alarm.length; i++) {
                var splitString = alarm[i].name.split(',')
                if (splitString[1] == name) 
                    bg.chrome.alarms.clear(alarm[i].name);
            }
        });
    });
}

function createNotification(name, message) {
    chrome.runtime.getBackgroundPage(function (bg) {
        var options = {
            title: name,
            message: message,
            iconUrl: 'duck600.png',
            type: 'basic', 
        };
        bg.chrome.notifications.create('name', options);
    });
}