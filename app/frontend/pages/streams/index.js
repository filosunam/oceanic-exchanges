import React, { Fragment } from "react";
import { get } from "lodash";
import Chart from "chart.js";
import api from "~base/api-ocex";
import PageComponent from "~base/page-component";
import StreamsCriteria from "~components/streams/criteria";

const randomColor = function() {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}

class Streams extends PageComponent {
  constructor(props) {
    super(props);
    this.state = this.baseState;

    this.state.availableYears = [];
    this.state.streamData = {
      years: [],
      stream: [],
      total_years: 0,
      total_terms: 0
    }
    this.state.terms = [];
    this.state.fromYear = 1850;
    this.state.toYear = 1900;
    this.state.topRelated = 100;
    this.state.maxLinks = 200;
    this.state.maxAdaptiveTerms = 10;
    this.state.minSimAdaptive = 0.3;
  }

  async onFirstPageEnter() {
    const availableYears = await this.loadYears();
    return { availableYears };
  }

  draw() {
    const {
      streamData: {
        stream,
        years: labels
      }
    } = this.state;

    const datasets = stream.map(({
      dataset_label,
      dataset_values
    }) => ({
      label: dataset_label,
      data: dataset_values,
      backgroundColor: randomColor()
    }));

    this.chart = new Chart(this.chartRef, {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        title: {
          display: false,
        },
        tooltips: {
          mode: 'nearest',
        },
        hover: {
          mode: 'nearest'
        },
        legend: {
          display: datasets.length < 100 ? true : false,
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Año'
            }
          }],
          yAxes: [{
            stacked: true,
            scaleLabel: {
              display: true,
              labelString: 'Peso acumulado'
            }
          }]
        }
      }
    });
  }

  async onChangeSettings({
    terms,
    fromYear,
    toYear,
    topRelated,
    maxLinks,
    maxAdaptiveTerms,
    minSimAdaptive
  }) {
    if (terms.length > 0) {
      await this.loadStreamData({
        fromYear: fromYear.value,
        toYear: toYear.value,
        terms: terms.map(({ value }) => value),
        minSimAdaptive,
        maxLinks,
        maxAdaptiveTerms,
        topRelated
      })
  
      this.draw();
    }
  }

  async onSubmit({
    fromYear,
    toYear,
    terms,
    minSimAdaptive,
    maxLinks,
    maxAdaptiveTerms,
    topRelated
  }) {
    await this.loadStreamData({
      fromYear: fromYear.value,
      toYear: toYear.value,
      terms: terms.map(({ value }) => value),
      minSimAdaptive,
      maxLinks,
      maxAdaptiveTerms,
      topRelated
    })

    this.draw();
  }

  async loadYears() {
    const res = await api.get("/years");
    return get(res, "years", []);
  }

  async loadStreamData({
    fromYear,
    toYear,
    terms,
    minSimAdaptive,
    maxLinks,
    maxAdaptiveTerms,
    topRelated
  }) {
    const query = {
      q: terms.join(' '),
      ini_year: fromYear,
      fin_year: toYear,
      top_related: topRelated,
      max_links: maxLinks,
      max_adaptive_terms: maxAdaptiveTerms,
      min_sim_adaptive: minSimAdaptive
    }
    const streamData = await api.get(`/stream/${fromYear}/${toYear}`, query);
    
    this.setState({
      streamData
    });
  }

  render() {
    const {
      availableYears,
      fromYear,
      toYear,
      terms,
      minSimAdaptive,
      maxLinks,
      maxAdaptiveTerms,
      topRelated
    } = this.state;

    return (
      <section className="section content">
        <div className="container is-fluid">
          <div className="columns">
            <div className="column is-4">
            <h2>Streams</h2>
          <br />

              <StreamsCriteria
                availableYears={availableYears}
                initialSettings={{
                  fromYear,
                  toYear,
                  terms,
                  minSimAdaptive,
                  maxLinks,
                  maxAdaptiveTerms,
                  topRelated
                }}
                onChange={settings => this.onChangeSettings(settings)}
                onSubmit={data => this.onSubmit(data)}
              />
            </div>
            <div className="column">
              <canvas ref={(node) => this.chartRef = node} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Streams.config({
  path: "/streams",
  title: "Streams",
  exact: true
});

export default Streams;
