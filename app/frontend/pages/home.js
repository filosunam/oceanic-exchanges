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
                <h1 className="title is-5 is-spaced">
                  Encajes/incrustaciones (embeddings)
                </h1>
                <h2 className="subtitle">
                  En esta visualización se representan las relaciones entre
                  palabras dada su cercanía o lejanía de unas a las otras. Las
                  distancias entre las palabras se calculan poniendo atención al
                  uso del lenguaje en los textos de la colección por año, de
                  esta forma se puede contrastar cercanías o lejanías en el
                  tiempo. En la visualización se muestran palabras aleatorias de
                  la colección. Sugerencia escoger el 1822 y contrarrestar con
                  1910.
                </h2>
                <Link className="button is-primary" to="/embeddings">
                  Ver
                </Link>
              </div>
            </div>

            <div className="column">
              <div className="box">
                <h1 className="title is-5 is-spaced">Redes de conceptos</h1>
                <h2 className="subtitle">
                  Esta visualización muestra redes de conceptos basados en la
                  cercanía entre palabras. Una palabra se asociará a las
                  palabras más cercanas a ella y denotará un "concepto"; la
                  visualización permite definir las palabras de interés y ver
                  como entre ellas comparten, o nó, otras palabras; es decir que
                  tan mezclados son los conceptos. Sugerencia ver los conceptos
                  de "juarez", "maximiliano" a través de los años.
                </h2>
                <Link className="button is-primary" to="/networks">
                  Ver
                </Link>
              </div>
            </div>

            <div className="column">
              <div className="box">
                <h1 className="title is-5 is-spaced">Flujos conceptuales</h1>
                <h2 className="subtitle">
                  En esta visualización se ve el peso de los conceptos a través
                  del tiempo. El eje "x" muestra el tiempo, mientras que el "y"
                  es el peso de la cercanía que tuvo el concepto principal con
                  cierta palabra a través del tiempo, para lograr este efecto la
                  contribución de una palabra se mide en una ventana de tiempo
                  más larga. Sugerencia ver los flujos para los conceptos de
                  "juarez", "maximiliano".
                </h2>
                <Link className="button is-primary" to="/streams">
                  Ver
                </Link>
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
