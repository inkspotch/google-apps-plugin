function startLogger() {
    Logger = BetterLog.useSpreadsheet('1SuYQzdYv4If_Gs1FbZkZqwa-Ovxro0p0A0aEkjbGPwE');
}

(function (context) {
    context.startLogger = function () {
        Logger = BetterLog.useSpreadsheet('1SuYQzdYv4If_Gs1FbZkZqwa-Ovxro0p0A0aEkjbGPwE');
    };
})(module.exports);
