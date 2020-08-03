export class OptionsList {
  elements: Option[]

  constructor(options: Option[]) {
    this.elements = options;
  }

  static fromLabels(labels: string[], defaultSelected: boolean) {
    return new OptionsList(labels.map(label => {
      return {optionLabel: label, optionSelected: defaultSelected}
    }))
  }

  toggleOptionWithLabel(filteredElementLabel: string) {
    return new OptionsList(this.elements.map(element => {
      if (element.optionLabel === filteredElementLabel) {
        return {...element, optionSelected: !element.optionSelected};
      }
      return element;
    }));
  }

  active(filteredElementLabel: string) {
    return this.elements.some(element => element.optionLabel === filteredElementLabel && element.optionSelected)
  }
}

export type Option = {
  optionLabel: string
  optionSelected: boolean
}
