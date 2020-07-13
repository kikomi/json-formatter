import { JSONFormatter } from '@kikomi/json-formatter/dist/formatter';

class Main {
    public static format(): void {
        const textToFormat = (document.getElementById('input-text') as HTMLInputElement).value
        const paddingLength = (document.getElementById('input-padding') as HTMLInputElement).value;
        const jsonFormatter = new JSONFormatter(parseInt(paddingLength));
        (document.getElementById('output-text') as HTMLInputElement).value = jsonFormatter.format(textToFormat);
    }
}

// defining format() function so we could call it from the HTML
(document as any).format = () => Main.format();