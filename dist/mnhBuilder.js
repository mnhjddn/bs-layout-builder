class MnhBuilder {



  static init = (data) => {

    let mnhPageStructure = data.layout_data;
    let targetDiv = data.container;
    let addButton = data.add_button;
    let codeButton = data.code_button;
    let saveButton = data.save_button;
    let loadButton = data.load_button;

    // Inject styles
    let styleString = `
      #${targetDiv} * { transition: all 0.3s ease-out; }
      #${targetDiv} .row { transition: padding 0.3s; }
      #${targetDiv} .row:hover { border-left: 2px solid red; padding-left: 50px; }
      #${targetDiv} .row div .hoverable:hover { opacity: 0.5; cursor: pointer; }
    `;
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);

    let ckeditorConfig = {
      toolbar: [
        { name: 'basicstyles', items: ['Source', 'Bold', 'Italic', 'Underline', 'Strike'] },
        { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'links', items: ['Link', 'Unlink'] },
        { name: 'styles', items: ['Styles', 'Format'] }
      ],
      forcePasteAsPlainText: true
    };

    // Initialize Popup Modal Element
    let contentEditor = document.createElement("div");
    contentEditor.id = "contentEditorForm";
    contentEditor.style.position = "absolute";
    contentEditor.style.width = "100%";
    contentEditor.style.height = "100%";
    contentEditor.style.zIndex = "9999";
    contentEditor.style.display = "grid";
    contentEditor.style.placeItems = "center";
    contentEditor.style.backgroundColor = "rgba(0,0,0,0.5)";


    const renderPreview = () => {
      document.querySelector(`#${targetDiv}`).innerHTML = "";
      mnhPageStructure.forEach((item, index, obj) => {
        let panel = document.createElement("div");

        // Initialize Buttons for rows
        let editorPanel = document.createElement("div");
        editorPanel.id = `row-${index}`;
        editorPanel.style.position = "absolute";
        editorPanel.style.opacity = "0";
        editorPanel.style.marginLeft = "-40px";
        editorPanel.style.fontSize = "0.5em";
        editorPanel.style.zIndex = "999";
        editorPanel.style.cursor = "pointer";
        editorPanel.innerHTML = `
        <button id="remove-row-${index}" title="Delete this panel" class="btn btn-link text-danger btn-sm m-0 p-0"><i class="fa fa-fw fa-trash-alt"></i></button>
        <button id="edit-classes-row-${index}" title="Edit Class" class="btn btn-link text-danger btn-sm m-0 p-0"><i class="fa fa-fw fa-cog"></i></button>
        <br/>
        <button id="move-up-row-${index}" title="Move up" class="btn btn-link text-danger btn-sm m-0 p-0"><i class="fa fa-fw fa-arrow-up"></i></button>
        <button id="move-down-row-${index}" title="Move down" class="btn btn-link text-danger btn-sm m-0 p-0"><i class="fa fa-fw fa-arrow-down"></i></button>
        `;

        editorPanel.querySelector(`#remove-row-${index}`).onclick = () => {
          if (confirm("Are you sure?")) {
            let newStructure = mnhPageStructure;
            newStructure.splice(index, 1);
            mnhPageStructure = newStructure;
            renderPreview();
          }
        }

        editorPanel.querySelector(`#move-up-row-${index}`).onclick = () => {
          if (index <= 0) {
            alert("Panel can't be moved up.");
          } else {
            let temp = mnhPageStructure[index - 1];
            mnhPageStructure[index - 1] = mnhPageStructure[index];
            mnhPageStructure[index] = temp;
          }
          renderPreview();
        }

        editorPanel.querySelector(`#move-down-row-${index}`).onclick = () => {
          if (index >= mnhPageStructure.length - 1) {
            alert("Panel can't be moved down.");
          } else {
            let temp = mnhPageStructure[index + 1];
            mnhPageStructure[index + 1] = mnhPageStructure[index];
            mnhPageStructure[index] = temp;
          }
          renderPreview();
        }

        editorPanel.querySelector(`#edit-classes-row-${index}`).onclick = () => {
          // Parse classes to string
          let classes = mnhPageStructure[index].classes.join(" ");
          let editedClasses = prompt("Add classes (separate by space):", classes);
          if (editedClasses) {
            let newClasses = editedClasses.split(" ");
            mnhPageStructure[index].classes = newClasses;
          }
          renderPreview();
        };

        // Animation for Buttons
        panel.onmouseover = () => {
          panel.querySelector(`#row-${index}`).style.opacity = "1";
        }
        panel.onmouseout = () => {
          panel.querySelector(`#row-${index}`).style.opacity = "0";
        }


        panel.appendChild(editorPanel);

        item.classes.forEach((val) => {
          panel.classList.add(val);
        });
        item.cols.forEach((itemI, indexI, objI) => {
          let child = document.createElement("div");
          itemI.classes.forEach((val) => {
            child.classList.add(val);
          });
          child.setAttribute("data-parent", index);
          child.setAttribute("data-child", indexI);
          if (!itemI.content || itemI.content.length < 1) {
            child.innerHTML = `
          <div class='text-center hoverable p-4 mt-2 mb-4 rounded-lg' style="color:gray; background-color:#e3e3e3">
            <small>Empty Column</small>
          </div>
          `;
          }
          else {
            // #region Render items in column
            itemI.content.forEach((value, indexJ) => {
              let _content = document.createElement("div");
              _content.style.position = "relative";

              let _tools = `
              <div id='row-${index}-col-${indexI}-item-${indexJ}' style="position:absolute;height:100%;width:100%;display:grid;place-items:center;opacity:0;z-index:900; background-color: rgba(255, 255, 255, 0.8)">
                <span class="bg-white shadow px-3 py-2 rounded-pill">
                 <small>
                  <a class="text-danger" id="edit-content-row-${index}-col-${indexI}-item-${indexJ}" title="Edit Konten" href="#"><i class="fa fa-fw fa-edit mx-1"></i></a>
                  <a class="text-danger" id="move-up-content-row-${index}-col-${indexI}-item-${indexJ}" title="Move up" href="#"><i class="fa fa-fw fa-arrow-up mx-1"></i></a>
                  <a class="text-danger" id="move-down-content-row-${index}-col-${indexI}-item-${indexJ}" title="Move down" href="#"><i class="fa fa-fw fa-arrow-down mx-1"></i></a>
                  <a class="text-danger" id="delete-content-row-${index}-col-${indexI}-item-${indexJ}" title="Delete content" href="#"><i class="fa fa-fw fa-trash-alt mx-1"></i></a>
                 </small>
                </span>
              </div>
              `;

              _content.innerHTML = `${_tools}<div class="hoverable">${value}</div>`;
              _content.addEventListener('mouseover', () => {
                _content.querySelector(`#row-${index}-col-${indexI}-item-${indexJ}`).style.opacity = "1";
              });
              _content.addEventListener('mouseleave', () => {
                _content.querySelector(`#row-${index}-col-${indexI}-item-${indexJ}`).style.opacity = "0";
              });

              _content.querySelector(`#edit-content-row-${index}-col-${indexI}-item-${indexJ}`).addEventListener("click", () => {

                if (mnhPageStructure[index].cols[indexI].content[indexJ].startsWith('<div data-type="img"')) {
                  // #region Edit image
                  let _toBeEdited = new DOMParser().parseFromString(mnhPageStructure[index].cols[indexI].content[indexJ], "text/html");
                  let addContent = contentEditor;
                  addContent.innerHTML = `
                    <div style="max-width:679px; width:100%" class="p-3 p-md-4 bg-white shadow rounded-lg">
                    <h6>Image Detail:</h6>
                    
                    <div class="my-4">
                    <input type="text" value="${_toBeEdited.querySelector('img').getAttribute("src")}" id="editorImageURL" class="form-control form-control-sm mb-2" placeholder="URL (Example: https://example.com/gambar.jpg)" />
                    <input type="text" value="${_toBeEdited.querySelector('img').getAttribute("alt")}" id="editorImageAlt" class="form-control form-control-sm mb-2" placeholder="Description (Example: Organization Name)" />
                    <input type="text" value="${_toBeEdited.querySelector('a') ? _toBeEdited.querySelector('a').getAttribute("href") : ""}" id="editorImageHref" class="form-control form-control-sm mb-2" placeholder="Hyperlink (Example: https://example.com)" />
                    <input type="text" value="${_toBeEdited.querySelector('img').getAttribute("class")}" id="editorImageClass" class="form-control form-control-sm mb-2" placeholder="Classes for <img> (separate with space) (Example: rounded-circle, w-100, dll)" />
                    <input type="text" value="${_toBeEdited.querySelector('div').getAttribute("class")}" id="editorContainerClass" class="form-control form-control-sm mb-2" placeholder="Classes for <div> (separate with space) (Example: text-center, bg-dark, dll)" />
                    </div>
          
                    <hr/>
                    <h6>Code Preview:</h6>
                    <pre id="editorImageCodePreview"></pre>
          
                    <div class="text-center pt-3">
                      <button class="btn btn-danger rounded-pill px-3 btn-sm" id="contentEditorFormSave">Save Content</button>
                      <a href="#" class="btn btn-link btn-sm text-danger" id="contentEditorFormCancel">Cancel</a>
                    </div>
                    </div>
                    `;

                  let updateCodePreview = () => {
                    addContent.querySelector("#editorImageCodePreview").textContent = `<div data-type="img" class="${addContent.querySelector("#editorContainerClass").value}">
                      ${addContent.querySelector("#editorImageHref").value ? `<a href="${addContent.querySelector("#editorImageHref").value}">` : ""}<img 
                        src="${addContent.querySelector("#editorImageURL").value}" 
                        alt="${addContent.querySelector("#editorImageAlt").value}" 
                        class="${addContent.querySelector("#editorImageClass").value}" 
                      />${addContent.querySelector("#editorImageHref").value ? `</a>` : ""}
                    </div>`;
                  }

                  updateCodePreview();

                  addContent.querySelectorAll("input").forEach(inp => {
                    inp.addEventListener("keyup", () => {
                      updateCodePreview()
                    });
                  });

                  addContent.querySelector("#contentEditorFormSave").onclick = () => {
                    if (addContent.querySelector("#editorImageURL").value && addContent.querySelector("#editorImageAlt").value) {

                      let _content = addContent.querySelector("#editorImageCodePreview").textContent;

                      mnhPageStructure[index].cols[indexI].content[indexJ] = _content;

                      renderPreview();
                      document.querySelector("#contentEditorForm").remove();
                    } else {
                      alert("URL and description must not be empty");
                    }
                  }
                  addContent.querySelector("#contentEditorFormCancel").onclick = () => {
                    document.querySelector("#contentEditorForm").remove();
                  }
                  document.body.insertBefore(contentEditor, document.body.firstChild);
                  // #endregion
                } else if (mnhPageStructure[index].cols[indexI].content[indexJ].startsWith('<div data-type="content"')) {
                  // #region Edit content
                  let editContent = contentEditor
                  editContent.innerHTML = `
                  <div style="max-width:679px; width:100%" class="p-3 p-md-4 bg-white shadow rounded-lg">
                    <textarea name="ckeditor">${mnhPageStructure[index].cols[indexI].content[indexJ]}</textarea>
                    <div class="text-center pt-3">
                      <button class="btn btn-danger rounded-pill px-3 btn-sm" id="contentEditorFormSave">Save Content</button>
                      <a href="#" class="btn btn-link btn-sm text-danger" id="contentEditorFormCancel">Cancel</a>
                    </div>
                  </div>
                  `;
                  editContent.querySelector("#contentEditorFormSave").onclick = () => {
                    let _content = CKEDITOR.instances.ckeditor.getData();
                    mnhPageStructure[index].cols[indexI].content[indexJ] = _content;
                    renderPreview();
                    document.querySelector("#contentEditorForm").remove();
                  }
                  editContent.querySelector("#contentEditorFormCancel").onclick = () => {
                    document.querySelector("#contentEditorForm").remove();
                  }
                  document.body.insertBefore(contentEditor, document.body.firstChild);
                  CKEDITOR.replace('ckeditor', ckeditorConfig);

                  // #endregion
                }

              });

              _content.querySelector(`#delete-content-row-${index}-col-${indexI}-item-${indexJ}`).addEventListener("click", () => {
                if (confirm("Are you sure?")) {
                  mnhPageStructure[index].cols[indexI].content.splice(indexJ, 1);
                  renderPreview();
                }
              });

              _content.querySelector(`#move-up-content-row-${index}-col-${indexI}-item-${indexJ}`).addEventListener("click", () => {
                if (indexJ <= 0) {
                  alert("Content can't be moved up");
                } else {
                  let temp = mnhPageStructure[index].cols[indexI].content[indexJ - 1];
                  mnhPageStructure[index].cols[indexI].content[indexJ - 1] = mnhPageStructure[index].cols[indexI].content[indexJ];
                  mnhPageStructure[index].cols[indexI].content[indexJ] = temp;
                }
                renderPreview();
              });

              _content.querySelector(`#move-down-content-row-${index}-col-${indexI}-item-${indexJ}`).addEventListener("click", () => {
                if (indexJ >= mnhPageStructure[index].cols[indexI].content.length - 1) {
                  alert("Content can't be moved down.");
                } else {
                  let temp = mnhPageStructure[index].cols[indexI].content[indexJ + 1];
                  mnhPageStructure[index].cols[indexI].content[indexJ + 1] = mnhPageStructure[index].cols[indexI].content[indexJ];
                  mnhPageStructure[index].cols[indexI].content[indexJ] = temp;
                }
                renderPreview();
              });

              child.appendChild(_content);
            });
            // #endregion
          }

          // Initialize column buttons
          let colOptions = document.createElement("div");
          colOptions.classList.add("dropdown")
          colOptions.id = `col-${indexI}-row-${index}-options`;
          colOptions.style.position = "absolute"
          colOptions.style.right = "10px";
          colOptions.style.top = "-15px";
          colOptions.style.opacity = "0";
          colOptions.style.zIndex = "999";
          colOptions.innerHTML = `
          <div class="pb-1 px-3 rounded-pill bg-danger shadow">
           <small>
           <a title="Add Content" class="text-white mx-1" id="add-content-row-${index}-col-${indexI}" href="#"><i class="fa fa-fw fa-align-left"></i></a>
           <a title="Add Image" class="text-white mx-1" id="add-img-row-${index}-col-${indexI}" href="#"><i class="fa fa-fw fa-images"></i></a>
           <a title="Edit Class" class="text-white mx-1" id="modify-class-row-${index}-col-${indexI}" href="#"><i class="fa fa-fw fa-cog"></i></a>
           </small>
          </div>
        `;
          // Animation for Buttons
          child.onmouseover = () => {
            child.querySelector(`#col-${indexI}-row-${index}-options`).style.opacity = "1";
            child.querySelector(`#col-${indexI}-row-${index}-options`).style.top = "-10px";
          }
          child.onmouseout = () => {
            child.querySelector(`#col-${indexI}-row-${index}-options`).style.opacity = "0";
            child.querySelector(`#col-${indexI}-row-${index}-options`).style.top = "-15px";
          }

          // #region Add content to current column 
          colOptions.querySelector(`#add-content-row-${index}-col-${indexI}`).addEventListener("click", () => {
            let addContent = contentEditor;
            addContent.innerHTML = `
            <div style="max-width:679px; width:100%" class="p-3 p-md-4 bg-white shadow rounded-lg">
            <textarea name="ckeditor"></textarea>
            <div class="text-center pt-3">
              <button class="btn btn-danger rounded-pill px-3 btn-sm" id="contentEditorFormSave">Save Content</button>
              <a href="#" class="btn btn-link btn-sm text-danger" id="contentEditorFormCancel">Cancel</a>
            </div>
            </div>
            `;
            addContent.querySelector("#contentEditorFormSave").onclick = () => {
              let _content = `<div data-type="content">${CKEDITOR.instances.ckeditor.getData()}</div>`;
              mnhPageStructure[index].cols[indexI].content.push(_content);
              renderPreview();
              document.querySelector("#contentEditorForm").remove();
            }
            addContent.querySelector("#contentEditorFormCancel").onclick = () => {
              document.querySelector("#contentEditorForm").remove();
            }
            document.body.insertBefore(contentEditor, document.body.firstChild);
            CKEDITOR.replace('ckeditor', ckeditorConfig);
          });
          // #endregion 

          // #region Add img to current column
          colOptions.querySelector(`#add-img-row-${index}-col-${indexI}`).addEventListener("click", () => {
            let addContent = contentEditor;
            addContent.innerHTML = `
            <div style="max-width:679px; width:100%" class="p-3 p-md-4 bg-white shadow rounded-lg">
            <h6>Image Detail:</h6>
            
            <div class="my-4">
            <input type="text" id="editorImageURL" class="form-control form-control-sm mb-2" placeholder="URL (Example: https://example.com/gambar.jpg)" />
            <input type="text" id="editorImageAlt" class="form-control form-control-sm mb-2" placeholder="Description (Example: Organization Name)" />
            <input type="text" id="editorImageHref" class="form-control form-control-sm mb-2" placeholder="Hyperlink (Example: https://example.com)" />
            <input type="text" id="editorImageClass" class="form-control form-control-sm mb-2" placeholder="Classes for <img> (separate with space) (Example: rounded-circle, w-100, dll)" />
            <input type="text" id="editorContainerClass" class="form-control form-control-sm mb-2" placeholder="Classes for <div> (separate with space) (Example: text-center, bg-dark, dll)" />
            </div>
  
            <hr/>
            <h6>Code Preview:</h6>
            <pre id="editorImageCodePreview"></pre>
  
            <div class="text-center pt-3">
              <button class="btn btn-danger rounded-pill px-3 btn-sm" id="contentEditorFormSave">Save Content</button>
              <a href="#" class="btn btn-link btn-sm text-danger" id="contentEditorFormCancel">Cancel</a>
            </div>
            </div>
            `;

            let updateCodePreview = () => {
              addContent.querySelector("#editorImageCodePreview").textContent = `<div data-type="img" class="${addContent.querySelector("#editorContainerClass").value}">
    ${addContent.querySelector("#editorImageHref").value ? `<a href="${addContent.querySelector("#editorImageHref").value}">` : ""}<img 
      src="${addContent.querySelector("#editorImageURL").value}" 
      alt="${addContent.querySelector("#editorImageAlt").value}" 
      class="${addContent.querySelector("#editorImageClass").value}" 
    />${addContent.querySelector("#editorImageHref").value ? `</a>` : ""}
  </div>`;
            }

            updateCodePreview();

            addContent.querySelectorAll("input").forEach(inp => {
              inp.addEventListener("keyup", () => {
                updateCodePreview()
              });
            });

            addContent.querySelector("#contentEditorFormSave").onclick = () => {
              if (addContent.querySelector("#editorImageURL").value && addContent.querySelector("#editorImageAlt").value) {
                let _content = addContent.querySelector("#editorImageCodePreview").textContent;
                mnhPageStructure[index].cols[indexI].content.push(_content);
                renderPreview();
                document.querySelector("#contentEditorForm").remove();
              } else {
                alert("URL and description must not be empty");
              }
            }
            addContent.querySelector("#contentEditorFormCancel").onclick = () => {
              document.querySelector("#contentEditorForm").remove();
            }
            document.body.insertBefore(contentEditor, document.body.firstChild);
          });
          // #endregion

          // #region Modify classes of current column
          colOptions.querySelector(`#modify-class-row-${index}-col-${indexI}`).addEventListener("click", () => {
            let classes = mnhPageStructure[index].cols[indexI].classes.join(" ");
            let editedClasses = prompt("Add classes for this column (separate with spaces):", classes);
            if (editedClasses) {
              let newClasses = editedClasses.split(" ");
              mnhPageStructure[index].cols[indexI].classes = newClasses;
            }
            renderPreview();
          });
          // #endregion

          child.appendChild(colOptions);
          panel.appendChild(child);
        });
        document.querySelector(`#${targetDiv}`).appendChild(panel);
      });
    }

    document.querySelector(`#${addButton}`).onclick = () => {
      let cols = prompt("Add column: (Example: 1/2/3/4)");
      let colCount = parseInt(cols);
      if (colCount) {
        if (colCount < 1 || colCount > 4) {
          alert('Please select one of these: 1, 2, 3, 4');
        } else {

          let addedColumns = [];

          switch (colCount) {
            case 1:
              addedColumns = [{
                classes: ["col-md-12"],
                content: []
              }];
              break;
            case 2:
              addedColumns = [
                {
                  classes: ["col-md-6"],
                  content: []
                },
                {
                  classes: ["col-md-6"],
                  content: []
                }
              ];
              break;
            case 3:
              addedColumns = [
                {
                  classes: ["col-md-4"],
                  content: []
                },
                {
                  classes: ["col-md-4"],
                  content: []
                },
                {
                  classes: ["col-md-4"],
                  content: []
                }
              ];
              break;
            case 4:
              addedColumns = [
                {
                  classes: ["col-md-3"],
                  content: []
                },
                {
                  classes: ["col-md-3"],
                  content: []
                },
                {
                  classes: ["col-md-3"],
                  content: []
                },
                {
                  classes: ["col-md-3"],
                  content: []
                }
              ];
              break;
          }

          let row = {
            classes: ["row"],
            cols: addedColumns
          };

          mnhPageStructure.push(row);
          renderPreview();
        }
      }
    }

    if (saveButton) {
      document.querySelector(`#${saveButton}`).onclick = () => {
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mnhPageStructure));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "my_layout.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    }

    if (loadButton) {
      document.querySelector(`#${loadButton}`).onclick = () => {
        let fileOpener = document.createElement('input');
        fileOpener.type = 'file';

        if (fileOpener && document.createEvent) {
          let evt = document.createEvent("MouseEvents");
          evt.initEvent("click", true, false);
          fileOpener.dispatchEvent(evt);
        }

        fileOpener.onchange = () => {
          let file = fileOpener.files[0];
          if (file) {

            let reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
              mnhPageStructure = JSON.parse(evt.target.result);
              renderPreview();
            }
            reader.onerror = function (evt) {
              alert('Error reading file')
            }


            fileOpener.remove();
          }
        }
      }
    }

    if (codeButton) {
      document.querySelector(`#${codeButton}`).onclick = () => {
        let htmlCode = '';
        mnhPageStructure.forEach(rows => {
          let rowText = `<div class="${rows.classes.join(" ")}">`;

          let columnText = '';
          rows.cols.forEach(cols => {

            let colContents = '';
            cols.content.forEach(contents => {
              let div = document.createElement('div');
              div.innerHTML = contents;
              colContents += div.querySelector('div').innerHTML;
              div.remove();
            });

            columnText += `<div class="${cols.classes.join(" ")}">${colContents}</div>`;
          });

          rowText += `${columnText}</div>`;

          htmlCode += rowText;
        });

        /* Save to clipboard */
        const el = document.createElement('textarea');
        el.value = htmlCode;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        const selected =
          document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (selected) {
          document.getSelection().removeAllRanges();
          document.getSelection().addRange(selected);
        }

        alert("The HTML code has been copied to your clipboard")
      }
    }

    renderPreview();

  }

}