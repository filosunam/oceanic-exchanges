import React, { Component } from "react";
import { Creatable } from "react-select";

class TermsWidget extends Component {
  static defaultProps = {
    placeholder: "",
    value: [],
    error: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      inputValue: props.inputValue || ""
    };
  }

  onBlur(e) {
    const { value, onChange } = this.props;
    if (e.target.value) {
      const newValue = value.concat({
        label: e.target.value,
        value: e.target.value
      });
      onChange(newValue);
    }
  }

  onInputChange(inputValue) {
    const { value, onChange } = this.props;

    this.setState({ inputValue });
    if (inputValue) {
      const splitValues = inputValue.split(/[ ,]+/);
      if (splitValues.length > 1) {
        const values = splitValues
          .filter(exists => exists)
          .map(splitValue => ({
            label: splitValue,
            value: splitValue
          }));
        const newValue = value.concat(values);

        this.setState({ inputValue: "" }, () => {
          onChange(newValue);
        });
      }
    }
  }

  render() {
    const { inputValue } = this.state;
    const { error, term, placeholder, onChange, value } = this.props;

    let errorMessage;
    if (error) {
      errorMessage = <p className="help is-danger">{error}</p>;
    }

    return (
      <div className="column">
        <div className="field">
          <label className="label">Términos</label>
          <div className="control">
            <Creatable
              options={[]}
              isMulti
              value={value}
              inputValue={inputValue}
              noOptionsMessage={() => "Empieza a escribir..."}
              className="input-terms is-fullwidth"
              formatCreateLabel={term => `Agregar término "${term}"`}
              onInputChange={data => this.onInputChange(data)}
              placeholder={placeholder}
              onChange={data => onChange(data)}
              onBlur={data => this.onBlur(data)}
              onBlurResetsInput={false}
            />
          </div>
          {errorMessage}
        </div>
      </div>
    );
  }
}

export default TermsWidget;
