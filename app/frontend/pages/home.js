import React from "react";
import PageComponent from "~base/page-component";
import Link from "~base/router/link";

class Home extends PageComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.baseState
    };
  }

  render() {
    const basicStates = super.getBasicStates();
    if (basicStates) {
      return basicStates;
    }

    return (
      <section className="section">
        <div className="container">
          <div className="columns is-vcentered">
            <div className="column">
              <div className="box">
                <h1 className="title is-5 is-spaced">Embeddings</h1>
                <h2 className="subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. </h2>
                <Link className="button is-primary" to="/embeddings">Ver</Link>
              </div>
            </div>

            <div className="column">
              <div className="box">
                <h1 className="title is-5 is-spaced">Networks</h1>
                <h2 className="subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. </h2>
                <Link className="button is-primary" to="/networks">Ver</Link>
              </div>
            </div>

            <div className="column">
              <div className="box">
                <h1 className="title is-5 is-spaced">Streams</h1>
                <h2 className="subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ornare magna eros, eu pellentesque tortor vestibulum ut. </h2>
                <Link className="button is-primary" to="/streams">Ver</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Home.config({
  path: "/",
  title: "Home",
  exact: true
});

export default Home;
