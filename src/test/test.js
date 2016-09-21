var assert = require('assert');
var documentGenerator = require('../main/server/server.document-generator.js');

describe('Document generator', function() {
    describe('profileFiles', function() {
        it('should find all replaceable tokens', function() {
            DocumentApp = {
                openById: function (fileId) {
                    return {
                        getBody: function() {
                            return {
                                getText: function() {
                                    return "hello world";
                                }
                            }
                        }
                    };
                }
            };

            documentGenerator.profileFiles();
        });
    });
});