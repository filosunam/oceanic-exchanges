import React from "react";
import { get } from "lodash";
import env from "~base/env-variables";
import api from "~base/api-ocex";
import { error } from "~base/components/toast";
import PageComponent from "~base/page-component";
import EmbeddingsSettings from "~components/embeddings/embeddings-settings";
import EmbeddingsCriteria from "~components/embeddings/embeddings-criteria";
import "./index.scss";

class Embeddings extends PageComponent {
  constructor(props) {
    super(props);
    this.state = this.baseState;

    const initialSettings = {
      perplexity: 15,
      earlyExaggeration: 2.1,
      learningRate: 180,
      maxIterations: 150,
      distanceMetric: "euclidean"
    };

    this.state.initialSettings = initialSettings;
    this.state.currentSettings = initialSettings;
    this.state.currentCriteria = {};
    this.state.iterations = [];
    this.state.embeddings = [];
    this.state.update = false;
    this.state.availableYears = [];

    this.worker = new Worker(`${env.PREFIX}/public/js/workfile.js`);
  }

  onPageEnter() {
    this.worker.onmessage = ({ data: message }) => {
      const { progressIterations, progressError, progressGradNorm } = this.refs;
      switch (message.type) {
        case "PROGRESS_ITER":
          progressIterations.innerHTML = message.data[0] + 1;
          progressError.innerHTML = message.data[1].toPrecision(7);
          progressGradNorm.innerHTML = message.data[2].toPrecision(5);
          break;
        case "PROGRESS_DATA":
          this.drawUpdate(message.data);
          break;
        case "DONE":
          this.drawUpdate(message.data);
          break;
        default:
      }
    };
  }

  async onFirstPageEnter() {
    const availableYears = await this.loadYears();
    return { availableYears };
  }

  drawUpdate(embedding) {
    const embeddingSpace = document.getElementById("embeddingSpace");
    const embeddingSpaceWidth = embeddingSpace.clientWidth;
    const embeddingSpaceHeight = embeddingSpace.clientHeight;
    for (let n = 0; n < embedding.length; n++) {
      const c = document.getElementById(`sample-${n}`);
      c.setAttribute("class", "sample sample-rendered");
      c.style.transform = `translateX(${(embedding[n][0] + 1) *
        (embeddingSpaceWidth / 2 - 60)}px) translateY(${(embedding[n][1] + 1) *
        (embeddingSpaceHeight / 2 - 14)}px)`;
    }
  }

  draw(samples = 0) {
    const {
      series: { terms, embeddings }
    } = this.state;
    const { embeddingSpace } = this.refs;
    embeddingSpace.innerHTML = "";

    let formattedEmbeddings = embeddings;
    let formattedTerms = terms;

    if (samples > 0) {
      formattedEmbeddings = embeddings.slice(0, samples);
      formattedTerms = terms.slice(0, samples);
    }

    for (let n = 0; n < formattedEmbeddings.length; n += 1) {
      const c = document.createElement("canvas");
      c.setAttribute("class", "sample");
      c.setAttribute("id", `sample-${n}`);
      c.setAttribute("width", 120);
      c.setAttribute("height", 28);
      embeddingSpace.appendChild(c);
      const ctx = c.getContext("2d");
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.fillText(formattedTerms[n], c.width / 2, c.height / 2);
    }
  }

  onChangeSettings(currentSettings) {
    this.setState({
      currentSettings
    });
  }

  onChangeCriteria(currentCriteria) {
    this.setState({
      currentCriteria
    });
  }

  async onSubmit(data) {
    const {
      currentCriteria: { samples },
      currentSettings: {
        perplexity,
        earlyExaggeration,
        learningRate,
        maxIterations: nIter,
        distanceMetric: metric
      }
    } = this.state;

    let series;

    try {
      series = await this.loadSeries(data);
      if (samples.value > 0) {
        series.embeddings = series.embeddings.slice(0, samples.value);
        series.terms = series.terms.slice(0, samples.value);
      }
      this.setState({ series });
    } catch (err) {
      error(err.message);
    }

    if (series) {
      this.draw(samples.value);

      this.worker.postMessage({
        type: "INPUT_DATA",
        data: series.embeddings
      });

      const tsneSettings = {
        perplexity,
        earlyExaggeration,
        learningRate,
        nIter,
        metric
      };

      this.worker.postMessage({
        type: "RUN",
        data: tsneSettings
      });
      console.log("TSNE model settings => ", tsneSettings);
    }
  }

  async loadSeries(data) {
    const { terms, year, samples } = data;

    if (samples.value > 0) {
      return api.get(`/random_embeddings/${year.value}`);
    }

    const formattedTerms = terms.map(({ value }) => value);

    return api.get(`/embeddings/${year.value}`, {
      q: formattedTerms.join(" ")
    });
  }

  async loadYears() {
    const res = await api.get("/years");
    return get(res, "years", []);
  }

  async loadTermsByYear(year) {
    const res = await api.get(`/voca/${year}`);
    return get(res, "vocabulary", []);
  }

  render() {
    const basicStates = super.getBasicStates();

    if (basicStates) {
      return basicStates;
    }

    const { initialSettings, availableYears } = this.state;

    return (
      <section className="section content">
        <div className="container is-fluid">
          <div className="columns">
            <div className="column is-3">
              <h2>Embeddings</h2>

              <br />

              <EmbeddingsSettings
                initialSettings={initialSettings}
                onChange={settings => this.onChangeSettings(settings)}
              />

              <div className="box">
                <div className="is-margin-bottom-small">
                  <div className="tag is-margin-right-small">
                    <span className="has-text-weight-bold">Iterations</span>
                  </div>
                  <span className="is-size-7" ref="progressIterations">
                    0
                  </span>
                </div>

                <div className="is-margin-bottom-small">
                  <div className="tag is-margin-right-small">
                    <span className="has-text-weight-bold">Error</span>
                  </div>
                  <span className="is-size-7" ref="progressError">
                    0
                  </span>
                </div>

                <div className="is-margin-bottom-small">
                  <div className="tag is-margin-right-small">
                    <span className="has-text-weight-bold">
                      Gradient vector norm
                    </span>
                  </div>
                  <span className="is-size-7" ref="progressGradNorm">
                    0
                  </span>
                </div>
              </div>
            </div>
            <div className="column">
              <EmbeddingsCriteria
                availableYears={availableYears}
                loadTermsByYear={data => this.loadTermsByYear(data)}
                onChange={data => this.onChangeCriteria(data)}
                onSubmit={data => this.onSubmit(data)}
              />

              <div className="embedding-space-container">
                <div
                  id="embeddingSpace"
                  className="embedding-space"
                  ref="embeddingSpace"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Embeddings.config({
  path: "/",
  title: "Embeddings",
  exact: true
});

export default Embeddings;
