window.onload = function wait() {
    chrome.storage.local.get({ classes: [] }, function (result) {

        //check if classes are missing 
        if (result.classes.length == 0) {
            createAlert("You must add a class!");
        }

        //main loop
        for (var i = 0; i < result.classes.length; i++) {
            var row = document.createElement("tr");
            //nested loop
            for (var j = 0; j < 5; j++) {
                if (j == 1) {
                    //slice the string to remove the year 
                    slicedString = result.classes[i][j].slice(5);

                    var cell = document.createElement("td");
                    var textNode = document.createTextNode(slicedString);
                    row.appendChild(cell).appendChild(textNode);
                }
                else if (j == 4) {
                    var days = "";
                    if (result.classes[i][5][0] == true) {
                        if (days) {
                            days = days + "-";
                            days = days + "Sun";
                        }
                        else if (!days) {
                            days = "Sun";
                        }
                    }
                    if (result.classes[i][5][1] == true) {
                        if (days) {
                            days = days + "-";
                            days = days + "Mon";
                        }
                        else if (!days) {
                            days = "Mon";
                        }
                    }
                    if (result.classes[i][5][2] == true) {
                        if (days) {
                            days = days + "-";
                            days = days + "Tues";
                        }
                        else if (!days) {
                            days = "Tues";
                        }
                    }
                    if (result.classes[i][5][3] == true) {
                        if (days) {
                            days = days + "-";
                            days = days + "Weds";
                        }
                        else if (!days) {
                            days = "Weds";
                        }
                    }
                    if (result.classes[i][5][4] == true) {
                        if (days) {
                            days = days + "-";
                            days = days + "Thurs";
                        }
                        else if (!days) {
                            days = "Thurs";
                        }
                    }
                    if (result.classes[i][5][5] == true) {
                        if (days) {
                            days = days + "-";
                            days = days + "Fri";
                        }
                        else if (!days) {
                            days = "Fri";
                        }
                    }
                    if (result.classes[i][5][6] == true) {
                        if (days) {
                            days = days + "-";
                            days = days + "Sat";
                        }
                        else if (!days) {
                            days = "Sat";
                        }
                    }
                    var cell = document.createElement("td");
                    var textNode = document.createTextNode(days);
                    row.appendChild(cell).appendChild(textNode);
                }
                else {
                    var cell = document.createElement("td");
                    var textNode = document.createTextNode(result.classes[i][j]);
                    row.appendChild(cell).appendChild(textNode);
                }
            }
            //add buttons to the end of the row
            var visitCell = document.createElement("td");
            var visitButton = document.createElement("button");

            visitButton.className = "custom-btn blue-button";
            visitButton.id = "visit-button";
            visitButton.dataset.link = result.classes[i][4];
            visitButton.addEventListener("click", visit);

            var visitTextNode = document.createTextNode("Visit");
            row.appendChild(visitCell).appendChild(visitButton).appendChild(visitTextNode);

            var removeCell = document.createElement("td");
            var removeButton = document.createElement("button");

            removeButton.className = "custom-btn red-button";
            removeButton.id = "remove-button";
            removeButton.dataset.row = i;
            removeButton.addEventListener("click", remove);

            var removeTextNode = document.createTextNode("Remove");
            row.appendChild(removeCell).appendChild(removeButton).appendChild(removeTextNode);

            document.querySelector('#classes').appendChild(row);
        }
        getAllAlarms();
    })
}

function visit() {
    chrome.tabs.create({ url: this.dataset.link });
}

function remove() {
    var row = this.dataset.row;
    chrome.storage.local.get({ classes: [] }, function (result) {
        var classes = result.classes;
        clearAlarm(classes[row][0]);
        classes.splice(row, 1);
        chrome.storage.local.set({ classes: classes })
    })
    window.location.href = 'classes.html';
}

chrome.storage.local.get({ visitedSettings: [] }, function (result) {
    if (result.visitedSettings != true) {
        createAlert("Consider visiting the settings page!")
    }
})

//creates alerts
function createAlert(text) {
    var alert = document.querySelector('#alert');
    var div = document.createElement('div')
    div.className = "custom-alert";
    var textNode = document.createTextNode(text)
    alert.appendChild(div).appendChild(textNode);
}
