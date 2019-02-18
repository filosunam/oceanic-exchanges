import React from 'react';
import PageComponent from '~base/page-component';

class Home extends PageComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.baseState,
    };
  }

  render() {
    const basicStates = super.getBasicStates();
    if (basicStates) {
      return basicStates;
    }

    return (
      <section className="home hero is-info bsa">
        <div className="container">
          <div className="columns is-vcentered" />
        </div>
      </section>
    );
  }
}

Home.config({
  path: '/',
  title: 'Home',
  exact: true,
});

export default Home;
