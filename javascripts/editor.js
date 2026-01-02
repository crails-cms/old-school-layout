import GalleryComponent from "./editor/gallery.js";
//import HtmlComponent from "./editor/html.js";

const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad ninim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea comodo consequat. Duis aute irure dolor.";

Cms.PageEditor.fonts = [
  "Lucida Handwriting",
  "monospace",
  "Spicy Rice"
];
Cms.PageEditor.stylePalette = [
  new Cms.ContentTools.Style("Text Shadow", "text-shadow-style", ["h1","h2","h3","p"]),
  new Cms.ContentTools.Style("Blinking Text", "blinking-text-style", ["h1","h2","h3","p"])
];

class ContentComponent extends Cms.PageEditor.GridComponentEditor() {
  initializeProperties() {
    this.properties.verticalAlignment = {
      type: "select", target: this.root.dataset, attribute: "verticalAlignment",
      options: [
        { value: 0, text: alignmentLabel("top") },
        { value: 1, text: alignmentLabel("center") },
        { value: 2, text: alignmentLabel("bottom") }
      ]
    };
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

class SeparatorComponent extends Cms.PageEditor.ComponentEditor {
  constructor(parent, element = null) {
    super(parent, element || parent.document.createElement("hr"));
  }
}

function alignmentLabel(name) {
  return i18n.t(`admin.page-editor.alignments.${name}`);
}

function onComponentClicked(event) {
  event.preventDefault();
  this.layout.toolbar.setActiveComponent(this);
}

function createPictureLink(picture) {
  const el = document.createElement("a");
  el.addEventListener("click", onComponentClicked.bind(picture));
  return el;
}

class PictureComponent extends Cms.PageEditor.ImageComponentEditor {
  initializeProperties() {
    this.properties.href = { type: "link", target: this, attribute: "href", optional: true };
    this.properties.horizontalAlignment = {
      type: "select", target: this.root.dataset, attribute: "horizontalAlignment",
      options: [
        { value: 0, text: alignmentLabel("left") },
        { value: 1, text: alignmentLabel("center") },
        { value: 2, text: alignmentLabel("right") }
      ]
    };
    this.properties.verticalAlignment = {
      type: "select", target: this.root.dataset, attribute: "verticalAlignment",
      options: [
        { value: 0, text: alignmentLabel("top") },
        { value: 1, text: alignmentLabel("center") },
        { value: 2, text: alignmentLabel("bottom") }
      ]
    };
    super.initializeProperties();
  }

  bindElements() {
    super.bindElements();
    this.link = this.root.querySelector("a");
    if (this.link)
      this.link.addEventListener("click", onComponentClicked.bind(this));
  }

  get href() {
    return this.link ? this.link.href : undefined;
  }

  set href(value) {
    const link = this.link || createPictureLink(this);
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
      card:      ContentComponent,
      html:      Cms.PageEditor.HtmlComponentEditor,
      picture:   PictureComponent,
      separator: SeparatorComponent,
      gallery:   GalleryComponent,
      slider:    SliderComponentEditor
    });
    this.singleLevelLayout = true;
    Cms.PageEditor.GridComponentEditor.model.gridClassList.forEach(className => {
      this.container.classList.add(className);
    });
  }
}

window.OldSchoolLayoutEditor = OldSchoolLayoutEditor;
