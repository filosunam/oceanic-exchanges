import React, { Component } from "react";
import { Creatable } from "react-select";
import classNames from "classnames";

class CreatableSelectWidget extends Component {
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
    const {
      id,
      error,
      label,
      required,
      defaultOptions,
      className,
      placeholder,
      onChange,
      multiple,
      disabled,
      value
    } = this.props;

    let errorMessage;

    if (error) {
      errorMessage = <p className="help is-danger">{error}</p>;
    }

    const fieldClassName = classNames("field column", className);

    const inputClassName = classNames({
      "is-danger": !error
    });

    return (
      <div className={fieldClassName}>
        <label className="label" htmlFor={id}>
          {label}
          {required && <span className="required">*</span>}
        </label>
        <div className="control">
          <Creatable
            defaultOptions={defaultOptions}
            value={value}
            isMulti={multiple}
            isDisabled={disabled}
            inputValue={inputValue}
            noOptionsMessage={() => "Empieza a escribir..."}
            className={inputClassName}
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
    );
  }
}

export default CreatableSelectWidget;
