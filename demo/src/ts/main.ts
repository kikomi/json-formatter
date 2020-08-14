import { JSONFormatter } from '@kikomi/json-formatter/dist/formatter';
import { JSONFormatterBasic } from '@kikomi/json-formatter/dist/formatter-basic';

class Main {
    public static formatBasic(): void {
        const textToFormat = (document.getElementById('input-text-basic') as HTMLInputElement).value
        const paddingLength = (document.getElementById('input-padding-basic') as HTMLInputElement).value;
        const jsonFormatter = new JSONFormatterBasic(parseInt(paddingLength));
        (document.getElementById('output-text-basic') as HTMLInputElement).value = jsonFormatter.format(textToFormat);
    }

    public static format(): void {
        const textToFormat = (document.getElementById('input-text') as HTMLInputElement).value
        const paddingLength = (document.getElementById('input-padding') as HTMLInputElement).value;
        const jsonFormatter = new JSONFormatter(parseInt(paddingLength));

        $('#output-text').html(jsonFormatter.format(textToFormat));

        $('#output-text').css('color', $('#text-color').val().toString());
        $('#output-text .jf-bracket-square, #output-text  .jf-bracket-curly').css('color', $('#bracket-color').val().toString());
        $('#output-text .jf-property').css('color', $('#property-color').val().toString());
        $('#output-text .jf-comma, #output-text .jf-colon').css('color', $('#special-color').val().toString());
    }
}

// defining format() function so we could call it from the HTML
(document as any).formatBasic = () => Main.formatBasic();
(document as any).format = () => Main.format();