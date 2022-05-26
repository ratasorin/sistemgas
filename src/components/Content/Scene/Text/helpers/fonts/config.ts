export interface FontConfigurationsProps {
  firstValueDefault: boolean;
  options: (string | number)[];
  keywords?: string | string[];
}

export class FontConfigurations {
  options = [] as (string | number)[];
  keywords: string[] | string | undefined;
  defaultValue: string | number;
  index = 0;
  /**
   * @param firstValueDefault Is a boolean used in deciding if the value used after all the options are exhausted
   * is the first value inputted or the last.
   *
   * @param options Is an array of string | number type values used for customizing text.
   */
  constructor(fontConfigs: FontConfigurationsProps) {
    this.options = fontConfigs.options;
    fontConfigs.firstValueDefault
      ? (this.defaultValue = this.options[this.index])
      : (this.defaultValue = this.options[this.options.length]);
    this.keywords = fontConfigs.keywords;
  }

  find(word: string) {
    if (!this.keywords) return false;
    if (typeof this.keywords === "string" && this.keywords === word) {
      return true;
    }
    if (Array.isArray(this.keywords)) {
      return this.keywords.find((keyword) => keyword === word) === undefined
        ? false
        : true;
    }
  }

  change(word: string): void {
    if (this.find(word)) {
      this.index++;
    }
  }

  get current() {
    if (this.index === this.options.length) return this.defaultValue;
    return this.options[this.index];
  }
}
