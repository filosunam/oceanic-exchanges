import React, { Component } from "react";
import Select from "react-select";
import classNames from "classnames";

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
    const {
      id,
      error,
      label,
      required,
      options,
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
          <Select
            options={options}
            value={value}
            isMulti={multiple}
            isDisabled={disabled}
            noOptionsMessage={() => "No hay opciones"}
            className={inputClassName}
            onChange={data => this.onChange(data)}
            placeholder={placeholder}
            onChange={data => onChange(data)}
          />
        </div>
        {errorMessage}
      </div>
    );
  }
}

export default SelectWidget;
