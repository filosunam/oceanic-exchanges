import React, { Component } from 'react'

import api from '~base/api'
import MarbleForm from '~base/components/marble-form'

class PublicationForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: this.props.initialState,
      catalogs: {
        publication: {}
      }
    }
  }

  async componentWillMount () {
    const catalogs = await this.loadCatalogs()
    this.setState({ catalogs })
  }

  async loadCatalogs () {
    const res = await api.get('/admin/catalogs')
    return res.data
  }

  changeHandler (formData) {
    this.setState({ formData })
  }

  async submitHandler (formData) {
    const res = await api.post(this.props.url, formData)

    if (this.props.load) {
      await this.props.load()
    }

    return res.data
  }

  successHandler (data) {
    if (this.props.finishUp) {
      this.props.finishUp(data)
    }
  }

  render () {
    const catalogs = this.state.catalogs.publication

    const schema = {
      titulo: {
        widget: 'TextWidget',
        label: 'Título',
        required: true
      },
      tipoPublicacion: {
        label: 'Tipo de publicación',
        widget: 'SelectWidget',
        options: [],
        allowEmpty: true,
        className: 'is-4'
      },
      frecuencia: {
        label: 'Frecuencia',
        widget: 'SelectWidget',
        options: [],
        allowEmpty: true,
        className: 'is-4'
      },
      idioma: {
        label: 'Idioma',
        widget: 'SelectWidget',
        options: [],
        allowEmpty: true,
        className: 'is-4'
      },
      pais: {
        label: 'País',
        widget: 'SelectWidget',
        options: [],
        allowEmpty: true,
        className: 'is-4'
      },
      estado: {
        label: 'Estado',
        widget: 'SelectWidget',
        options: [],
        allowEmpty: true,
        className: 'is-4'
      },
      ciudad: {
        label: 'Ciudad',
        widget: 'SelectWidget',
        options: [],
        allowEmpty: true,
        className: 'is-4'
      },
      fechaInicio: {
        label: 'Fecha de inicio',
        widget: 'DateWidget',
        className: 'is-6'
      },
      fechaFinalizo: {
        label: 'Fecha final',
        widget: 'DateWidget',
        className: 'is-6'
      }
    }

    if (catalogs.publicationType) {
      schema.tipoPublicacion.options = catalogs.publicationType.map(item => ({ label: item, value: item }))
    }

    if (catalogs.country) {
      schema.pais.options = catalogs.country.map(item => ({ label: item, value: item }))
    }

    if (catalogs.city) {
      schema.ciudad.options = catalogs.city.map(item => ({ label: item, value: item }))
    }

    if (catalogs.state) {
      schema.estado.options = catalogs.state.map(item => ({ label: item, value: item }))
    }

    if (catalogs.language) {
      schema.idioma.options = catalogs.language.map(item => ({ label: item, value: item }))
    }

    if (catalogs.frequency) {
      schema.frecuencia.options = catalogs.frequency.map(item => ({ label: item, value: item }))
    }

    return (
      <div>
        <MarbleForm schema={schema}
          formData={this.state.formData}
          onChange={(data) => this.changeHandler(data)}
          onSuccess={(data) => this.successHandler(data)}
          onSubmit={(data) => this.submitHandler(data)}
          buttonLabel={this.props.label || 'Save'}
        >
          <div className='is-margin-medium' />
        </MarbleForm>
      </div>
    )
  }
}

export default PublicationForm
