import React from 'react'
import Link from '~base/router/link'
import api from '~base/api'

import PageComponent from '~base/page-component'
import { loggedIn } from '~base/middlewares/'
import moment from 'moment'
import Magnifier from 'react-magnifier'

class PageDetail extends PageComponent {
  constructor (props) {
    super(props)

    this.currentImage = React.createRef()

    this.state = {
      ...this.baseState,
      page: {},
      base64Image: '',
      OCRBoundaries: ''
    }
  }

  async onPageEnter () {
    const page = await this.loadCurrentPage()
    const base64Image = await this.loadPageImage()

    return {
      loading: false,
      loaded: true,
      page,
      base64Image
    }
  }

  async loadCurrentPage () {
    let url = '/admin/pages/' + this.props.match.params.uuid
    const body = await api.get(url)
    return body.data
  }

  async loadPageImage () {
    const url = '/admin/pages/' + this.props.match.params.uuid + '/image'
    const body = await api.get(url)
    return body.data
  }

  getOCRBoundaries () {
    const { ocr } = this.state.page
    const image = this.currentImage.current

    if (image && ocr) {
      const {
        offsetHeight: height,
        offsetWidth: width,
        naturalWidth,
        naturalHeight
      } = image

      const patternForWordBounds = /(.+)\((\d+),(\d+),(\d+),(\d+)\)/i
      const words = ocr.split(/\s/)

      const OCRBoundaries = words.map(word => {
        const result = word.match(patternForWordBounds)

        if (result) {
          let top = (result[5] * height) / naturalHeight
          let right = (result[4] * width) / naturalWidth
          let bottom = (result[3] * height) / naturalHeight
          let left = (result[2] * width) / naturalWidth

          if (bottom - top <= 0) {
            top = (result[3] * height) / naturalHeight
            bottom = (result[5] * height) / naturalHeight
          }

          return <div
            key={word}
            className='tooltip is-tooltip-top'
            data-tooltip={result[1]}
            style={{
              position: 'absolute',
              border: '1px solid blue',
              width: right - left,
              height: bottom - top,
              top,
              left
            }}
          />
        }
      })

      this.setState({
        OCRBoundaries
      })
    }
  }

  render () {
    const basicStates = super.getBasicStates()
    if (basicStates) { return basicStates }

    const { page, base64Image, OCRBoundaries } = this.state
    const number = moment(page.fecha).format('YYYY-MM-DD')

    return (<div className='section'>
      <div className='columns'>
        <div className='column'>
          {this.getBreadcrumbs()}
        </div>
      </div>
      <div className='columns'>
        <div className='column'>
          <div className='card'>
            <header className='card-header is-block'>
              <p className='card-header-title is-block has-text-centered'>
                Número {number} / Página {page.pagina}
              </p>
            </header>
            <div className='card-content is-relative'>
              {/*<Magnifier
                ref={this.currentImage}
                src={base64Image}
                zoomFactor={1}
                mgWidth={200}
                mgHeight={200}
              />*/}
              <img ref={this.currentImage} src={base64Image} onLoad={() => this.getOCRBoundaries()} />

              <div style={{ position: 'absolute', top: 23, left: 18 }}>
                {OCRBoundaries}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

PageDetail.config({
  name: 'page-details',
  path: '/pages/:uuid',
  title: '<%= page.titulo %> | Detalles de publicación',
  breadcrumbs: [
    { label: 'Inicio', path: '/' },
    { label: 'Publicaciones', path: '/publications' },
    { label: '<%= page.titulo %>' }
  ],
  exact: true,
  validate: loggedIn
})

export default PageDetail
