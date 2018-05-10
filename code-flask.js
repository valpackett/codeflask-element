import CodeFlask from 'codeflask'

export default class CodeFlaskElement extends HTMLElement {
	constructor () {
		super()
		this.attachShadow({ mode: 'open' })
		this.shadowRoot.innerHTML += `<style> :host { display: block; position: relative;
				overflow-x: auto; min-height: 100px; }
			.codeflask .token.punctuation { color: var(--codeflask-punctuation, #4a4a4a) }
			.codeflask .token.keyword { color: var(--codeflask-keyword, #8500ff) }
			.codeflask .token.operator { color: var(--codeflask-operator, #ff5598) }
			.codeflask .token.string { color: var(--codeflask-string, #41ad8f) }
			.codeflask .token.comment { color: var(--codeflask-comment, #9badb7) }
			.codeflask .token.function { color: var(--codeflask-function, #8500ff) }
			.codeflask .token.boolean { color: var(--codeflask-boolean, #8500ff) }
			.codeflask .token.number { color: var(--codeflask-number, #8500ff) }
			.codeflask .token.selector { color: var(--codeflask-selector, #8500ff) }
			.codeflask .token.property { color: var(--codeflask-property, #8500ff) }
			.codeflask .token.tag { color: var(--codeflask-tag, #8500ff) }
			.codeflask .token.attr-value { color: var(--codeflask-attr-value, #8500ff) }
		</style>`
		this.editorElement = document.createElement('div')
		this.editorElement.style.width = '100%'
		this.editorElement.style.height = '100%'
		this.editorElement.style.position = 'absolute'
		this.shadowRoot.appendChild(this.editorElement)
		this.flask = new CodeFlask(this.editorElement, {
			language: this.getAttribute('language') || 'markup',
			lineNumbers: this.lineNumbers,
			rtl: this.dir === 'rtl',
			defaultTheme: false,
			styleParent: this.shadowRoot,
		})
		this.flask.onUpdate(_ => {
			this.dispatchEvent(new CustomEvent('value-changed'))
		})
		this.value = this.getAttribute('value')
		if (!this.value) {
			this.initElement = document.createElement('div')
			this.shadowRoot.appendChild(this.initElement)
			this.initSlot = document.createElement('slot')
			this.initElement.appendChild(this.initSlot)
		}
	}

	connectedCallback () {
		if (this.initSlot) {
			let value = ''
			for (const node of this.initSlot.assignedNodes()) {
				value += node.outerHTML || node.textContent
			}
			this.initElement.removeChild(this.initSlot)
			this.shadowRoot.removeChild(this.initElement)
			if (value.length > 0) {
				this.value = value
			}
		}
	}

	get value () {
		return this.flask.getCode()
	}

	set value (val) {
		this.removeAttribute('value')
		return this.flask.updateCode(val)
	}

	get language () {
		return this.flask.opts.language
	}

	set language (val) {
		if (!val) {
			return
		}
		this.flask.updateLanguage(val)
		this.dispatchEvent(new CustomEvent('language-changed'))
	}

	get dir () {
		return this.getAttribute('dir') || 'ltr'
	}

	get lineNumbers () {
		return this.hasAttribute('line-numbers')
	}

	static get observedAttributes () {
		return ['language', 'value']
	}

	attributeChangedCallback (name, oldValue, newValue) {
		this[name] = newValue
	}
}

customElements.define('code-flask', CodeFlaskElement)
