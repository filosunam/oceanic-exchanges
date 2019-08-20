import React, { Fragment } from "react";
import { get } from "lodash";
import Graph from "vis-react";
import api from "~base/api-ocex";
import Form from "~base/components/marble-form";
import PageComponent from "~base/page-component";
import NetworksCriteria from "~components/networks/criteria";
import InputRangeWidget from "~components/form/input-range-widget";

class Networks extends PageComponent {
  constructor(props) {
    super(props);
    this.state = this.baseState;

    this.state.availableYears = [];
    this.state.networkData = {
      networks: [],
      total_networks: 0
    }
  }

  async onFirstPageEnter() {
    const availableYears = await this.loadYears();
    return { availableYears };
  }

  onChangeSettings() {
    const { onChange } = this.props;
    const {
      terms,
      fromYear,
      toYear,
      topRelated,
      maxLinks,
      maxAdaptiveTerms,
      minSimAdaptive
    } = this.state;

    if (onChange) {
      onChange({
        terms,
        fromYear,
        toYear,
        topRelated,
        maxLinks,
        maxAdaptiveTerms,
        minSimAdaptive
      });
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
    await this.loadNetworkData({
      fromYear: fromYear.value,
      toYear: toYear.value,
      terms: terms.map(({ value }) => value),
      minSimAdaptive,
      maxLinks,
      maxAdaptiveTerms,
      topRelated
    })
  }

  async loadYears() {
    const res = await api.get("/years");
    return get(res, "years", []);
  }

  async loadNetworkData({
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
    const networkData = await api.get(`/networks/${fromYear}/${toYear}`, query);
    
    this.setState({
      currentNetwork: networkData.networks[0],
      networkData,
      currentYear: networkData.networks[0].title
    })
  }

  onChangeCurrentYear ({ currentYear }) {
    const { networkData } = this.state;
    const currentNetwork = networkData.networks.find(({ title }) => title === currentYear.toString());
    this.setState({ currentNetwork, currentYear })
  }

  render() {
    const { availableYears, currentNetwork, currentYear } = this.state;

    const events = {
      select: function(event) {
        var { nodes, edges } = event;
      }
    };

    const fromYear = Math.min(...availableYears);
    const toYear = Math.max(...availableYears);

    const options = {
      layout: {
        improvedLayout: true,
      },
      width: '100%',
      nodes: {
        shape: 'dot',
        scaling: {
          min: 10,
          max: 15,
          label: {
            min: 3,
            max: 15,
            drawThreshold: 3,
            maxVisible: 15
          }
        },
        font: {
          size: 12,
          face: 'Helvetica, Arial, sans-serif'
        }
      },
      edges: {
        width: 0.15,
        color: {
          inherit: 'from'
        },
        smooth: {
          type: 'continuous'
        }
      },
	    physics: {
        minVelocity: 0.75
      },
      interaction: {
        tooltipDelay: 200,
        hideEdgesOnDrag: true
      }
    };

    return (
      <section className="section content">
        <div className="container is-fluid">
          <div className="columns">
            <div className="column is-4">
            <h2>Networks</h2>
          <br />

              <NetworksCriteria
                availableYears={availableYears}
                initialSettings={{
                  perplexity: 15,
                  earlyExaggeration: 2.1,
                  learningRate: 180,
                  maxIterations: 150,
                  distanceMetric: "euclidean"
                }}
                onChange={settings => this.onChangeSettings(settings)}
                onSubmit={data => this.onSubmit(data)}
              />
            </div>
            <div className="column">
              {currentNetwork && <Fragment>
                <Form
                  formData={{ currentYear }}
                  schema={{
                    currentYear: {
                      label: <div className="is-padding-bottom-small">
                        Elige un año
                      </div>,
                      className: "is-10 is-offset-1",
                      widget: InputRangeWidget,
                      minValue: fromYear,
                      maxValue: toYear
                    }
                  }}
                  onChange={data => this.onChangeCurrentYear(data)}
                  handleMessages={false}
                >
                  <div />
                </Form>

                <Graph
                graph={{
                  nodes: currentNetwork.nodes.map(node => ({
                    ...node,
                    size: parseInt(node.size, 10)
                  })),
                  edges: currentNetwork.edges
                }}
                options={options}
                events={events}
                style={{
                  width: "100%",
                  height: "80vh"
                }}
                // getNetwork={this.getNetwork}
                // getEdges={this.getEdges}
                // getNodes={this.getNodes}
                vis={vis => (this.vis = vis)}
                />
              </Fragment>}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Networks.config({
  path: "/networks",
  title: "Networks",
  exact: true
});

export default Networks;
