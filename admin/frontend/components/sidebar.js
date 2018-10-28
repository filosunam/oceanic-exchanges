import React, { Component } from 'react'
import SidebarItem from '~components/sidebar-item'
import classNames from 'classnames'

import Dashboard from '../pages/dashboard'
import Users from '../pages/users/list'
import DeletedUsers from '../pages/users/list-deleted'
import UsersImport from '../pages/users/import'
import Organizations from '../pages/organizations/list'
import Roles from '../pages/roles/list'
import Groups from '../pages/groups/list'
import Buttons from '../pages/ui-components/buttons'
import Image from '~base/components/image'
import Link from '~base/router/link'

import AppConfig from '../pages/developer-tools/app-config'
import RequestLogs from '../pages/developer-tools/request-logs'
import FormBuilder from '../pages/developer-tools/form-builder'

// #Import
import Publications from '../pages/publications/list'
import Pages from '../pages/pages/list'

class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dropdown: true,
      active: '',
      collapsed: false,
      menuItems: []
    }
    this.handleActiveLink = this.handleActiveLink.bind(this)
  }

  componentWillMount () {
    const activeItem = window.location.pathname.split('/').filter(String).slice(1).join('')
    let menuItems = this.getMenuItems()
    let IndexOfActive = menuItems.findIndex(function (item) {
      const mainPath = new RegExp(item.to.replace(/\//g, ''))
      if (!item.hasOwnProperty('dropdown')) return false
      return mainPath.test(activeItem)
    })
    if (IndexOfActive >= 0) {
      menuItems[IndexOfActive].open = true
    }
    this.setState({ menuItems }, function () {
      this.handleActiveLink(activeItem)
    })
  }

  getMenuItems () {
    return [
      Dashboard.asSidebarItem(),
      Publications.asSidebarItem(),
      Pages.asSidebarItem(),
      {
        title: 'Administrar equipo',
        icon: 'users',
        to: '/manage',
        open: false,
        dropdown: [
          Users.asSidebarItem(),
          // Organizations.asSidebarItem(),
          // Roles.asSidebarItem(),
          // Groups.asSidebarItem()
        ]
      },
      // #Modules
      // {
      //   title: 'Importar',
      //   icon: 'cloud-upload',
      //   to: '/import',
      //   open: false,
      //   dropdown: [
      //     UsersImport.asSidebarItem()
      //   ]
      // }, {
      //   title: 'Desarrolladores',
      //   icon: 'github',
      //   to: '/devtools',
      //   open: false,
      //   dropdown: [
      //     RequestLogs.asSidebarItem(),
      //     AppConfig.asSidebarItem(),
      //     FormBuilder.asSidebarItem()
      //   ]
      // },
      {
        title: 'Restaurar',
        icon: 'trash-o',
        to: '/restore',
        open: false,
        dropdown: [
          DeletedUsers.asSidebarItem()// #Restore
        ]
      }
    ]
  }

  handleActiveLink (item, title) {
    if (title && this.props.handleBurguer) {
      this.props.handleBurguer()
    }
    this.setState({active: item})
  }

  handleCollapse () {
    const menuItems = [...this.state.menuItems]
    this.setState({
      collapsed: !this.state.collapsed,
      menuItems: menuItems.map(item => {
        item.open = false
        return item
      })
    })
  }

  handleToggle (index) {
    const menuItems = [...this.state.menuItems]
    menuItems[index].open = !menuItems[index].open
    this.setState({menuItems})
  }

  render () {
    let divClass = 'offcanvas column is-narrow is-narrow-mobile is-narrow-tablet is-narrow-desktop  is-paddingless'
    const menuClass = classNames('menu', {
      'has-shadow-right': !this.state.collapsed,
      'menu-collapsed': this.state.collapsed
    })

    const sidebarClass = classNames('is-flex is-flex-column', {
      'sidebar-container': !this.state.collapsed
    })

    const collapseBtn = classNames('fa', {
      'fa-expand': this.state.collapsed,
      'fa-compress': !this.state.collapsed
    })

    if (!this.props.burgerState) {
      divClass = divClass + ' is-hidden-touch'
    }

    return (<div className={sidebarClass}><div className={divClass}>
      <aside className={menuClass}>
        <div className='sidebar-brand'>
          <h1 className='title is-5 has-text-weight-normal'>
            <Link to='/'>
              Intercambios Oceánicos
            </Link>
          </h1>
        </div>
        <a onClick={() => this.handleCollapse()} className='button is-primary collapse-btn is-hidden'>
          <span className='icon is-small'>
            <i className={collapseBtn} />
          </span>
        </a>
        <div className='menu-container'>
          <ul className='menu-list'>
            {this.state.menuItems.map((item, index) => {
              if (!item) { return }
              return <SidebarItem
                title={item.title}
                index={index}
                status={item.open}
                collapsed={this.state.collapsed}
                icon={item.icon}
                to={item.to}
                dropdown={item.dropdown}
                onClick={this.handleActiveLink}
                dropdownOnClick={(i) => this.handleToggle(i)}
                activeItem={this.state.active}
                key={item.title.toLowerCase().replace(/\s/g, '')} />
            })}
          </ul>
        </div>
      </aside>
    </div></div>)
  }
}

export default Sidebar
