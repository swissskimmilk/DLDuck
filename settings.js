//update whether the user has visited the page
chrome.storage.local.set({ visitedSettings: true })

//save settings
document.querySelector('#settings-save').onclick = function () {

    //clear previous alerts
    document.querySelector('#alert').innerHTML = '';

    var checked = document.querySelector('#auto-open').checked;
    chrome.storage.local.set({ autoOpen: checked })

    var select = document.querySelector('#notifications').value;
    chrome.storage.local.get({ notificationSettings: null }, function (result) {
        if (select != result.notificationSettings)
            createAlert("Notification setting changes only apply to new classes, with the exception of 'Never', which apply to all classes!");
    })
    chrome.storage.local.set({ notificationSettings: select })

    createSuccess("Saved!");
}

//update settings html
window.onload = function () {
    chrome.storage.local.get({ autoOpen: [] }, function (result) {
        document.querySelector('#auto-open').checked = result.autoOpen;
    })
    chrome.storage.local.get({ notificationSettings: [] }, function (result) {
        document.querySelector('#notifications').value = result.notificationSettings;
    })
}

//creates alerts
function createAlert(text) {
    var alert = document.querySelector('#alert');
    var div = document.createElement('div')
    div.className = "custom-alert";
    var textNode = document.createTextNode(text)
    alert.appendChild(div).appendChild(textNode);
}

//create success message
function createSuccess(text) {
    var alert = document.querySelector('#alert');
    var div = document.createElement('div')
    div.className = "custom-success-alert";
    var textNode = document.createTextNode(text)
    alert.appendChild(div).appendChild(textNode);
}