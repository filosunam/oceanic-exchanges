import React, { Component } from 'react'
import api from '~base/api'
import tree from '~core/tree'

import MarbleForm from '~base/components/marble-form'

const schema = {
  name: {
    widget: 'TextWidget',
    label: 'Nombre',
    required: true
  },
  email: {
    widget: 'EmailWidget',
    label: 'Correo electrónico',
    required: true
  }
}

class UpdateProfileForm extends Component {
  constructor (props) {
    super(props)

    let email
    let name

    if (tree.get('user')) {
      name = tree.get('user').name
      email = tree.get('user').email
    }

    this.state = {
      formData: {
        email,
        name
      }
    }
  }

  changeHandler (formData) {
    this.setState({formData})
  }

  async submitHandler (formData) {
    const data = await api.post('/user/me/update', formData)

    tree.set('user', data.user)
    tree.commit()
  }

  render () {
    return (
      <div className='is-fullwidth'>
        <MarbleForm
          schema={schema}
          formData={this.state.formData}
          onChange={(data) => this.changeHandler(data)}
          onSubmit={(data) => this.submitHandler(data)}
          defaultSuccessMessage='El perfil se ha actualizado correctamente'
          buttonLabel='Actualizar'
        />
      </div>
    )
  }
}

export default UpdateProfileForm
