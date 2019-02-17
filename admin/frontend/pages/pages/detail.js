import React from 'react';
import Link from '~base/router/link';
import api from '~base/api';
import { get } from 'lodash';
import PageComponent from '~base/page-component';
import { Pagination } from '~base/components/base-pagination';
import { loggedIn } from '~base/middlewares/';
import moment from 'moment';
import Magnifier from 'react-magnifier';

class PageDetail extends PageComponent {
  constructor(props) {
    super(props);

    this.currentImage = React.createRef();

    this.state = {
      ...this.baseState,
      page: {},
      pages: {
        data: [],
        total: 0,
      },
      base64Image: '',
      OCRBoundaries: '',
    };
  }

  async onPageEnter() {
    this.setState({
      loading: true,
      loaded: false,
    });

    const page = await this.loadCurrentPage();
    const pages = await this.getAllPagesFromPage(page);
    const base64Image = await this.loadPageImage();

    page.number = moment(page.fecha).format('YYYY-MM-DD');

    return {
      loading: false,
      loaded: true,
      page,
      pages,
      base64Image,
    };
  }

  async getAllPagesFromPage(page) {
    const url = '/admin/pages';
    const body = await api.get(url, {
      publicacion_id: page.publicacion_id,
      issue: page.fecha,
      limit: 0,
      start: 0,
    });
    return body;
  }

  async loadCurrentPage() {
    let url = '/admin/pages/' + this.props.match.params.uuid;
    const body = await api.get(url);
    return body.data;
  }

  async loadPage(page) {
    this.setState({
      loading: true,
      loaded: false,
    });
    const { pages } = this.state;
    const currentPage = pages.data.find((p) => p.pagina === page);

    const bodyImage = await api.get(`/admin/pages/${currentPage._id}/image`);

    this.setState({
      loading: false,
      loaded: true,
      page: currentPage,
      base64Image: bodyImage.data,
    });
  }

  async loadPageImage() {
    const url = '/admin/pages/' + this.props.match.params.uuid + '/image';
    const body = await api.get(url);
    return body.data;
  }

  getOCRBoundaries() {
    const { ocr } = this.state.page;
    const image = this.currentImage.current;

    if (image && ocr) {
      const {
        offsetHeight: height,
        offsetWidth: width,
        naturalWidth,
        naturalHeight,
      } = image;

      const patternForWordBounds = /(.+)\((\d+),(\d+),(\d+),(\d+)\)/i;
      const words = ocr.split(/\s/);

      const OCRBoundaries = words.map((word) => {
        const result = word.match(patternForWordBounds);

        if (result) {
          let top = (result[5] * height) / naturalHeight;
          let right = (result[4] * width) / naturalWidth;
          let bottom = (result[3] * height) / naturalHeight;
          let left = (result[2] * width) / naturalWidth;

          if (bottom - top <= 0) {
            top = (result[3] * height) / naturalHeight;
            bottom = (result[5] * height) / naturalHeight;
          }

          if (right - left <= 0) {
            right = (result[2] * width) / naturalWidth;
            left = (result[4] * width) / naturalWidth;
          }

          return (
            <div
              key={word}
              className="tooltip is-tooltip-top"
              data-tooltip={result[1]}
              style={{
                position: 'absolute',
                border: '1px dotted blue',
                background: 'rgba(0, 0, 255, 0.1)',
                width: right - left,
                height: bottom - top,
                top,
                left,
              }}
            />
          );
        }
      });

      this.setState({
        OCRBoundaries,
      });
    }
  }

  render() {
    const basicStates = super.getBasicStates();
    if (basicStates) {
      return basicStates;
    }

    const { page, pages, base64Image, OCRBoundaries } = this.state;
    const number = moment(page.fecha).format('YYYY-MM-DD');

    return (
      <div className="section">
        <div className="columns">
          <div className="column">{this.getBreadcrumbs()}</div>
        </div>
        <div className="columns">
          <div className="column">
            <div className="card">
              <header className="card-header is-block">
                <div className="card-header-title is-block has-text-centered">
                  Número {number} / Página {page.pagina}
                  <div className="buttons is-pulled-right">
                    <a
                      href={`/admin/acervo/${page.rutaXML}`}
                      className="button is-small is-success">
                      XML
                    </a>
                    <a
                      href={`/admin/acervo/${page.rutaImagen}`}
                      className="button is-small is-info">
                      TIFF
                    </a>
                  </div>
                </div>
              </header>
              <header className="card-header is-block">
                <div className="card-header-title is-block has-text-centered">
                  <Pagination
                    loadPage={(page) => this.loadPage(page)}
                    pageLength={1}
                    page={page.pagina}
                    totalItems={pages.total}
                  />
                </div>
              </header>
              <div className="card-content is-relative is-paddingless">
                {/*<Magnifier
                  ref={this.currentImage}
                  src={base64Image}
                  zoomFactor={1}
                  mgWidth={200}
                  mgHeight={200}
                />*/}
                <img
                  ref={this.currentImage}
                  src={base64Image}
                  onLoad={() => this.getOCRBoundaries()}
                />

                <div style={{ position: 'absolute', top: 0, left: 0 }}>
                  {OCRBoundaries}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PageDetail.config({
  name: 'page-details',
  path: '/pages/:uuid',
  title: '<%= page.titulo %> | Detalles de publicación',
  breadcrumbs: [
    { label: 'Inicio', path: '/' },
    { label: 'Publicaciones', path: '/publications' },
    {
      label: '<%= page.titulo %>',
      path: '/publications/<%= page.publicacion_id %>',
    },
    { label: '<%= page.number %>' },
  ],
  exact: true,
  validate: loggedIn,
});

export default PageDetail;
