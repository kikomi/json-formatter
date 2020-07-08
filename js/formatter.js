'use strict'
var JSONFormat = function (input, paddingLength) {
    var brackets = {
        91: 93, // [ ]
        123: 125 // { }
    };

    var quotations = {
        34: 34, // " "
        39: 39 // ' '
    }

    var specialChars = {
        ...quotations,
        58: 44, // : ,
        ...brackets
    };

    var padding = '';

    var specialCharsReversed = {};

    (function () {
        for (const key in specialChars) {
            if (specialChars.hasOwnProperty(key)) {
                const value = specialChars[key];
                specialCharsReversed[value] = Number.parseInt(key);
            }
        }

        for (let i = 0; i < paddingLength; i++)
            padding += ' ';
    })();

    function validate() {
        if (!input)
            return true;

        let i = fastForward(0);

        if (i == input.length || (input[i] !== '{' && input[i] !== '['))
            return false;

        var stack = [];
        while (i < input.length) {
            // popping from the stack if we found matching closing character or quote symbol, but only if it's not escaped by "\"
            if (stack.length > 0 && stack[stack.length - 1] === specialCharsReversed[input.charCodeAt(i)] && input[i - 1] !== '\\') {
                stack.pop();
            } else if (!!specialChars[input.charCodeAt(i)] && (stack.length === 0 || !quotations[stack[stack.length - 1]]))
                stack.push(input.charCodeAt(i));
            else if (
                !!specialCharsReversed[input.charCodeAt(i)] &&
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
                        (stack[stack.length - 1] !== specialCharsReversed[input.charCodeAt(i)] && !quotations[stack[stack.length - 1]])
                    )
                        return false;
            }
            i++;
        }

        return stack.length === 0;
    }

    function format() {
        if (!validate())
            return input;

        var stack = [];
        var quotationStack = [];
        let i = fastForward(0);
        var result = '';
        while (i < input.length) {
            if (quotationStack.length === 0) {
                if (!!brackets[input.charCodeAt(i)]) {
                    stack.push(input.charCodeAt(i));
                    result += input[i] + '\n' + addPadding(stack.length);
                } else if (stack.length > 0 && stack[stack.length - 1] === specialCharsReversed[input.charCodeAt(i)]) {
                    stack.pop();
                    // if there's no line break after closed bracket - adding one
                    if (result[result.length - 1] !== '\n')
                        result += '\n';
                    result += addPadding(stack.length) + input[i];
                } else if (input[i] === ',') {
                    result += input[i];
                    i = fastForward(i + 1);
                    // skipping adding a linebreak if the next character is closing bracket
                    if (stack.length === 0 || stack[stack.length - 1] !== specialCharsReversed[input.charCodeAt(i)])
                        result += '\n';
                    result += addPadding(stack.length);
                    continue;
                } else if (input[i] === ':') {
                    result += input[i] + ' ';
                } else if (!!quotations[input.charCodeAt(i)]) {
                    quotationStack.push(input.charCodeAt(i));
                    result += input[i];
                } else
                    result += input[i];

            } else
                // removing quotes from the stack only if they are not escaped by "\"
                if (!!quotations[input.charCodeAt(i)] && input[i - 1] !== '\\') {
                    quotationStack.pop();
                    result += input[i];
                } else
                    result += input[i];

            // skip whitespace characters only if they're outside of quotes
            i = quotationStack.length === 0 ? fastForward(i + 1) : i + 1;
        }

        return result;
    }

    function fastForward(pos) {
        while (pos < input.length && (input[pos] === ' ' || input[pos] === '\t' || input[pos] === '\n'))
            pos++;
        return pos;
    }

    function addPadding(numberOfPads) {
        var result = '';
        for (let i = 0; i < numberOfPads; i++)
            result += padding;

        return result;
    }

    return format();
};