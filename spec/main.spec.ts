import { JSONFormatter } from "../lib/src/formatter";

describe('Test Suite', () => {
    describe('should format', () => {
        var testData = [];
        var validationData = [];
        var jsonFormatter;

        beforeAll(async () => {
            jsonFormatter = new JSONFormatter();
            testData.push(await loadFile("test-source-1.json"));
            testData.push(await loadFile("test-source-2.json"));

            validationData.push(await loadFile("test-validation-1.json"));
            validationData.push(await loadFile("test-validation-2.json"));

            expect(testData.length).toEqual(validationData.length);
        });

        it('successfully', () => {
            for (let i = 0; i < testData.length; i++)
                expect(jsonFormatter.format(testData[i])).toBe(validationData[i]);
        });

        it('unsuccessfully', () => {
            var json = [
                `{]`,
                `[}`,
                `{}}`,
                `[{]`,
                `{"item"":123}`,
                `{"item2""123", "item1":"123"}`,
                `{"item:123}`,
                `{"item":"123}`,
                `{"item":"123'}`,
                `"items":["item1","item2"],`,
                `{"items":["item1"item2"]}`,
                `{"itemsAgain": [name:"name 1"},{name:"name 2"}],}`
            ];

            for (let i = 0; i < json.length; i++)
                expect(jsonFormatter.format(json[i])).toBe(json[i]);
        });

        function loadFile(fileName) {
            return new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();
                request.onload = event => resolve(request.responseText);
                request.onerror = event => reject(event);
                request.open("GET", `/${fileName}`);
                request.send();
            });
        }
    });
});