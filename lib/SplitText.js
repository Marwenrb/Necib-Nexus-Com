export class SplitText {
  constructor(element, options = {}) {
    this.element =
      typeof element === 'string' ? document.querySelector(element) : element
    this.options = {
      type: options.type || 'lines',
      linesClass: options.linesClass || '',
      tag: options.tag || 'div',
      lineThreshold: options.lineThreshold || 0.5,
    }

    this.lines = []

    if (this.element) {
      this.split()
    }
  }

  split() {
    const text = this.element.innerHTML
    this.element.innerHTML = ''

    if (this.options.type.includes('lines')) {
      // Split by lines (simple implementation - just creates a div per line)
      const lines = text.split('<br>')

      lines.forEach((line) => {
        const lineEl = document.createElement(this.options.tag)
        lineEl.innerHTML = line

        if (this.options.linesClass) {
          lineEl.classList.add(this.options.linesClass)
        }

        this.element.appendChild(lineEl)
        this.lines.push(lineEl)
      })
    }

    return this
  }

  revert() {
    if (this.element && this._originalContent) {
      this.element.innerHTML = this._originalContent
    }
  }
}
