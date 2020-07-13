# JSON Formatter
Formats a JSON-string into a properly indented and aligned string. The indentation (number of spaces) is controlled via `indentation` parameter. 

**Example:**
The input string 
```json
{"_id":"5f0227d65344c4288a30e9e2","age":35,"name": "Lucia Porter","gender":"female","email":"luciaporter@zaj.com","phone":"+1 (876) 517-2377","address":"717 Guernsey Street, Savannah, Guam, 6990","about": "Mollit in anim ex \"Lorem Lorem\" reprehenderit id 'dolore' irure qui.","tags":["amet","ullamco",45,"id","Lorem"]}
```
gets formatted to
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

If an input string doesn't represent a valid JSON, the original input string gets returned.

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
2. Build and run the demo project:
```bash
npm run serve
```
3. Navigate to [localhost:8080](http://localhost:8080)

### Building the project
```bash
npm run build
```