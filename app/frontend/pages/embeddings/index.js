import React from "react";
import TSNE from "tsne-js";
import api from "~base/api-ocex";
import { error } from "~base/components/toast";
import PageComponent from "~base/page-component";
import EmbeddingsSettings from "./components/embeddings-settings";
import EmbeddingsCriteria from "./components/embeddings-criteria";
import "./index.scss";

class Embeddings extends PageComponent {
  constructor(props) {
    super(props);
    this.state = this.baseState;

    const initialSettings = {
      perplexity: 15,
      earlyExaggeration: 2.1,
      learningRate: 180,
      maxIterations: 150
    };

    this.state.initialSettings = initialSettings;
    this.state.currentSettings = initialSettings;
    this.state.iterations = [];
    this.state.embeddings = [];
    this.state.update = false;
  }

  componentDidUpdate() {
    const { iterations, embeddings, update } = this.state;
    const {
      progressIterations,
      progressError,
      progressGradNorm,
      embeddingSpace
    } = this.refs;

    if (update) {
      this.iterationTimers = this.iterationTimers || [];
      this.iterationTimers.map(clearTimeout);

      this.iterationTimers = iterations.map((iteration, index) =>
        setTimeout(() => {
          progressIterations.innerHTML = iteration.i + 1;
          progressError.innerHTML = iteration.error.toPrecision(7);
          progressGradNorm.innerHTML = iteration.gradNorm.toPrecision(5);
        }, index * 20)
      );
    }

    if (update) {
      embeddingSpace.innerHTML = "";
      this.draw();

      this.embeddingTimers = this.embeddingTimers || [];
      this.embeddingTimers.map(clearTimeout);

      this.embeddingTimers = embeddings.map((embedding, index) =>
        setTimeout(() => {
          this.drawUpdate(embedding);
        }, index * 20)
      );

      this.setState({ update: false });
    }
  }

  drawUpdate(embedding) {
    const { embeddingSpace } = this.refs;
    const embeddingSpaceWidth = embeddingSpace.clientWidth;
    const embeddingSpaceHeight = embeddingSpace.clientHeight;
    for (let n = 0; n < embedding.length; n++) {
      const c = document.getElementById(`sample-${n}`);
      c.style.transform = `translateX(${((embedding[n][0] + 1) *
        embeddingSpaceWidth -
        120) /
        3}px) translateY(${((embedding[n][1] + 1) * embeddingSpaceHeight) /
        3}px)`;
    }
  }

  draw() {
    const {
      series: { terms, embeddings }
    } = this.state;
    const { embeddingSpace } = this.refs;

    for (let n = 0; n < embeddings.length; n += 1) {
      const c = document.createElement("canvas");
      c.setAttribute("class", "sample");
      c.setAttribute("id", `sample-${n}`);
      c.setAttribute("width", 120);
      c.setAttribute("height", 28);
      embeddingSpace.appendChild(c);
      const ctx = c.getContext("2d");
      ctx.font = "18px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(terms[n], c.width / 2, c.height / 2);
    }
  }

  onChangeSettings(currentSettings) {
    this.setState({
      currentSettings
    });
  }

  async onSubmit(data) {
    const {
      currentSettings: {
        perplexity,
        earlyExaggeration,
        learningRate,
        maxIterations: nIter
      }
    } = this.state;

    try {
      const series = await this.getSeries(data);

      const model = new TSNE({
        dim: 2,
        perplexity,
        earlyExaggeration,
        learningRate,
        nIter,
        metric: "euclidean"
      });

      console.log("TSNE model settings => ", {
        dim: 2,
        perplexity,
        earlyExaggeration,
        learningRate,
        nIter,
        metric: "euclidean"
      });

      model.init({
        data: series.embeddings || [],
        type: "dense"
      });

      const iterations = [];
      model.on("progressIter", ([i, error, gradNorm]) => {
        iterations.push({
          i,
          error,
          gradNorm
        });
      });

      const embeddings = [];
      model.on("progressData", embedding => {
        embeddings.push(embedding);
      });

      model.run();

      this.setState({ series, iterations, embeddings, update: true });
    } catch (err) {
      error(err.message);
    }
  }

  async getSeries(data) {
    const { terms, year } = data;
    const formattedTerms = terms.map(({ value }) => value);
    return api.get(`/embeddings/${year.value}`, {
      q: formattedTerms.join(" ")
    });
  }

  render() {
    const basicStates = super.getBasicStates();

    if (basicStates) {
      return basicStates;
    }

    const { initialSettings } = this.state;

    return (
      <section className="section content">
        <div className="container is-fluid">
          <div className="columns">
            <div className="column">
              <h2>Embeddings</h2>
            </div>
          </div>

          <div className="columns">
            <div className="column is-4">
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
              <EmbeddingsCriteria onSubmit={data => this.onSubmit(data)} />

              <div className="embedding-space-container">
                <div className="embedding-space" ref="embeddingSpace" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Embeddings.config({
  path: "/embeddings",
  title: "Embeddings",
  exact: true
});

export default Embeddings;
