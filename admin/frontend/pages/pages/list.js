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
    };
  }

  async onFirstPageEnter() {
    const catalogs = await this.loadCatalogs();

    return { catalogs };
  }

  async loadCatalogs() {
    const res = await api.get('/admin/catalogs');
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
    const data = {
      search: {
        label: 'Por texto',
        widget: 'TextWidget',
        placeholder: 'Ingresa tu búsqueda',
      },
      tipoPublicacion: {
        label: 'Por tipo de publicación',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona un tipo de publicación',
      },
      tipoAcceso: {
        label: 'Por tipo de accesso',
        widget: 'SelectWidget',
        options: [
          {
            label: 'Abierto',
            value: 'true',
          },
          {
            label: 'Restringido',
            value: 'false',
          },
        ],
        placeholder: 'Selecciona un tipo de acceso',
      },
      pais: {
        label: 'Por país',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona un país',
      },
      ciudad: {
        label: 'Por ciudad',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona una ciudad',
      },
      estado: {
        label: 'Por estado',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona una estado',
      },
      idioma: {
        label: 'Por idioma',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona un idioma',
      },
      frecuencia: {
        label: 'Por frecuencia',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona una frecuencia',
      },
    };

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
