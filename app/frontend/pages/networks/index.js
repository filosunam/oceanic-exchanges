import React from "react";
import Graph from "vis-react";
import PageComponent from "~base/page-component";
import NetworksCriteria from "~components/networks/criteria";

class Networks extends PageComponent {
  constructor(props) {
    super(props);
    this.state = this.baseState;
  }

  onPageEnter() {
    this.graph = {
      nodes: [
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        { id: 3, label: "Node 3" },
        { id: 4, label: "Node 4" },
        { id: 5, label: "Node 5" }
      ],
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 }
      ]
    };

    this.options = {
      layout: {
        hierarchical: true
      },
      edges: {
        color: "#000000"
      }
    };
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

  render() {
    const events = {
      select: function(event) {
        var { nodes, edges } = event;
      }
    };

    const options = {
      nodes: {
        shape: "dot",
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
          face: "Tahoma"
        }
      },
      edges: {
        width: 0.15,
        color: { inherit: "from" },
        smooth: {
          type: "continuous"
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
                initialSettings={{
                  perplexity: 15,
                  earlyExaggeration: 2.1,
                  learningRate: 180,
                  maxIterations: 150,
                  distanceMetric: "euclidean"
                }}
                onChange={settings => this.onChangeSettings(settings)}
              />
            </div>
            <div className="column">
              <Graph
                graph={this.graph}
                options={options}
                events={events}
                style={{
                  width: "100%",
                  height: "100vh"
                }}
                // getNetwork={this.getNetwork}
                // getEdges={this.getEdges}
                // getNodes={this.getNodes}
                vis={vis => (this.vis = vis)}
              />
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
