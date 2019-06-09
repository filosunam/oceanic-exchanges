import React, { Component } from "react";
import InputRange from "react-input-range";
import Form from "~base/components/marble-form";

class EmbeddingsSettings extends Component {
  static defaultProps = {
    initialSettings: {
      perplexity: 5,
      earlyExaggeration: 1.1,
      learningRate: 1,
      maxIterations: 100
    }
  };

  constructor(props) {
    super(props);
    this.state = props.initialSettings;
  }

  onChangeSettings() {
    const { onChange } = this.props;
    const {
      perplexity,
      earlyExaggeration,
      learningRate,
      maxIterations
    } = this.state;

    if (onChange) {
      onChange({
        perplexity,
        earlyExaggeration,
        learningRate,
        maxIterations
      });
    }
  }

  onChangePerplexity(perplexity) {
    this.setState({
      perplexity
    });

    this.onChangeSettings();
  }

  onChangeEarlyExaggeration(earlyExaggeration) {
    this.setState({
      earlyExaggeration
    });

    this.onChangeSettings();
  }

  onChangeLearningRate(learningRate) {
    this.setState({
      learningRate
    });

    this.onChangeSettings();
  }

  onChangeMaxIterations(maxIterations) {
    this.setState({
      maxIterations
    });

    this.onChangeSettings();
  }

  onChangeDistanceMetric(distanceMetric) {
    this.setState({
      distanceMetric
    });

    this.onChangeSettings();
  }

  render() {
    const {
      perplexity,
      earlyExaggeration,
      learningRate,
      maxIterations
    } = this.state;

    return (
      <div className="columns is-multiline">
        <div className="column is-full is-margin-bottom-medium">
          <span>Perplexity</span>
          <span className="is-block is-margin-top-medium">
            <InputRange
              maxValue={50}
              minValue={5}
              value={perplexity}
              onChange={value => this.onChangePerplexity(value)}
            />
          </span>
        </div>

        <div className="column is-full is-margin-bottom-medium">
          <span>Early Exaggeration</span>
          <span className="is-block is-margin-top-medium">
            <InputRange
              maxValue={10}
              minValue={1.1}
              step={0.05}
              value={earlyExaggeration}
              formatLabel={value => value.toFixed(1)}
              onChange={value => this.onChangeEarlyExaggeration(value)}
            />
          </span>
        </div>

        <div className="column is-full is-margin-bottom-medium">
          <span>Learning Rate</span>
          <span className="is-block is-margin-top-medium">
            <InputRange
              maxValue={1000}
              minValue={1}
              step={1}
              value={learningRate}
              onChange={value => this.onChangeLearningRate(value)}
            />
          </span>
        </div>

        <div className="column is-full is-margin-bottom-medium">
          <span>Max Iterations</span>
          <span className="is-block is-margin-top-medium">
            <InputRange
              maxValue={500}
              minValue={100}
              step={1}
              value={maxIterations}
              onChange={value => this.onChangeMaxIterations(value)}
            />
          </span>
        </div>

        <div className="column is-full is-margin-bottom-medium">
          Distance Metric
          <Form
            schema={{
              distanceMetric: {
                widget: "SelectWidget",
                options: [
                  {
                    label: "Euclidean Distance"
                  },
                  {
                    label: "Manhattan Distance"
                  },
                  {
                    label: "Jaccard Dissimilarity"
                  },
                  {
                    label: "Dice Dissimilarity"
                  }
                ]
              }
            }}
            className="is-gapless"
            buttonClassName="is-hidden"
            onChange={({ distanceMetric }) =>
              this.onChangeDistanceMetric(distanceMetric)
            }
          />
        </div>
      </div>
    );
  }
}

export default EmbeddingsSettings;
