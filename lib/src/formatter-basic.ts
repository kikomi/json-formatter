import { JSONFormatterBase } from "./formatter-base";

export class JSONFormatterBasic extends JSONFormatterBase {
    /**
     * Padding string, calculated by mutiplying space character by @property {indentation}.
     */
    private readonly padding: string;

    /**
     * Creates an instance of {@link JSONFormatter}.
     * @param indentation number of spaces that should compose the indentation. 
     * If the parameter is not specified 4 spaces indentation is assumed.
     */
    constructor(indentation?: number) {
        super(indentation);
        this.padding = this.getPadding(' ', this.indentation);
    }

    /**
     * Formats a string as JSON represented by indented plain-text.
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
                    stack.push(input.charCodeAt(i));
                    result += input[i] + '\n' + this.getPadding(this.padding, stack.length);
                } else if (stack.length > 0 && stack[stack.length - 1] === this.specialCharsReversed[input.charCodeAt(i)]) {
                    stack.pop();
                    // if there's no line break after closing bracket - adding one
                    if (result[result.length - 1] !== '\n')
                        result += '\n';
                    result += this.getPadding(this.padding, stack.length) + input[i];
                } else if (input[i] === ',') {
                    result += input[i];
                    i = this.fastForward(input, i + 1);
                    // skipping adding a linebreak if the next character is closing bracket
                    if (stack.length === 0 || stack[stack.length - 1] !== this.specialCharsReversed[input.charCodeAt(i)])
                        result += '\n';
                    result += this.getPadding(this.padding, stack.length);
                    continue;
                } else if (input[i] === ':') {
                    result += input[i] + ' ';
                } else if (!!this.quotations[input.charCodeAt(i)]) {
                    quotationStack.push(input.charCodeAt(i));
                    result += input[i];
                } else
                    result += input[i];

            } else
                // removing quotes from the stack only if they are not escaped by "\"
                if (!!this.quotations[input.charCodeAt(i)] && input[i - 1] !== '\\') {
                    quotationStack.pop();
                    result += input[i];
                } else
                    result += input[i];

            // skip whitespace characters only if they're outside of quotes
            i = quotationStack.length === 0 ? this.fastForward(input, i + 1) : i + 1;
        }

        return result;
    }

    /**
     * Returns an indentation string (padding).
     * The padding is reused during formatting.
     */
    private getPadding(unit: string, repetitions: number): string {
        let padding = '';
        for (let i = 0; i < repetitions; i++)
            padding += unit;

        return padding;
    }
}