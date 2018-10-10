import React from 'react'

import env from '~base/env-variables'
import Link from '~base/router/link'
import api from '~base/api'
import ListPageComponent from '~base/list-page-component'
import {loggedIn} from '~base/middlewares/'
import CreateUser from './create'

class UserList extends ListPageComponent {
  async onFirstPageEnter () {
    const organizations = await this.loadOrgs()

    return { organizations }
  }

  async loadOrgs () {
    var url = '/admin/organizations/'
    const body = await api.get(url, {
      start: 0,
      limit: 0
    })

    return body.data
  }

  async deleteObject (row) {
    await api.del('/admin/users/' + row.uuid)
    this.reload()
  }

  finishUp (data) {
    this.props.history.push(env.PREFIX + '/manage/users/' + data.uuid)
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

  exportFormatter (row) {
    return {name: row.name, email: row.email}
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
            <div className='field is-grouped'>
              <div className='control'>
                <Link className='button' to={'/manage/users/' + row.uuid}>
                  Detalle
                </Link>
              </div>
            </div>
          )
        }
      }
    ]
  }
}

UserList.config({
  name: 'user-list',
  path: '/manage/users',
  title: 'Usuarios',
  icon: 'user',
  exact: true,
  validate: loggedIn,

  headerLayout: 'create',
  createComponent: CreateUser,
  createComponentLabel: 'Nuevo usuario',

  apiUrl: '/admin/users'
})

export default UserList
