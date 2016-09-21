
var Configuration = function() {
    var configuration = {
        debug: false
    };

    if (provideEnvironmentConfiguration !== 'undefined') {
        configuration = provideEnvironmentConfiguration(configuration);
    }

    return {
        getCurrent: function() {
            return configuration;
        }
    };
}();