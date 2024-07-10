class Dialog extends Cms.Dialog {
  constructor(callback) {
    super();
    const columnsGroup = document.createElement("div");
    const sourcesGroup = document.createElement("div");
    const columnsLabel = document.createElement("label");
    const sourcesLabel = document.createElement("label");
    const acceptButton = document.createElement("button");

    columnsLabel.textContent = "Columns";
    sourcesLabel.textContent = "Sources";

    this.columnsInput = document.createElement("input");
    this.columnsInput.type = "number";
    this.sourcesInput = document.createElement("input");
    this.sourcesInput.type = "hidden";

    columnsGroup.appendChild(columnsLabel);
    columnsGroup.appendChild(this.columnsInput);
    sourcesGroup.appendChild(sourcesLabel);
    sourcesGroup.appendChild(this.sourcesInput);
    this.popup.appendChild(columnsGroup);
    this.popup.appendChild(sourcesGroup);
    this.popup.appendChild(acceptButton);

    this.imagePicker = new Cms.MultipleImagePicker(this.sourcesInput);
    acceptButton.addEventListener("click", callback);
  }

  get sources() {
    return this.sourcesInput.value;
  }
}

function createGalleryItem(source) {
  const item = document.createElement("li");
  const figure = document.createElement("figure");
  const image = document.createElement("img");

  image.src = source;
  figure.appendChild(image);
  item.appendChild(figure);
}

function collectAttributesFromElement(viewElement) {
  return {
    "columns": viewElement.getAttribute("data-columns"),
    "sources": viewElement.getAttribute("data-sources").split(",").map(decodeURIComponent)
  }
}

function generateDatasetFromModel(modelElement) {
  return {
    "data-columns": modelElement.getAttribute("columns"),
    "data-sources": modelElement.getAttribute("sources").map(encodeURIComponent).join(",")
  };
}

export default class Plugin extends Cms.CKEditor.Plugin {
  static toolName = "cmsGallery";

  init() {
    this.defineSchema();
    this.defineConverters();
    this.editor.ui.componentFactory.add(this.constructor.toolName, this.createButton.bind(this));
  }

  defineSchema() {
    const schema = this.editor.model.schema;
    schema.register("cmsGallery", {
      isObject: true,
      allowWhere: "$block",
      allowAttributes: ['columns', 'sources']
    });
  }

  defineConverters() {
    const editor = this.editor;
    const conversion = editor.conversion;

    conversion.for("upcast").elementToElement({
      view: { name: "figure", classes: "blocks-gallery-grid" },
      model: (viewElement, { writer: modelWriter }) => {
        return this.createModel(viewElement, modelWriter);
      }
    });
    conversion.for("dataDowncast").elementToElement({
      model: "cmsGallery",
      view: (modelElement, { writer: viewWriter }) => {
        return this.createElement(modelElement, viewWriter);
      }
    });
    conversion.for("editingDowncast").elementToElement({
      model: "cmsGallery",
      view: (modelElement, { writer: viewWriter }) => {
        return this.createElement(modelElement, viewWriter, true);
      }
    });
  }

  createModel(viewElement, modelWriter) {
    return modelWriter.createElement(
      "cmsGallery",
      collectAttributesFromElement(viewElement)
    );
  }

  createElement(modelElement, viewWriter, inEditor = false) {
    const attributes = generateDatasetFromModel(modelElement);
    const figure = viewWriter.createContainerElement("figure", attributes);
    const listElement = viewWriter.createRawElement("ul", {
      class: "blocks-gallery-grid"
    }, function (domElement) {
      attributes.sources.forEach(source => {
        domElement.appendChild(createGalleryItem(source));
      });
    });
    viewWriter.insert(viewWriter.createPositionAt(figure, 0), listElement);
    return Cms.CKEditor.toWidget(figure, viewWriter, { label: "gallery widget" });
  }

  createButton() {
    const button = new Cms.CKEDitor.ButtonView();
    button.set({label: "Image Gallery"});
    button.on("execute", this.buttonClicked.bind(this));
    return button;
  }

  buttonClicked() {
    const dialog = new Dialog(data => {
      this.appendGallery(dialog.sources);
      dialog.close();
    });
    dialog.open();
    window.toto = dialog;
    window.tintin = this;
  }

  appendGallery(data) {
    try {
      this.editor.model.change(writer => {
        this.editor.model.insertContent(
          writer.createElement("cmsGallery", data)
        );
      });
    } catch (err) {
      console.error("Failed", err);
    }
  }
}
