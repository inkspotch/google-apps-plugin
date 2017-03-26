var assert = require('assert');
var sinon = require('sinon');
var sinonTest = require('sinon-test');
var logger = require('../main/server/logger');
var googleApps = require('../main/server/google-apps');
var documents = require('../main/server/documents');

sinon.test = sinonTest.configureTest(sinon);

describe('store document in properties service', function () {
    it('should save the document in an array', sinon.test(function () {
        var storedDocuments = {};

        logger.log = {};

        this.stub(googleApps, 'propertiesService').callsFake(function () {
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

        this.stub(googleApps, 'documentApp').callsFake(function () {
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
    }));

    it('should get all documents from the properties service', sinon.test(function () {
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

        this.stub(googleApps, 'propertiesService').callsFake(function () {
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

        this.stub(googleApps, 'driveApp').callsFake(function () {
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
    }));
});
