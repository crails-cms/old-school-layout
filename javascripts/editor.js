import GalleryComponent from "./editor/gallery.js";
//import HtmlComponent from "./editor/html.js";

const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad ninim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea comodo consequat. Duis aute irure dolor.";

Cms.ContentTools.StylePalette.add([
  new Cms.ContentTools.Style("Text Shadow", "text-shadow-style", ["h1","h2","h3","p"]),
  new Cms.ContentTools.Style("Blinking Text", "blinking-text-style", ["h1","h2","h3","p"])
]);

class ContentComponent extends Cms.PageEditor.GridComponentEditor() {
  initializeProperties() {
    super.initializeProperties();
  }

  create() {
    const container = document.createElement("div");
    container.dataset.editable = '';
    container.dataset.name = `${this.id}-content`;
    container.innerHTML = `<p>${loremIpsum}</p>`;
    this.root.appendChild(container);
    super.create();
  }
}

class PictureComponent extends Cms.PageEditor.ImageComponentEditor {
  initializeProperties() {
    this.properties.href = { type: "text", target: this, attribute: "href", optional: true };
    this.properties.horizontalAlignment = {
      type: "select", target: this.root.dataset, attribute: "horizontalAlignment",
      options: [ { value: 0, text: "Left" }, { value: 1, text: "Center" }, { value: 2, text: "Right" }]
    };
    this.properties.verticalAlignment = {
      type: "select", target: this.root.dataset, attribute: "verticalAlignment",
      options: [ { value: 0, text: "Top" }, { value: 1, text: "Center" }, { value: 2, text: "Bottom" }]
    };
    super.initializeProperties();
  }

  get href() {
    const link = this.root.querySelector(":scope > a");
    return link ? link.href : undefined;
  }

  set href(value) {
    const link = this.root.querySelector(":scope > a") || document.createElement("a");
    if (value) {
      link.href = value;
      link.appendChild(this.image);
      this.root.appendChild(link);
    } else if (this.root.contains(link)) {
      this.root.appendChild(this.image);
      this.root.removeChild(link);
    }
  }
}

class SliderComponentEditor extends Cms.PageEditor.SliderComponentEditor {
  constructor(parent, element) {
    super(parent, element, {
      card: ContentComponent,
      html: Cms.PageEditor.HtmlComponentEditor,
      picture: PictureComponent
    });
  }
}

class OldSchoolLayoutEditor extends Cms.PageEditor.LayoutEditor {
  constructor(element) {
    super(element, {
      card:    ContentComponent,
      html:    Cms.PageEditor.HtmlComponentEditor,
      picture: PictureComponent,
      gallery: GalleryComponent,
      slider:  SliderComponentEditor
    });
    Cms.PageEditor.GridComponentEditor.model.gridClassList.forEach(className => {
      this.container.classList.add(className);
    });
  }
}

window.OldSchoolLayoutEditor = OldSchoolLayoutEditor;

PageEditor.fonts = [
  "Lucida Handwriting",
  "monospace",
  "Spicy Rice"
];
