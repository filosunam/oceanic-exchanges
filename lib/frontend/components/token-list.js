import React, { Component } from 'react'
import api from '~base/api'
import BaseModal from '~base/components/base-modal'
import MarbleForm from '~base/components/marble-form'
import ConfirmButton from '~base/components/confirm-button'

const schema = {
  name: {
    widget: 'TextWidget',
    label: 'Nombre',
    required: true
  }
}

class TokensList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tokens: [],
      modalClassName: '',
      notificationClass: 'is-hidden',
      formData: {}
    }
  }

  componentWillMount () {
    this.getTokens()
  }

  async getTokens () {
    const data = await api.get('/user/tokens')

    this.setState({
      tokens: data.tokens
    })
  }

  async removeToken (item) {
    await api.del('/user/tokens/' + item.uuid)
    let index = this.state.tokens.indexOf(item)
    let aux = this.state.tokens
    aux.splice(index, 1)
    this.setState({
      tokens: aux
    })
  }

  onChange (formData) {
    this.setState({formData})
  }

  async createToken (item) {
    const data = await api.post('/user/tokens', item)

    return data
  }

  createSuccessHandler (data) {
    this.setState({
      tokens: this.state.tokens.concat(data.token),
      notificationClass: '',
      formData: {}
    })

    this.hideModal()
  }

  showModal () {
    this.setState({
      modalClassName: ' is-active'
    })
  }

  hideModal () {
    this.setState({
      modalClassName: ''
    })
  }

  hideNotification () {
    this.setState({
      notificationClass: 'is-hidden'
    })
  }

  render () {
    return (
      <div className='panel is-bg-white'>
        <p className='panel-heading'>
          API Tokens
          <a
            style={{ maxHeight: 25 }}
            onClick={() => this.showModal()}
            className='button is-small is-primary is-pulled-right'
          >Crear</a>
        </p>

        <div className='panel-block'>
          <div className='panel-body is-fullwidth'>
            <div className={'notification is-primary ' + this.state.notificationClass}>
              <button className='delete' onClick={() => this.hideNotification()} />
              Guarda tu llave secreta en un lugar seguro
            </div>

            {this.state.tokens.map((item, index) => (
              <div className='token is-relative' key={index} style={{borderBottom: '1px solid lightGrey', marginBottom: 10, paddingBottom: 5}}>
                <p style={{fontSize: '1.4em', marginBottom: 10}}><strong>{item.name}</strong></p>
                {item.secret ? <p className='secret' style={{marginBottom: 5}}><strong>Secret:</strong> {item.secret} </p> : null}
                <p style={{marginBottom: 5}}><strong>Key:</strong> {item.key} </p>
                <p style={{marginBottom: 5}}><strong>Última vez usado:</strong> {item.lastUse ? item.lastUse : 'N/A'}</p>
                <div className='is-bottom'>
                  <ConfirmButton
                    title='Revocar token'
                    className='button is-danger'
                    classNameButton='button is-danger'
                    onConfirm={() => this.removeToken(item)}
                  >
                    Revocar
                  </ConfirmButton>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BaseModal
          title='Crear token'
          className={this.state.modalClassName}
          hideModal={() => this.hideModal()}
        >
          <MarbleForm
            schema={schema}
            formData={this.state.formData}
            onChange={(data) => this.onChange(data)}
            onSuccess={(data) => this.createSuccessHandler(data)}
            onSubmit={(data) => this.createToken(data)}
            buttonLabel='Crear token'
            defaultSuccessMessage='El token ha sido creado'
          />
        </BaseModal>
      </div>
    )
  }
}

export default TokensList
