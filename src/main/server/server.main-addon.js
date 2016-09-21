var keys = {
    files: "files"
};

function onInstall(e) {
    onOpen(e);
}

function onOpen(e) {
    SpreadsheetApp.getUi().createAddonMenu()
        .addItem('Start', 'showSidebar')
        .addItem('Choose file', 'showPicker')
        .addToUi();
}

function showSidebar() {
    var ui = HtmlService.createTemplateFromFile('ui.sidebar')
        .evaluate()
        .setTitle('Data Link')
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);

    SpreadsheetApp.getUi().showSidebar(ui);
}

function showPicker() {
    var html = HtmlService.createHtmlOutputFromFile('ui.picker.html')
        .setWidth(600)
        .setHeight(425)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    SpreadsheetApp.getUi().showModalDialog(html, 'Select Folder');
}

function getOAuthToken() {
    DriveApp.getRootFolder();
    return ScriptApp.getOAuthToken();
}

function addDocument(name, id) {
    startLogger();

    var fileNames = getLinkedDocuments();
    fileNames[name] = id;

    Logger.log('add document ' + name + ' ' + id);

    PropertiesService.getDocumentProperties()
        .setProperty(keys.files, JSON.stringify(fileNames));
}

function clearDocuments() {
    PropertiesService.getDocumentProperties()
        .deleteProperty(keys.files);
}

function getLinkedDocuments() {
    var docProperties = PropertiesService.getDocumentProperties();
    var property = docProperties.getProperty(keys.files);

    try {
        return property ? JSON.parse(property) : {};
    } catch (e) {
        Logger.log('getLinkedDocuments failed: ' + e);
        return {};
    }
}
