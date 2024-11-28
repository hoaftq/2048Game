class Game2048 extends HTMLElement {
    shadowRoot;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.style.display = "block";

        const iframe = document.createElement('iframe');
        iframe.scrolling = 'no';
        iframe.src = `${APP_URL}`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.borderWidth = 0;

        this.shadowRoot.appendChild(iframe);
    }
}

const elementName = 'game-2048';
customElements.define(elementName, Game2048);

export { elementName };
