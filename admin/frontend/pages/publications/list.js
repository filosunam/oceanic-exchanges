import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'
import ListPageComponent from '~base/list-page-component'
import {loggedIn} from '~base/middlewares/'

class PublicationList extends ListPageComponent {
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
          return <Link className='button' to={'/publications/' + row._id}>
            Detalle
          </Link>
        }
      }
    ]
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
