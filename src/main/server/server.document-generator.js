require('./logger.js');

(function (context) {
    context.isEndOfText_ = function (body, position) {
        var isEnd = position < body.length;

        Logger.log('position: ' + position + ' length: ' + body.length);
        Logger.log('isEnd: ' + isEnd);

        return isEnd;
    };

    context.hasElement_ = function (list, documentText) {
        var text;

        if (rangeElement) {
            text = body.findText('{.*?}', rangeElement);
        } else {
            text = body.findText('{.*?}');
        }

        return text;
    };

    context.profileFiles = function profileFiles() {
        startLogger();
        Logger.log('profileFiles was found');

        var files = getLinkedDocuments();

        for (var file in files) if (files.hasOwnProperty(file)) {
            var id = files[file];

            var text = DocumentApp.openById(id)
                .getBody()
                .getText();
        }
    };
})(module.exports);