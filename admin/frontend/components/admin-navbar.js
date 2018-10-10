import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import { withRouter } from 'react-router'

import api from '~base/api'
import Image from '~base/components/image'
import Link from '~base/router/link'
import tree from '~core/tree'

class NavBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mobileMenu: 'close',
      profileDropdown: 'is-hidden',
      dropCaret: 'fa fa-angle-down',
      redirect: false,
      burger: false
    }

    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setWrapperRef (node) {
    this.wrapperRef = node
  }

  handleClickOutside (event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ 'profileDropdown': 'is-hidden', 'dropCaret': 'fa fa-angle-down' })
    }
  }

  async handleLogout () {
    const {history} = this.props

    try {
      await api.del('/user')
    } catch (err) {
      console.log('Error removing token, logging out anyway ...')
    }

    window.localStorage.removeItem('jwt')
    tree.set('jwt', null)
    tree.set('user', null)
    tree.set('loggedIn', false)
    tree.commit()

    history.push('/admin')
  }

  toggleBtnClass () {
    if (this.wrapperRef) {
      if (this.state.profileDropdown === 'is-hidden') {
        this.setState({ 'profileDropdown': 'is-active', 'dropCaret': 'fa fa-angle-up' })
      } else {
        this.setState({ 'profileDropdown': 'is-hidden', 'dropCaret': 'fa fa-angle-down' })
      }
    }
  }

  addActiveClassName (className, state) {
    return state ? className + ' is-active' : className
  }

  render () {
    var navButtons
    let username
    if (this.props.loggedIn) {
      if (tree.get('user')) {
        username = tree.get('user').screenName
      }

      navButtons = (<div className='dropdown-content'>
        <Link className='dropdown-item' onClick={() => this.toggleBtnClass()} to='/profile'>
          <i className='fa fa-user' />Perfil
        </Link>
        <a className='dropdown-item' onClick={() => this.handleLogout()}>
          <i className='fa fa-power-off' />Cerrar sesión
        </a>
      </div>)
    }

    return (<nav className='c-topbar navbar c-fixed' ref={this.setWrapperRef}>
      <div className='navbar-end'>
        <div className='dropdown is-active is-right is-hidden-desktop'>
          <div className='dropdown-trigger is-flex'>
            <a className='navbar-item' onClick={() => this.toggleBtnClass()}>
              <span className='icon has-text-white'>
                <i className={this.state.dropCaret} />
              </span>
            </a>
          </div>
          <div className={this.state.profileDropdown}>
            <div className='dropdown-menu is-margin-top-small' id='dropdown-menu' role='menu'>{ navButtons }</div>
          </div>
        </div>
        <div className={this.addActiveClassName('navbar-burger burger has-text-white', this.props.burgerState)} onClick={() => this.props.handleBurguer()}>
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className='c-topbar__main navbar-menu'>
        <div className='is-flex c-flex-1'>
          <div className='navbar-end'>
            <span className='navbar-item is-size-7 is-capitalized is-paddingless-right'>
              Hola, { username }
            </span>
            <div className='dropdown is-active is-right'>
              <div className='dropdown-trigger is-flex'>
                <a className='navbar-item' onClick={() => this.toggleBtnClass()}>
                  <span className='icon'>
                    <i className={this.state.dropCaret} />
                  </span>
                </a>
              </div>
              <div className={this.state.profileDropdown}>
                <div className='dropdown-menu' id='dropdown-menu' role='menu'>{ navButtons }</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>)
  }
}

export default withRouter(branch({
  loggedIn: 'loggedIn'
}, NavBar))
