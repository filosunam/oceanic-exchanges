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
          <div className="columns is-vcentered is-hidden">
            <Link to="/embeddings">Embeddings</Link>
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
