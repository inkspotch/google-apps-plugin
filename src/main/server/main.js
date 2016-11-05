var logger = require('./logger.js');
var configuration = require('./configuration.js');
var google = require('./google-apps.js');
var documents = require('./documents');

global.Configuration = configuration;

global.onInstall = function (e) {
    onOpen(e);
};

global.onOpen = function (e) {
    SpreadsheetApp.getUi().createAddonMenu()
        .addItem('Start', 'showSidebar')
        .addItem('Choose file', 'showPicker')
        .addToUi();
};

global.showSidebar = function () {
    var ui = HtmlService.createTemplateFromFile('ui.sidebar')
        .evaluate()
        .setTitle('Data Link')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);

    SpreadsheetApp.getUi().showSidebar(ui);
};

global.showPicker = function () {
    var html = HtmlService.createHtmlOutputFromFile('ui.picker.html')
        .setWidth(600)
        .setHeight(425)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    SpreadsheetApp.getUi().showModalDialog(html, 'Select Folder');
};

global.getOAuthToken = function () {
    DriveApp.getRootFolder();
    return ScriptApp.getOAuthToken();
};

global.addDocument = function (id) {
    logger.log('add document ' + id);

    documents.add(id);
};

global.showTags = function() {
    var docs = documents.getAll();
    logger.log('documents: ' + JSON.stringify(docs));
    logger.log('documents: ' + JSON.stringify(docs[0]));

    for (var i = 0; i < docs.length; i++) {
        docs[i].generateOutput(google.spreadsheetApp().getActiveSheet());
    }
};

if(configuration.isDebug()) {
    global.reset = function () {
        google.propertiesService().getDocumentProperties()
            .deleteAllProperties();
    };
}
