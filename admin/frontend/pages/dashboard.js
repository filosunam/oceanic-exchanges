import React from 'react'
import moment from 'moment'

import PageComponent from '~base/page-component'
import api from '~base/api'
import { Redirect } from 'react-router-dom'
import Link from '~base/router/link'

import {loggedIn} from '~base/middlewares/'

moment.locale('es')

class Dashboard extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      orgsCount: 0,
      usersCount: 0,
      rolesCount: 0,
      groupsCount: 0
    }
  }

  async onPageEnter () {
    const data = await this.load()

    return data
  }

  async load () {
    var url = '/admin/dashboard/'
    const body = await api.get(url)

    return {
      orgsCount: body.orgsCount,
      usersCount: body.usersCount,
      rolesCount: body.rolesCount,
      groupsCount: body.groupsCount,
      todayIs: moment().format('DD - MMMM YYYY')
    }
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    const {orgsCount, usersCount, rolesCount, groupsCount, todayIs} = this.state

    if (this.state.redirect) {
      return <Redirect to='/log-in' />
    }

    return (<div className='section'>
      <div className='Dashboard'>
        <div className='columns'>
          <div className='column'>
            <h1 className='Dashboard-title'>Intercambios Oceánicos</h1>
            <h2 className='Dashboard-subtitle'>Este es el resumen del proyecto</h2>
          </div>
          <div className='column Dashboard-welcome'>
            <p>Bienvenido</p>
            <p>{todayIs}</p>
          </div>
        </div>
        <div className='tile is-ancestor'>
          <div className='tile is-vertical is-3'>
            <div className='tile'>
              <div className='tile is-parent'>
                <article className='tile is-child has-text-centered'>
                  <p className='title'>{orgsCount}</p>
                  <p className='subtitle'>Organizaciones</p>
                </article>
              </div>
            </div>
          </div>
          <div className='tile is-vertical is-3'>
            <div className='tile'>
              <div className='tile is-parent'>
                <article className='tile is-child has-text-centered'>
                  <p className='title'>{usersCount}</p>
                  <p className='subtitle'>Usuarios</p>
                </article>
              </div>
            </div>
          </div>
          <div className='tile is-vertical is-3'>
            <div className='tile'>
              <div className='tile is-parent'>
                <article className='tile is-child has-text-centered'>
                  <p className='title'>{rolesCount}</p>
                  <p className='subtitle'>Roles</p>
                </article>
              </div>
            </div>
          </div>
          <div className='tile is-vertical is-3'>
            <div className='tile'>
              <div className='tile is-parent'>
                <article className='tile is-child has-text-centered'>
                  <p className='title'>{groupsCount}</p>
                  <p className='subtitle'>Grupos</p>
                </article>
              </div>
            </div>
          </div>
        </div>
        <div className='columns'>
          <div className='column is-two-fifths'>
            <div className='quickActions'>
              <table className='table is-fullwidth'>
                <thead>
                  <tr>
                    <th>Acciones rápidas</th>
                    <th>
                      <span>Ver</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className='icon-list'>
                        <a className='button icon-button is-link is-rounded is-small'><i className='fa fa-sitemap' /></a>
                        <span className='icon-list-right'>Organizaciones</span>
                      </div>
                    </td>
                    <td className='quickActions-list'>
                      <div>
                        <div className='icon-list-items'>
                          <Link to='/manage/organizations'><i className='fa fa-eye' /></Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className='icon-list'>
                        <a className='button icon-button is-link is-rounded is-small'><i className='fa fa-user' /></a>
                        <span className='icon-list-right'>Usuarios</span>
                      </div>
                    </td>
                    <td className='quickActions-list'>
                      <div>
                        <div className='icon-list-items'>
                          <Link to='/manage/users'><i className='fa fa-eye' /></Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className='icon-list'>
                        <a className='button icon-button is-link is-rounded is-small'><i className='fa fa-puzzle-piece' /></a>
                        <span className='icon-list-right'>Roles</span>
                      </div>
                    </td>
                    <td className='quickActions-list'>
                      <div>
                        <div className='icon-list-items'>
                          <Link to='/manage/roles'><i className='fa fa-eye' /></Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className='icon-list'>
                        <a className='button icon-button is-link is-rounded is-small'><i className='fa fa-users' /></a>
                        <span className='icon-list-right'>Grupos</span>
                      </div>
                    </td>
                    <td className='quickActions-list'>
                      <div className='icon-list'>
                        <div className='icon-list-items'>
                          <Link to='/manage/groups'><i className='fa fa-eye' /></Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

Dashboard.config({
  path: '/',
  exact: true,
  title: 'Inicio',
  icon: 'dashboard',
  validate: loggedIn
})

export default Dashboard
