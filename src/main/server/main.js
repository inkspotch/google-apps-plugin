var logger = require('./logger.js');

global.Configuration = require('./configuration');

var keys = {
    files: "files"
};

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

global.addDocument = function (name, id) {
    var fileNames = getLinkedDocuments();
    fileNames[name] = id;

    Logger.log('add document ' + name + ' ' + id);

    PropertiesService.getDocumentProperties()
        .setProperty(keys.files, JSON.stringify(fileNames));
};

global.log = function(message) {
    logger.log(message);
};

global.clearDocuments = function () {
    PropertiesService.getDocumentProperties()
        .deleteProperty(keys.files);
};

global.getLinkedDocuments = function () {
    var docProperties = PropertiesService.getDocumentProperties();
    var property = docProperties.getProperty(keys.files);

    try {
        return property ? JSON.parse(property) : {};
    } catch (e) {
        Logger.log('getLinkedDocuments failed: ' + e);
        return {};
    }
};

