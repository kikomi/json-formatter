export class JSONFormatter {
    /**
     * Quatation characters.
     */
    private readonly quotations = {
        34: 34, // " "
        39: 39 // ' '
    };

    /**
     * Brackets characters.
     */
    private readonly brackets = {
        91: 93, // [ ]
        123: 125 // { }
    };

    /**
     * Special characters.
     */
    private readonly specialChars = {
        ...this.brackets,
        58: 44, // : ,
        ...this.quotations
    };

    /**
     * Length of indentation.
     */
    private readonly indentation: number;

    /**
     * Padding string, calculated by mutiplying space character by @property {indentation}.
     */
    private readonly padding: string;

    /**
     * Reversed special characters.
     */
    private readonly specialCharsReversed;

    /**
     * Creates an instance of {@link JSONFormatter}.
     * @param indentation number of spaces that should compose the indentation. 
     * If the parameter is not specified 4 spaces indentation is assumed.
     */
    constructor(indentation?: number) {
        this.indentation = !!indentation ? indentation : 4;
        this.padding = this.getPadding(' ', this.indentation);
        this.specialCharsReversed = this.getSpecialCharactersReversed();
    }

    /**
     * Formats a string as JSON.
     * @param input string to format as JSON
     */
    public format(input: string): string {
        if (!this.validate(input))
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
                    // if there's no line break after closed bracket - adding one
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

    /**
     * Gets reversed {@link specialChars} object.
     */
    private getSpecialCharactersReversed(): any {
        const reversed = {};
        for (const key in this.specialChars) {
            if (this.specialChars.hasOwnProperty(key)) {
                const value = this.specialChars[key];
                reversed[value] = parseInt(key);
            }
        }

        return reversed;
    }
    /**
     * Validates a string for a possibility of formatting it as JSON.
     * @param input string to validate
     */
    private validate(input: string): boolean {
        if (!input)
            return true;

        let i = this.fastForward(input, 0);

        if (i == input.length || (input[i] !== '{' && input[i] !== '['))
            return false;

        const stack = [];
        while (i < input.length) {
            // popping from the stack if we found matching closing character or quote symbol, but only if it's not escaped by "\"
            if (stack.length > 0 && stack[stack.length - 1] === this.specialCharsReversed[input.charCodeAt(i)] && input[i - 1] !== '\\') {
                stack.pop();
            } else if (!!this.specialChars[input.charCodeAt(i)] && (stack.length === 0 || !this.quotations[stack[stack.length - 1]]))
                stack.push(input.charCodeAt(i));
            else if (
                !!this.specialCharsReversed[input.charCodeAt(i)] &&
                // ignore comma in ["item1","item2","item3"]
                (input.charCodeAt(i) !== 44 || (input.charCodeAt(i) === 44 && stack[stack.length - 1] !== 91))
            ) {
                if ((input.charCodeAt(i) === 125 || input.charCodeAt(i) === 93) && (stack.length > 0 && stack[stack.length - 1] === 58)) {
                    stack.pop();
                    continue;
                }
                else
                    //returning false if we found a special character outside of quotated expression
                    if (
                        stack.length === 0 ||
                        (stack[stack.length - 1] !== this.specialCharsReversed[input.charCodeAt(i)] && !this.quotations[stack[stack.length - 1]])
                    )
                        return false;
            }
            i++;
        }

        return stack.length === 0;
    }

    /**
     * Fast-forwards on an input string skipping whitespace characters and 
     * returning a position of the first non-whitespace character.
     * @param input string to navigate
     * @param startPos start position
     */
    private fastForward(input: string, startPos: number): number {
        while (startPos < input.length && (input[startPos] === ' ' || input[startPos] === '\t' || input[startPos] === '\n'))
            startPos++;
        return startPos;
    }
}