var logger = require('./logger.js');
var googleApps = require('./google-apps.js');

var KEY_DOCUMENTS = "files";
var tagRegex = /{.*?}/g;



function getDocuments(property) {
    var files = JSON.parse(property);
    var documents = [];

    for(var fileId in files) if (files.hasOwnProperty(fileId)) {
        documents.push({
            fileId: fileId,
            fileName: files[fileId],
            generateOutput: function (sheet) {
                var document = googleApps.documentApp().openById(fileId);
                var tags = document.getBody().getText().match(tagRegex);
                logger.log("Tags: " + tags.join(", "));

                var newId = googleApps.driveApp().getFileById(fileId).makeCopy(this.fileName + '-Output').getId();
                document = googleApps.documentApp().openById(newId);

                for(var i in tags) {
                    var cellName = tags[i].substring(1, tags[i].length - 1);
                    var data = sheet.getRange(cellName).getValue();
                    document.getBody().replaceText(tags[i], data);
                }
            }
        });
    }

    return documents;
}

function getAll() {
    var docProperties = googleApps.propertiesService().getDocumentProperties();
    var property = docProperties.getProperty(KEY_DOCUMENTS);

    try {
        return property ? getDocuments(property) : [];
    } catch (e) {
        logger.log('getLinkedDocuments failed: ' + e);
        return [];
    }
}

exports.getAll = getAll;

exports.add = function (fileId) {
    var docProperties = googleApps.propertiesService().getDocumentProperties();
    var documents = JSON.parse(docProperties.getProperty(KEY_DOCUMENTS)) || {};

    var document = googleApps.documentApp().openById(fileId);
    documents[fileId] = document.getName();

    docProperties.setProperty(KEY_DOCUMENTS, JSON.stringify(documents));
};


