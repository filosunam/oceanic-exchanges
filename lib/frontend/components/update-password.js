import React, { Component } from 'react'

import api from '~base/api'
import MarbleForm from '~base/components/marble-form'

const schema = {
  password: {
    widget: 'PasswordWidget',
    label: 'Contraseña actual',
    required: true
  },
  newPassword: {
    widget: 'PasswordWidget',
    label: 'Nueva contraseña',
    required: true
  },
  confirmPassword: {
    widget: 'PasswordWidget',
    label: 'Confirmar nueva contraseña',
    required: true
  }
}

class UpdatePasswordForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formData: {},
      errors: {}
    }
  }

  changeHandler (formData) {
    let errors = {}

    if (formData.confirmPassword && formData.confirmPassword !== formData.newPassword) {
      errors = {
        confirmPassword: 'Las nuevas contraseñas no coinciden'
      }
    }

    this.setState({formData, errors})
  }

  async submitHandler (formData) {
    await api.post('/user/me/update-password', formData)

    this.setState({
      formData: {},
      errors: {}
    })
  }

  render () {
    return (
      <div className='is-fullwidth'>
        <MarbleForm
          schema={schema}
          formData={this.state.formData}
          onChange={(data) => this.changeHandler(data)}
          onSubmit={(data) => this.submitHandler(data)}
          defaultSuccessMessage='Contraseña actualizada'
          errors={this.state.errors}
          buttonLabel='Actualizar contraseña'
        />
      </div>
    )
  }
}

export default UpdatePasswordForm
