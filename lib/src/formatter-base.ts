export abstract class JSONFormatterBase {
    /**
     * Quatation characters.
     */
    protected readonly quotations = {
        34: 34, // " "
        39: 39 // ' '
    };

    /**
     * Brackets characters.
     */
    protected readonly brackets = {
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
     * Reversed special characters.
     */
    protected readonly specialCharsReversed;

    /**
     * Length of indentation.
     */
    protected readonly indentation: number;

    /**
     * Creates an instance of JSON formatter.
     * @param indentation number of units that should compose the indentation. 
     * If the parameter is not specified 4 units indentation is assumed.
     */
    constructor(indentation?: number) {
        this.indentation = !!indentation ? indentation : 4;
        this.specialCharsReversed = this.getSpecialCharactersReversed();
    }

    /**
     * Formats a string as JSON.
     * @param input string to format as JSON
     */
    public abstract format(input: string): string;

    /**
     * Gets reversed {@link specialChars} object.
     */
    protected getSpecialCharactersReversed(): any {
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
    protected validate(input: string): boolean {
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
     * Utility method that allows to fast-forward by an input string skipping whitespace characters and 
     * returning a position of the first non-whitespace character.
     * @param input string to navigate
     * @param startPos start position
     */
    protected fastForward(input: string, startPos: number): number {
        while (startPos < input.length && (input[startPos] === ' ' || input[startPos] === '\t' || input[startPos] === '\n'))
            startPos++;
        return startPos;
    }
}