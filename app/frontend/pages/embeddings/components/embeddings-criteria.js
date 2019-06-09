import React, { Component } from "react";
import classNames from "classnames";
import Form from "~base/components/marble-form";
import { error } from "~base/components/toast";
import TermsWidget from "./terms-widget";
import SelectWidget from "./select-widget";

class EmbeddingsCriteria extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        year: { label: 1864, value: 1864 },
        terms: [
          { label: "maximiliano", value: "maximiliano" },
          { label: "juarez", value: "juarez" },
          { label: "carlota", value: "carlota" }
        ]
      },
      errors: {},
      errorMessage: "",
      successMessage: "",
      loading: false
    };
  }

  changeHandler(formData) {
    this.setState({
      formData
    });
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
      errorMessage,
      errors,
      successMessage,
      loading
    } = this.state;

    const fromYear = 1800;
    const untilYear = 1950;

    let rangeYears = [];

    for (let ii = untilYear; ii >= fromYear; ii--) {
      rangeYears.push({
        label: ii,
        value: ii
      });
    }

    const schema = {
      year: {
        widget: SelectWidget,
        options: rangeYears
      },
      terms: {
        widget: TermsWidget
      }
    };

    const buttonClassName = classNames(
      "button is-padding-left-large is-padding-right-large is-fullwidth is-primary",
      {
        "is-loading": loading
      }
    );

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
              <button className={buttonClassName} type="submit">
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
