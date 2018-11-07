import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'
import ListPageComponent from '~base/list-page-component'
import {loggedIn} from '~base/middlewares/'
import api from '~base/api'

class PublicationList extends ListPageComponent {
  constructor (props) {
    super(props)
    this.state = {
      catalogs: {
        publication: {}
      }
    }
  }

  async onFirstPageEnter () {
    const catalogs = await this.loadCatalogs()

    return { catalogs }
  }

  async loadCatalogs () {
    const res = await api.get('/admin/catalogs')
    return res.data
  }

  getColumns () {
    return [
      {
        'title': 'Título',
        'property': 'titulo',
        'default': 'N/A'
      },
      {
        'title': 'País',
        'property': 'pais',
        'default': 'N/A'
      },
      {
        'title': 'Estado',
        'property': 'estado',
        'default': 'N/A'
      },
      {
        'title': 'Ciudad',
        'property': 'ciudad',
        'default': 'N/A'
      },
      {
        'title': 'Desde',
        'property': 'fechaInicio',
        'default': 'N/A',
        formatter: (row) => {
          if (row.fechaInicio) {
            return moment(row.fechaInicio).format('DD/MM/YYYY')
          }
        }
      },
      {
        'title': 'Hasta',
        'property': 'fechaFinalizo',
        'default': 'N/A',
        formatter: (row) => {
          if (row.fechaFinalizo) {
            return moment(row.fechaFinalizo).format('DD/MM/YYYY')
          }
        }
      },
      {
        'title': ' ',
        formatter: (row) => {
          return (<div className='has-text-right'>
            <Link className='button is-small is-primary' to={'/publications/' + row._id}>
              Detalle
            </Link>
          </div>)
        }
      }
    ]
  }

  getFilters () {
    const catalogs = this.state.catalogs.publication

    const data = {
      search: {
        label: 'Por título',
        widget: 'TextWidget',
        placeholder: 'Ingresa tu búsqueda'
      },
      tipoPublicacion: {
        label: 'Por tipo de publicación',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona un tipo de publicación'
      },
      tipoAcceso: {
        label: 'Por tipo de accesso',
        widget: 'SelectWidget',
        options: [
          {
            label: 'Abierto',
            value: 'true'
          },
          {
            label: 'Restringido',
            value: 'false'
          }
        ],
        placeholder: 'Selecciona un tipo de acceso'
      },
      pais: {
        label: 'Por país',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona un país'
      },
      ciudad: {
        label: 'Por ciudad',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona una ciudad'
      },
      estado: {
        label: 'Por estado',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona una estado'
      },
      idioma: {
        label: 'Por idioma',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona un idioma'
      },
      frecuencia: {
        label: 'Por frecuencia',
        widget: 'SelectWidget',
        options: [],
        placeholder: 'Selecciona una frecuencia'
      }
    }

    if (catalogs.publicationType) {
      data.tipoPublicacion.options = catalogs.publicationType.map(item => ({ label: item, value: item }))
    }

    if (catalogs.country) {
      data.pais.options = catalogs.country.map(item => ({ label: item, value: item }))
    }

    if (catalogs.city) {
      data.ciudad.options = catalogs.city.map(item => ({ label: item, value: item }))
    }

    if (catalogs.state) {
      data.estado.options = catalogs.state.map(item => ({ label: item, value: item }))
    }

    if (catalogs.language) {
      data.idioma.options = catalogs.language.map(item => ({ label: item, value: item }))
    }

    if (catalogs.frequency) {
      data.frecuencia.options = catalogs.frequency.map(item => ({ label: item, value: item }))
    }

    return data
  }
}

PublicationList.config({
  name: 'publication-list',
  path: '/publications',
  title: 'Publicaciones',
  icon: 'book',
  exact: true,
  validate: loggedIn,

  apiUrl: '/admin/publications'
})

export default PublicationList
