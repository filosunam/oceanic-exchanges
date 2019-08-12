import React, { Component } from "react";
import InputRange from "react-input-range";
import classNames from "classnames";

class InputRangeWidget extends Component {
  static defaultProps = {
    error: "",
    disabled: false
  };

  onChange(value) {
    const { onChange } = this.props;
    onChange(value);
  }

  render() {
    const {
      id,
      error,
      label,
      required,
      className,
      disabled,
      maxValue,
      minValue,
      step,
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
          <InputRange
            step={step}
            disabled={disabled}
            className={inputClassName}
            maxValue={maxValue}
            minValue={minValue}
            value={value || minValue}
            onChange={data => this.onChange(data)}
          />
        </div>
        {errorMessage}
      </div>
    );
  }
}

export default InputRangeWidget;
