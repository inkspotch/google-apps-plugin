var assert = require('assert');
var sinon = require('sinon');
var logger = require('../main/server/logger');
var googleApps = require('../main/server/google-apps');
var documents = require('../main/server/documents');

var sandbox;

beforeEach(function () {
    sandbox = sinon.sandbox.create();
});

afterEach(function () {
    sandbox.restore();
});

describe('store document in properties service', function () {
    it('should save the document in an array', function () {
        var storedDocuments = {};

        logger.log = sandbox.stub();

        sandbox.stub(googleApps, 'propertiesService', function () {
            return {
                getDocumentProperties: function () {
                    return {
                        getProperty: function () {
                            return JSON.stringify(storedDocuments);
                        },
                        setProperty: function (key, documents) {
                            storedDocuments = JSON.parse(documents);
                        }
                    }
                }
            };
        });

        sandbox.stub(googleApps, 'documentApp', function () {
            return {
                openById: function (fileId) {
                    return {
                        getName: function () {
                            return "test-document-" + fileId;
                        }
                    };
                }
            }
        });

        var fileId = 1;

        documents.add(fileId);
        documents.add(fileId + 1);

        assert.equal(Object.keys(storedDocuments).length, 2);
    });

    it('should get all documents from the properties service', function () {
        var storedDocuments = {
            'file_id_1': 'file_name_1'
        };

        var file = {
            makeCopy: function (name) {
                return this;
            },
            getId: function () {
                return "new-file-id";
            }
        };

        sandbox.stub(googleApps, 'propertiesService', function () {
            return {
                getDocumentProperties: function () {
                    return {
                        getProperty: function () {
                            return JSON.stringify(storedDocuments);
                        },
                        setProperty: function (key, documents) {
                            storedDocuments = JSON.parse(documents);
                        }
                    }
                }
            };
        });

        sandbox.stub(googleApps, 'driveApp', function () {
            return {
                getFileById: function () {
                    return file;
                }
            }
        });

        var document = documents.getAll()[0];

        assert.equal(document.fileId, 'file_id_1');
        assert.equal(document.fileName, 'file_name_1');
        assert.ok(document.generateOutput);
    });
});
