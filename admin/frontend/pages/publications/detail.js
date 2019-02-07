import React from 'react'
import Link from '~base/router/link'
import api from '~base/api'

import PageComponent from '~base/page-component'
import {loggedIn} from '~base/middlewares/'
import { BranchedPaginatedTable } from '~base/components/base-paginated-table'
import PublicationForm from './form'
import ConfirmButton from '~base/components/confirm-button'
import moment from 'moment'

class PublicationDetail extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      publication: {}
    }
  }

  async onPageEnter () {
    const publications = await this.loadCurrentPublication()

    return {
      publications
    }
  }

  async loadCurrentPublication () {
    var url = '/admin/publications/' + this.props.match.params.uuid
    const body = await api.get(url)

    this.setState({
      loading: false,
      loaded: true,
      publication: body.data
    })
  }

  async deleteOnClick () {
    var url = '/admin/publications/' + this.props.match.params.uuid
    const res = await api.del(url)

    return res.data
  }

  deleteSuccessHandler () {
    this.props.history.push('/admin/manage/publications')
  }

  getColumns () {
    return [
      {
        title: 'Fecha',
        default: 'N/A',
        formatter: (row) => {
          let publishedDate = 'N/A'

          if (row.paginaFecha) {
            publishedDate = moment(row.paginaFecha).format('YYYY-MM-DD')
          }

          return <Link to={`/pages/${row.primerPaginaDelDia_id}`}>
            {publishedDate}
          </Link>
        }
      },
      {
        title: '# Páginas',
        property: 'pageCount',
        default: 'N/A'
      }
    ]
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    const { publication } = this.state

    return (<div className='section'>
      <div className='columns'>
        <div className='column'>
          {this.getBreadcrumbs()}
        </div>
      </div>
      <div className='columns'>
        <div className='column is-12-touch is-12-desktop is-6-widescreen'>
          <div className='card'>
            <header className='card-header'>
              <p className='card-header-title'>
                Publicación
              </p>
            </header>
            <div className='card-content'>
              <div className='columns'>
                <div className='column'>
                  <PublicationForm
                    label='Guardar'
                    baseUrl='/admin/organizations'
                    url={'/admin/organizations/' + this.props.match.params.uuid}
                    initialState={publication}
                    load={() => this.reload()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='column is-12-touch is-12-desktop is-6-widescreen'>
          <div className='card'>
            <header className='card-header'>
              <p className='card-header-title'>
                Números
              </p>
            </header>
            <div className='card-content'>
              <div className='columns'>
                <div className='column'>
                  <BranchedPaginatedTable
                    branchName='pages'
                    baseUrl={`/admin/publications/${publication._id}/numbers`}
                    columns={this.getColumns()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

PublicationDetail.config({
  name: 'publication-details',
  path: '/publications/:uuid',
  title: '<%= publication.name %> | Detalles de publicación',
  breadcrumbs: [
    {label: 'Inicio', path: '/'},
    {label: 'Publicaciones', path: '/publications'},
    {label: '<%= publication.title %>'}
  ],
  exact: true,
  validate: loggedIn
})

export default PublicationDetail
