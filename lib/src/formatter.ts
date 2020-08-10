import { JSONFormatterBase } from "./formatter-base";

export class JSONFormatter extends JSONFormatterBase {
    /**
     * Special character to CSS class map.
     */
    private readonly specialCharacterToCssClass = {
        44: 'jf-comma',
        58: 'jf-colon',
        91: 'jf-bracket-square jf-bracket-open',
        93: 'jf-bracket-square jf-bracket-close',
        123: 'jf-bracket-curly jf-bracket-open',
        125: 'jf-bracket-curly jf-bracket-close'
    };

    /**
     * Creates an instance of {@link JSONFormatter}.
     * @param indentation number of units that should compose the indentation. 
     * If the parameter is not specified 4 units indentation is assumed.
     */
    constructor(indentation?: number) {
        super(!!indentation ? indentation : 24);
    }

    /**
     * Formats a string as JSON represented by HTML.
     * @param input string to format as JSON
     */
    public format(input: string): string {
        if (!input || !this.validate(input))
            return input;

        const stack = [];
        const quotationStack = [];
        let i = this.fastForward(input, 0);
        let result = '';
        while (i < input.length) {
            if (quotationStack.length === 0) {
                if (!!this.brackets[input.charCodeAt(i)]) {
                    if (input.charCodeAt(i) === 123)
                        result += `<div class="${this.specialCharacterToCssClass[input.charCodeAt(i)]}">${input[i]}</div>`;
                    else
                        result += `<span class="${this.specialCharacterToCssClass[input.charCodeAt(i)]}">${input[i]}</span>`;

                    stack.push(input.charCodeAt(i));
                    result += `<div class="jf-section" style="margin-left:${this.getMargin()}"><div>`;
                } else if (stack.length > 0 && stack[stack.length - 1] === this.specialCharsReversed[input.charCodeAt(i)]) {
                    result += '</div></div>';
                    stack.pop();
                    result += `<div class="${this.specialCharacterToCssClass[input.charCodeAt(i)]}">${input[i]}`;
                    i = this.fastForward(input, i + 1);
                    if (input[i] !== ',') {
                        result += '</div>';
                        continue;
                    }
                    else
                        result += `<span class="${this.specialCharacterToCssClass[input.charCodeAt(i)]}">${input[i]}</span></div>`;
                } else if (input[i] === ',') {
                    result += `<span class="${this.specialCharacterToCssClass[input.charCodeAt(i)]}">${input[i]}</span></div><div>`;
                    //i = this.fastForward(input, i + 1);
                    // skipping adding a linebreak if the next character is closing bracket
                    //if (stack.length === 0 || stack[stack.length - 1] !== this.specialCharsReversed[input.charCodeAt(i)])
                    // result += `<div style="margin-left:${this.getMargin(stack.length)}">`;
                    //continue;
                } else if (input[i] === ':') {
                    result += `<span class="${this.specialCharacterToCssClass[input.charCodeAt(i)]}">${input[i]}</span>&nbsp;`;
                } else if (!!this.quotations[input.charCodeAt(i)]) {
                    quotationStack.push(input.charCodeAt(i));
                    result += `<span class="jf-property">${input[i]}`;
                } else
                    result += input[i];
            } else
                // removing quotes from the stack only if they are not escaped by "\"
                if (!!this.quotations[input.charCodeAt(i)] && input[i - 1] !== '\\') {
                    quotationStack.pop();
                    result += `${input[i]}</span>`;
                } else
                    result += input[i];

            // skip whitespace characters only if they're outside of quotes
            i = quotationStack.length === 0 ? super.fastForward(input, i + 1) : i + 1;
        }

        return result;
    }

    /**
     * Gets margin for a <span> which wraps a section of a JSON.
     */
    private getMargin(): string {
        return this.indentation + 'px';
    }
}