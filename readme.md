# MnhBuilder: BS4 Layout Builder
When it comes to building layouts, it can become quite furstrating. Not to mention if the layouts are kind of complex. That said, this light script allows you to easily create your own layouts based on Bootstrap 4 classes. To try it out, you can visit this following link: [Layout Builder Demo](https://mnhjddn.github.io/work.html?code=layout-builder).

## Prerequisite
To use this script, you need to include the following libraries/framework:
- JQuery (for Bootstrap 4)
- Bootstrap 4
- CKEditor (for the content editor)
- FontAwesome

## How to Use
Place the script mnhBuilder.js to your project directory then Link it to your html. Make sure you load after you have loaded the ones in prerequisite section:
```sh
<script src="js/mnhBuilder.js"></script>
```
Add a div with an ID so that you can link it to the script. For example:
```sh
<div id="builderPreview"></div>
```
Create a button with ID which will be used to add panels to our layout. For example:
```sh
<button id="addPanel" class="btn btn-primary">Add Panel</button>
<button id="saveFile" class="btn btn-primary">Save File</button>
<button id="loadFile" class="btn btn-primary">Load File</button>
<button id="getCode" class="btn btn-primary">Get Code</button>
```
Add a script tag which contains these following lines (Before the closing tag of body):
```sh
let pageStructure = []; // This will be the object of your layout structure
MnhBuilder.init({
  layout_data: pageStructure, 
  container: 'builderPreview', 
  add_button: 'addPanel',
  save_button: 'saveFile',
  load_button: 'loadFile',
  code_button: 'getCode'
});
```
  - All values in the options are the IDs for your HTML elements
  - container should be a div so you need to give it an ID and pass it to the option
  - add_button performs onclick event and adds a panel inside the container
  - save_button performs onclick event and downloads the json object into a file
  - load_button performs onclick event and parses a json file into MnhBuilder layout
  - code_button performs onclick event and generates your layout into HTML Codes (Bootstrap)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)