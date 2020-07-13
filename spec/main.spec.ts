import { JSONFormatter } from "../lib/src/formatter";

describe('should format', () => {
    const testDataDefault = [];
    const validationDataDefault = [];

    const testDataCustom = [];
    const validationDataCustom = [];

    beforeAll(async () => {
        testDataDefault.push(await loadFile("test-source-1.json"));
        testDataDefault.push(await loadFile("test-source-2.json"));
        testDataDefault.push(await loadFile("test-source-3.json"));
        testDataDefault.push(await loadFile("test-source-4.json"));

        validationDataDefault.push(await loadFile("test-validation-default-1.json"));
        validationDataDefault.push(await loadFile("test-validation-default-2.json"));
        validationDataDefault.push(await loadFile("test-validation-default-3.json"));
        validationDataDefault.push(await loadFile("test-validation-default-4.json"));

        expect(testDataDefault.length).toEqual(validationDataDefault.length);

        testDataCustom.push(await loadFile("test-source-1.json"));
        testDataCustom.push(await loadFile("test-source-2.json"));
        testDataCustom.push(await loadFile("test-source-3.json"));

        validationDataCustom.push(await loadFile("test-validation-custom-1.json"));
        validationDataCustom.push(await loadFile("test-validation-custom-2.json"));
        validationDataCustom.push(await loadFile("test-validation-custom-3.json"));

        expect(testDataCustom.length).toEqual(validationDataCustom.length);
    });

    it('using the default indentation (4 spaces)', () => {
        const jsonFormatter = new JSONFormatter();
        for (let i = 0; i < testDataDefault.length; i++) {
            expect(jsonFormatter.format(testDataDefault[i])).toBe(validationDataDefault[i]);
        }
    });

    it('using custom indentation', () => {
        for (let i = 0; i < testDataCustom.length; i++) {
            const jsonFormatter = new JSONFormatter(i + 1);
            expect(jsonFormatter.format(testDataCustom[i])).toBe(validationDataCustom[i]);
        }
    });

    it('unsuccessfully and return the original string', () => {
        const json = [
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

    const loadFile: any = (filename: string) =>
        new Promise<any>((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onload = event => resolve(request.responseText);
            request.onerror = event => reject(event);
            request.open("GET", `/${filename}`);
            request.send();
        });
});
