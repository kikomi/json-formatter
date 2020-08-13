# JSON Formatter
Formats a JSON-string into a properly indented and aligned structure. The package contains two implementations of the formatter:
- `JSONFormatter` - formats a JSON-string into an indented JSON represented in `HTML`
- `JSONFormatterBasic` - formats a JSON-string into an indented JSON represented in `string`

The indentation (number of spaces) is controlled via `indentation` parameter. The formatter operates only with strings without having to converting it into a JSON object allowing it to format non-strictly valid JSON string i.e. a JSON represented by an array of objects or a JSON that has non-quoted properties.

**Example:**
The input string 
```json
{"_id":"5f0227d65344c4288a30e9e2","age":35,"name": "Lucia Porter","gender":"female","email":"luciaporter@zaj.com","phone":"+1 (876) 517-2377","address":"717 Guernsey Street, Savannah, Guam, 6990","about": "Mollit in anim ex \"Lorem Lorem\" reprehenderit id 'dolore' irure qui.","tags":["amet","ullamco",45,"id","Lorem"]}
```
gets formatted:

- Using `JSONFormatter()`

```html
<div class="jf-bracket-curly jf-bracket-open">{</div>
<div class="jf-section" style="margin-left: 24px;">
    <div><span class="jf-property">"_id"</span><span class="jf-colon">:</span>&nbsp;<span class="jf-property">"5f0227d65344c4288a30e9e2"</span><span class="jf-comma">,</span></div>
    <div><span class="jf-property">"age"</span><span class="jf-colon">:</span>&nbsp;35<span class="jf-comma">,</span></div>
    <div><span class="jf-property">"name"</span><span class="jf-colon">:</span>&nbsp;<span class="jf-property">"Lucia Porter"</span><span class="jf-comma">,</span></div>
    <div><span class="jf-property">"gender"</span><span class="jf-colon">:</span>&nbsp;<span class="jf-property">"female"</span><span class="jf-comma">,</span></div>
    <div><span class="jf-property">"email"</span><span class="jf-colon">:</span>&nbsp;<span class="jf-property">"luciaporter@zaj.com"</span><span class="jf-comma">,</span></div>
    <div><span class="jf-property">"phone"</span><span class="jf-colon">:</span>&nbsp;<span class="jf-property">"+1 (876) 517-2377"</span><span class="jf-comma">,</span></div>
    <div><span class="jf-property">"address"</span><span class="jf-colon">:</span>&nbsp;<span class="jf-property">"717 Guernsey Street, Savannah, Guam, 6990"</span><span class="jf-comma">,</span></div>
    <div><span class="jf-property">"about"</span><span class="jf-colon">:</span>&nbsp;<span class="jf-property">"Mollit in anim ex \"Lorem Lorem\" reprehenderit id \'dolore\' irure qui."</span><span class="jf-comma">,</span></div>
    <div>
        <span class="jf-property">"tags"</span><span class="jf-colon">:</span>&nbsp;<span class="jf-bracket-square jf-bracket-open">[</span>
        <div class="jf-section" style="margin-left: 24px;">
            <div><span class="jf-property">"amet"</span><span class="jf-comma">,</span></div>
            <div><span class="jf-property">"ullamco"</span><span class="jf-comma">,</span></div>
            <div>45<span class="jf-comma">,</span></div>
            <div><span class="jf-property">"id"</span><span class="jf-comma">,</span></div>
            <div><span class="jf-property">"Lorem"</span></div>
        </div>
        <div class="jf-bracket-square jf-bracket-close">]</div>
    </div>
</div>
<div class="jf-bracket-curly jf-bracket-close">}</div>
```
You can customize the way `{`,`}`,`[`,`]`,`,`,`:` and JSON properties look using predefined CSS-classes. See the demo project for details.

- Using `JSONFormatterBasic()`

```json
{
    "_id": "5f0227d65344c4288a30e9e2",
    "age": 35,
    "name": "Lucia Porter",
    "gender": "female",
    "email": "luciaporter@zaj.com",
    "phone": "+1 (876) 517-2377",
    "address": "717 Guernsey Street, Savannah, Guam, 6990",
    "about": "Mollit in anim ex \"Lorem Lorem\" reprehenderit id 'dolore' irure qui.",
    "tags": [
        "amet",
        "ullamco",
        45,
        "id",
        "Lorem"
    ]
}
```


**Note:** If an input string doesn't represent a valid JSON, the original input string gets returned.

Invalid JSON input string:
```json
{"_id":"5f0227d65344c42","age":35,name": "Lucia Porter"}
```
the output:
```json
{"_id":"5f0227d65344c42","age":35,name": "Lucia Porter"}
```

## Usage
1. Import the `@kikomi/json-formatter` package into you project run:
```bash
npm i @kikomi/json-formatter --save
```
2. Create an instance of `JSONFormatter` in your code:
```javascript
// with default indentation
var jsonFormatter = new JSONFormatter();

// with preset indentation
var jsonFormatter = new JSONFormatter(2);
```

3. Format your JSON input:
```javascript
var input = '{"your":"json","string":999}';
var output = jsonFormatter.format(input);
```
the package comes with Typescript type definitions.

## Development
1. Install [NodeJS](https://nodejs.org/)
2. Install [Gulp](https://gulpjs.com/docs/en/getting-started/quick-start)
```bash
npm i -g gulp
```
3. Install dependencies
```bash
npm i
```

### Running tests
```bash
npm run test
```
or run tests in debug mode
```bash
npm run test:debug
```

### Running demo project
1. Navigate to the `demo` folder
2. Install dependent packages
```bash
npm i
```
3. Build and run the demo project:
```bash
npm run serve
```
4. Navigate to [localhost:8080](http://localhost:8080)

### Building the project
```bash
npm run build
```