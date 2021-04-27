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
            for (var j = 0; j < 4; j++) {
                if (j == 1) {
                    //slice the string to remove the year 
                    slicedString = result.classes[i][j].slice(5);

                    var cell = document.createElement("td");
                    var textNode = document.createTextNode(slicedString);
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
