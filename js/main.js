function format() {
    var textToFormat = document.getElementById('input-text').value
    var paddingLength = document.getElementById('input-padding').value
    document.getElementById('output-text').value = JSONFormat(textToFormat, paddingLength);
}