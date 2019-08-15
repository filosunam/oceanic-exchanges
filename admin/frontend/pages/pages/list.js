import React from 'react';
import Link from '~base/router/link';
import moment from 'moment';
import ListPageComponent from '~base/list-page-component';
import { loggedIn } from '~base/middlewares/';
import api from '~base/api';

class PublicationList extends ListPageComponent {
  constructor(props) {
    super(props);
    this.state = {
      catalogs: {
        publication: {},
      },
      publications: [],
    };
  }

  async onFirstPageEnter() {
    const catalogs = await this.loadCatalogs();
    const publications = await this.loadPublications();

    return {
      catalogs,
      publications,
    };
  }

  async loadCatalogs() {
    const res = await api.get('/admin/catalogs');
    return res.data;
  }

  async loadPublications() {
    const res = await api.get('/admin/publications', {
      limit: 0,
      start: 0,
    });
    return res.data;
  }

  getColumns() {
    return [
      {
        title: 'Título',
        property: 'titulo',
        default: 'N/A',
      },
      {
        title: 'País',
        property: 'pais',
        default: 'N/A',
      },
      {
        title: 'Estado',
        property: 'estado',
        default: 'N/A',
      },
      {
        title: 'Ciudad',
        property: 'ciudad',
        default: 'N/A',
      },
      {
        title: 'Fecha',
        property: 'fecha',
        default: 'N/A',
        formatter: (row) => {
          if (row.fecha) {
            return moment(row.fecha).format('DD/MM/YYYY');
          }
        },
      },
      {
        title: ' ',
        formatter: (row) => {
          return (
            <div className="has-text-right">
              <Link
                className="button is-small is-primary"
                to={'/pages/' + row._id}>
                Detalle
              </Link>
            </div>
          );
        },
      },
    ];
  }

  getFilters() {
    const catalogs = this.state.catalogs.publication;
    const publications = this.state.publications;

    const data = {
      search: {
        label: 'Por texto',
        widget: 'TextWidget',
        placeholder: 'Ingresa tu búsqueda',
      },
      publicacion_id: {
        label: 'Por publicación',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona una publicación',
      },
      fromYear: {
        label: 'Desde el año',
        widget: 'SelectWidget',
        options: catalogs.initialYears || [],
        placeholder: 'Selecciona año inicial',
      },
      toYear: {
        label: 'Hasta el año',
        widget: 'SelectWidget',
        options: catalogs.lastYears || [],
        placeholder: 'Selecciona año final',
      },
    };

    if (publications) {
      data.publicacion_id.options = publications
        .map((item) => ({
          label: item.titulo,
          value: item._id,
        }));
    }

    return data;
  }
}

PublicationList.config({
  name: 'pages-list',
  path: '/pages',
  title: 'Páginas',
  icon: 'file-text',
  exact: true,
  validate: loggedIn,

  apiUrl: '/admin/pages',
});

export default PublicationList;
