import React, {Component} from 'react'

import env from '~base/env-variables'
import api from '~base/api'
import ListPageComponent from '~base/list-page-component'
import {loggedIn} from '~base/middlewares/'

class Header extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loaded: false,
      currentCustomersHappiness: ''
    }
  }

  async restoreMultiple () {
    const { selectedRows } = this.props

    for (const row of selectedRows) {
      var url = '/admin/users/deleted/' + row.uuid
      await api.post(url)
    }

    this.props.reload()
  }

  render () {
    const { selectedRows } = this.props

    return <header className='card-header'>
      <p className='card-header-title'>
        Restaurar usuarios
      </p>
      <div className='card-header-select'>
        <button
          className='button is-primary'
          onClick={() => this.restoreMultiple()}
          disabled={selectedRows.length === 0}
        >
          Restaurar múltiples usuarios
        </button>
      </div>
    </header>
  }
}

class UserDeletedList extends ListPageComponent {
  async onFirstPageEnter () {
    const organizations = await this.loadOrgs()

    return {organizations}
  }

  async loadOrgs () {
    var url = '/admin/organizations/'
    const body = await api.get(url, {
      start: 0,
      limit: 0
    })

    return body.data
  }

  async restoreOnClick (uuid) {
    var url = '/admin/users/deleted/' + uuid
    await api.post(url)
    this.props.history.push(env.PREFIX + '/manage/users/' + uuid)
  }

  getFilters () {
    const data = {
      name: {
        label: 'Por nombre',
        widget: 'TextWidget'
      },
      email: {
        label: 'Por email',
        widget: 'TextWidget'
      },
      organization: {
        label: 'Por organización',
        widget: 'SelectWidget',
        options: []
      }
    }

    if (this.state.organizations) {
      this.state.organizations.map(({ uuid, name }) => ({ value: uuid, label: name }))
    }

    return data
  }

  getColumns () {
    return [
      {
        'title': 'Nombre',
        'property': 'name',
        'default': 'N/A',
        'sortable': true
      },
      {
        'title': 'Email',
        'property': 'email',
        'default': 'N/A',
        'sortable': true
      },
      {
        'title': 'Acciones',
        formatter: (row) => {
          return (
            <button className='button' onClick={e => { this.restoreOnClick(row.uuid) }}>
              Restaurar
            </button>
          )
        }
      }
    ]
  }
}

UserDeletedList.config({
  // Basic values
  name: 'user-deleted-list',
  path: '/manage/users/deleted',
  title: 'Restaurar usuarios',
  icon: 'user',
  exact: true,
  validate: loggedIn,

  // Selectable and custom header
  selectable: true,
  headerLayout: 'custom',
  headerComponent: Header,

  // default filters
  defaultFilters: {
    isDeleted: true
  },

  // Api url to fetch from
  apiUrl: '/admin/users'
})

export default UserDeletedList
