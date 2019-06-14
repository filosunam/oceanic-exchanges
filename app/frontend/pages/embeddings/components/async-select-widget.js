import React, { Component } from "react";
import AsyncSelect from "react-select/lib/Async";
import classNames from "classnames";

class AsyncSelectWidget extends Component {
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
      defaultOptions,
      className,
      placeholder,
      onChange,
      multiple,
      loadOptions,
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
          <AsyncSelect
            defaultOptions={defaultOptions}
            value={value}
            isMulti={multiple}
            loadOptions={loadOptions}
            cacheOptions
            isDisabled={disabled}
            noOptionsMessage={() => "Empieza a escribir..."}
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

export default AsyncSelectWidget;
