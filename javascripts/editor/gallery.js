function onComponentClicked(event) {
  event.preventDefault();
  this.layout.toolbar.setActiveComponent(this);
}

class GalleryItemComponent extends Cms.PageEditor.ImageComponentEditor {
  initializeProperties() {
    this.properties.caption = { type: "text", target: this, attribute: "caption" };
    this.properties.href = { type: "link", target: this.link, attribute: "href" };
    super.initializeProperties();
  }

  create() {
    const figure = document.createElement("figure");
    const link = document.createElement("a");

    figure.appendChild(link);
    this.root.appendChild(figure);
    super.create();
    link.appendChild(this.image);
  }

  bindElements() {
    this.figure = this.root.querySelector(":scope > figure");
    this.link = this.figure.querySelector(":scope > a");
    if (this.link)
      this.link.addEventListener("click", onComponentClicked.bind(this));
    super.bindElements();
  }

  get captionElement() {
    return this.figure.querySelector(":scope > figcaption");
  }

  get caption() {
    return this.captionElement ? this.captionElement.textContent : null;
  }

  set caption(value) {
    if (!this.captionElement && value) {
      const captionElement = document.createElement("figcaption");
      this.figure.appendChild(captionElement);
    } else if (this.captionElement && value == "") {
      this.figure.removeChild(this.captionElement);
    }
    if (value)
      this.captionElement.textContent = value;
  }
}

export default class extends Cms.PageEditor.GridComponentEditor(Cms.PageEditor.ListComponentEditor) {
  constructor(parent, element) {
    super(parent, element, {
      picture: GalleryItemComponent
    });
    this.root.dataset.width = 2;
    this.root.classList.add("blocks-gallery-grid");
  }

  initializeProperties() {
    this.properties.columns = { type: "number", min: 2, max: 4, target: this.root.dataset, attribute: "width" };
    this.properties.maxWidth = { type: "text", target: this.root.style, attribute: "maxWidth", optional: true };
    super.initializeProperties();
  }
}

