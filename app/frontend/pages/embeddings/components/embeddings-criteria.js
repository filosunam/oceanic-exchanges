import React, { Component } from "react";
import classNames from "classnames";
import Form from "~base/components/marble-form";
import { error } from "~base/components/toast";
import SelectWidget from "./select-widget";
import AsyncSelectWidget from "./async-select-widget";

class EmbeddingsCriteria extends Component {
  static defaultProps = {
    availableYears: []
  };

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        terms: [],
        year: {}
      },
      currentTerms: [],
      errors: {},
      errorMessage: "",
      successMessage: "",
      loading: false,
      loadingTerms: false
    };
  }

  changeHandler(formData) {
    const { formData: previousFormData } = this.state;
    const errors = {};

    if (!formData.year) {
      errors.year = "El año es requerido";
    }

    if (!formData.terms) {
      errors.terms = "Los términos son requeridos";
    }

    if (formData.terms && !formData.terms.length) {
      errors.terms = "Al menos un término es requerido";
    }

    if (formData.year !== previousFormData.year) {
      formData.terms = [];
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
      currentTerms,
      errorMessage,
      errors,
      successMessage,
      loading
    } = this.state;
    const { availableYears } = this.props;

    const schema = {
      year: {
        label: "Selecciona un año",
        required: true,
        className: "is-3 is-narrow",
        widget: SelectWidget,
        options: availableYears.map(value => ({
          label: value,
          value
        }))
      },
      terms: {
        label: "Selecciona términos",
        required: true,
        disabled: !formData.year,
        widget: AsyncSelectWidget,
        multiple: true,
        loadOptions: term => this.loadTerms(term),
        options: []
      }
    };

    const buttonClassName = classNames(
      "button is-padding-left-large is-padding-right-large is-fullwidth is-primary",
      {
        "is-loading": loading
      }
    );

    const isButtonDisabled =
      Object.keys(errors).length > 0 || !formData.terms.length;

    return (
      <div className="columns is-multiline is-marginless-bottom">
        <div className="column is-full is-margin-bottom-medium">
          <Form
            formData={{ ...formData }}
            schema={schema}
            buttonLabel="Buscar"
            className="columns is-multiline is-paddingless is-marginless is-variable is-fullwidth"
            successMessage={successMessage}
            errorMessage={errorMessage}
            errors={errors}
            buttonContainerClassName="column is-3"
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
                Buscar
              </button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default EmbeddingsCriteria;
