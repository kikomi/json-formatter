import { JSONFormatter } from "../lib/src/formatter";
import { JSONFormatterBasic } from "../lib/src/formatter-basic";

describe('should format', () => {
    const testDataDefaultIndentation = [];
    const validationDataDefaultIndentation = [];
    const validationDataDefaultIndentationHtml = [];

    const testDataCustomIndentation = [];
    const validationDataCustomIndentation = [];
    const validationDataCustomIndentationHtml = [];

    beforeAll(async () => {
        testDataDefaultIndentation.push(await loadFile("test-source-1.json"));
        testDataDefaultIndentation.push(await loadFile("test-source-2.json"));
        testDataDefaultIndentation.push(await loadFile("test-source-3.json"));
        testDataDefaultIndentation.push(await loadFile("test-source-4.json"));

        validationDataDefaultIndentation.push(await loadFile("test-validation-default-1.json"));
        validationDataDefaultIndentation.push(await loadFile("test-validation-default-2.json"));
        validationDataDefaultIndentation.push(await loadFile("test-validation-default-3.json"));
        validationDataDefaultIndentation.push(await loadFile("test-validation-default-4.json"));

        expect(testDataDefaultIndentation.length).toEqual(validationDataDefaultIndentation.length);

        validationDataDefaultIndentationHtml.push(await loadFile("test-validation-default-1.html"));
        validationDataDefaultIndentationHtml.push(await loadFile("test-validation-default-2.html"));
        validationDataDefaultIndentationHtml.push(await loadFile("test-validation-default-3.html"));
        validationDataDefaultIndentationHtml.push(await loadFile("test-validation-default-4.html"));

        expect(testDataDefaultIndentation.length).toEqual(validationDataDefaultIndentationHtml.length);

        testDataCustomIndentation.push(await loadFile("test-source-1.json"));
        testDataCustomIndentation.push(await loadFile("test-source-2.json"));
        testDataCustomIndentation.push(await loadFile("test-source-3.json"));

        validationDataCustomIndentation.push(await loadFile("test-validation-custom-1.json"));
        validationDataCustomIndentation.push(await loadFile("test-validation-custom-2.json"));
        validationDataCustomIndentation.push(await loadFile("test-validation-custom-3.json"));

        expect(testDataCustomIndentation.length).toEqual(validationDataCustomIndentation.length);

        validationDataCustomIndentationHtml.push(await loadFile("test-validation-custom-1.html"));
        validationDataCustomIndentationHtml.push(await loadFile("test-validation-custom-2.html"));
        validationDataCustomIndentationHtml.push(await loadFile("test-validation-custom-3.html"));

        expect(testDataCustomIndentation.length).toEqual(validationDataCustomIndentationHtml.length);
    });

    describe('using basic formatter', () => {
        it('using the default indentation (4 spaces)', () => {
            const jsonFormatter = new JSONFormatterBasic();
            for (let i = 0; i < testDataDefaultIndentation.length; i++) {
                expect(jsonFormatter.format(testDataDefaultIndentation[i])).toBe(validationDataDefaultIndentation[i]);
            }
        });

        it('using custom indentation', () => {
            for (let i = 0; i < testDataCustomIndentation.length; i++) {
                const jsonFormatter = new JSONFormatterBasic(i + 1);
                expect(jsonFormatter.format(testDataCustomIndentation[i])).toBe(validationDataCustomIndentation[i]);
            }
        });

        it('unsuccessfully and return the original string', () => {
            const json = [
                undefined,
                null,
                `123`,
                ``,
                `    `,
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

            const jsonFormatter = new JSONFormatterBasic();
            for (let i = 0; i < json.length; i++)
                expect(jsonFormatter.format(json[i])).toBe(json[i]);
        });
    });

    describe('using basic HTML formatter', () => {
        it('using the default indentation', () => {
            const jsonFormatter = new JSONFormatter();
            for (let i = 0; i < testDataDefaultIndentation.length; i++) {
                expect(jsonFormatter.format(testDataDefaultIndentation[i])).toBe(validationDataDefaultIndentationHtml[i]);
            }
        });

        it('using custom indentation', () => {
            for (let i = 0; i < testDataCustomIndentation.length; i++) {
                const jsonFormatter = new JSONFormatter(i + 1);
                expect(jsonFormatter.format(testDataCustomIndentation[i])).toBe(validationDataCustomIndentationHtml[i]);
            }
        });

        it('unsuccessfully and return the original string', () => {
            const json = [
                undefined,
                null,
                `123`,
                ``,
                `    `,
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

            const jsonFormatter = new JSONFormatter();
            for (let i = 0; i < json.length; i++)
                expect(jsonFormatter.format(json[i])).toBe(json[i]);
        });
    });

    const loadFile: any = (filename: string) =>
        new Promise<any>((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onload = event => resolve(request.responseText);
            request.onerror = event => reject(event);
            request.open("GET", `/${filename}`);
            request.send();
        });
});
