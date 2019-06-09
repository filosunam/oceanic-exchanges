import React, { Component } from "react";
import Select from "react-select";

class SelectWidget extends Component {
  static defaultProps = {
    placeholder: "",
    value: [],
    error: ""
  };

  onChange(inputValue) {
    const { onChange } = this.props;
    onChange(inputValue);
  }

  render() {
    const { error, options, placeholder, onChange, value } = this.props;

    let errorMessage;
    if (error) {
      errorMessage = <p className="help is-danger">{error}</p>;
    }

    return (
      <div className="column is-2 is-narrow">
        <div className="field">
          <label className="label">Año</label>
          <div className="control">
            <Select
              options={options}
              value={value}
              noOptionsMessage={({ inputValue }) =>
                `${inputValue} no es un año válido`
              }
              className="input-terms is-fullwidth"
              onChange={data => this.onChange(data)}
              placeholder={placeholder}
              onChange={data => onChange(data)}
            />
          </div>
          {errorMessage}
        </div>
      </div>
    );
  }
}

export default SelectWidget;
