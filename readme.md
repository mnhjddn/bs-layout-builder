# Bootstrap 4 Layout Builder
When it comes to building layouts, it can become quite furstrating. Not to mention if the layouts are kind of complex. That said, this light script allows you to easily create your own layouts based on Bootstrap 4 classes. To try it out, you can visit this following link: [Layout Builder Demo](https://mnhjddn.github.io/demo/layout-builder/).

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
```
Add a script tag which contains these following lines (Before the closing tag of body):
```sh
let pageStructure = []; // This will be the object of your layout structure
MnhBuilder.init('builderPreview', 'addPanel', pageStructure);
// builderPreview is the ID of our div
// addPanel is the ID of our add button
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)