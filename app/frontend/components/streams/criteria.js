import React, { Component } from "react";
import classNames from "classnames";
import Form from "~base/components/marble-form";
import { error } from "~base/components/toast";
import SelectWidget from "~components/form/select-widget";
import CreatableSelectWidget from "~components/form/creatable-select-widget";
import InputRangeWidget from "~components/form/input-range-widget";

class Criteria extends Component {
  static defaultProps = {
    availableYears: []
  };

  constructor(props) {
    super(props);

    this.state = {
      formData: {
        topRelated: 100,
        maxLinks: 200,
        maxAdaptiveTerms: 10,
        minSimAdaptive: 0.3,
        terms: []
      },
      currentTerms: [],
      errors: {},
      errorMessage: "",
      successMessage: "",
      loading: false,
      loadingTerms: false
    };
  }

  componentWillReceiveProps (props) {
    const { formData } = this.state;
    const { availableYears } = props;
    const fromYear = Math.min(...availableYears);
    const toYear = Math.max(...availableYears);

    this.setState({
      formData: {
        fromYear: { label: fromYear, value: fromYear },
        toYear: { label: toYear, value: toYear },
        ...formData,
      }
    })
  }

  changeHandler(formData) {
    const { onChange } = this.props;
    const errors = {};

    if (!formData.toYear) {
      errors.toYear = "El año inicial es requerido";
    }
    
    if (!formData.fromYear) {
      errors.fromYear = "El año final es requerido";
    }

    if (!formData.terms.length) {
      errors.terms = "Al menos un término es requerido";
    }

    if (onChange) {
      onChange(formData, errors);
    }

    this.setState({
      formData,
      errors
    });
  }

  async loadTerms(inputValue) {
    const { formData } = this.state;
    const { loadTermsByYear } = this.props;

    const terms = await loadTermsByYear(formData.year.value);
    const formattedTerms = terms.map(term => ({ value: term, label: term }));
    return formattedTerms.filter(({ label }) =>
      label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }

  async submitHandler() {
    const { formData } = this.state;
    const { onSubmit } = this.props;

    this.setState({
      loading: true
    });

    return onSubmit(formData);
  }

  errorHandler(err) {
    this.setState({
      loading: false
    });
    error(err.message);
  }

  successHandler() {
    this.setState({
      loading: false
    });
  }

  render() {
    const {
      formData,
      errorMessage,
      errors,
      successMessage,
      loading
    } = this.state;
    const { availableYears } = this.props;
    const fromYear = Math.min(...availableYears);
    const toYear = Math.max(...availableYears);

    const rangeYears = []

    for (let ii = fromYear; ii <= toYear; ii++) {
      rangeYears.push({
        label: ii,
        value: ii
      })
    }

    const schema = {
      fromYear: {
        label: "¿De qué año?",
        className: "is-6",
        required: true,
        widget: SelectWidget,
        options: rangeYears
      },
      toYear: {
        label: "¿A qué año?",
        className: "is-6",
        required: true,
        widget: SelectWidget,
        options: rangeYears
      },
      terms: {
        label: "Agrega términos",
        className: "is-12",
        required: true,
        widget: CreatableSelectWidget,
        multiple: true
      },
      topRelated: {
        label: (
          <small className="is-padding-bottom-small is-inline-block">
            Número máximo de posible términos por nodo
          </small>
        ),
        className: "is-12 is-padding-bottom-large",
        required: true,
        widget: InputRangeWidget,
        minValue: 1,
        maxValue: 200
      },
      maxLinks: {
        label: (
          <small className="is-padding-bottom-small is-inline-block">
            Máximo número de links en red
          </small>
        ),
        className: "is-12 is-padding-bottom-large",
        required: true,
        widget: InputRangeWidget,
        minValue: 100,
        maxValue: 1000
      },
      maxAdaptiveTerms: {
        label: (
          <small className="is-padding-bottom-small is-inline-block">
            Número máximo de posible de nuevos términos
          </small>
        ),
        className: "is-12 is-padding-bottom-large",
        required: true,
        widget: InputRangeWidget,
        minValue: 1,
        maxValue: 100
      },
      minSimAdaptive: {
        label: (
          <small className="is-padding-bottom-small is-inline-block">
            Similitud mínima
          </small>
        ),
        className: "is-12",
        required: true,
        widget: InputRangeWidget,
        minValue: 0,
        maxValue: 1,
        step: 0.05
      }
    };

    const buttonClassName = classNames(
      "button is-padding-left-large is-padding-right-large is-fullwidth is-primary",
      {
        "is-loading": loading
      }
    );

    const isButtonDisabled = Object.keys(errors).length > 0;

    return (
      <div className="columns is-multiline is-marginless-bottom">
        <div className="column is-full is-margin-bottom-medium">
          <Form
            formData={{ ...formData }}
            schema={schema}
            successMessage={successMessage}
            errorMessage={errorMessage}
            errors={errors}
            onSubmit={data => this.submitHandler(data)}
            onSuccess={data => this.successHandler(data)}
            onError={data => this.errorHandler(data)}
            onChange={data => this.changeHandler(data)}
            handleMessages={false}
          >
            <div className="column is-narrow">
              <div className="is-padding-top-large is-hidden-mobile" />
              <button
                disabled={isButtonDisabled}
                className={buttonClassName}
                type="submit"
              >
                Calcular
              </button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default Criteria;
