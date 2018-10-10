import React from 'react'

import api from '~base/api'
import PageComponent from './page-component'
import { BranchedPaginatedTable } from '~base/components/base-paginated-table'
import BaseFilterPanel from '~base/components/base-filters'
import BaseMultiFilter from '~base/components/base-multifilter'
import download from 'downloadjs'
import json2csv from 'json2csv'
import classNames from 'classnames'

import Loader from '~base/components/spinner'

class ListPageComponent extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      filters: {},
      exporting: false,
      selectedRows: [],
      loadRequest: new Date()
    }
  }

  reload () {
    this.setState({
      selectedRows: [],
      loadRequest: new Date()
    })
  }

  getFilters () {}

  finishUp (data) {
    this.setState({
      className: ''
    })
  }

  showModal () {
    this.setState({
      className: ' is-active'
    })
  }

  hideModal () {
    this.setState({
      className: ''
    })
  }

  getHeader () {
    const config = this.config

    if (config.headerLayout === 'custom') {
      return <config.headerComponent
        reload={() => this.reload()}
        {...this.state}
      />
    } else if (config.headerLayout === 'create') {
      return (<header className='card-header'>
        <p className='card-header-title'>
          {config.title}
        </p>
        <div className='card-header-select'>
          <button className='button is-primary' onClick={() => this.showModal()}>
            {config.createComponentLabel}
          </button>
          <config.createComponent
            className={this.state.className}
            hideModal={() => this.hideModal()}
            finishUp={(data) => this.finishUp(data)}
            branchName={config.cursorName}
            baseUrl={config.apiUrl}
            url={config.apiUrl}
          />
        </div>
      </header>)
    } else {
      return (<header className='card-header'>
        <p className='card-header-title'>
          {config.title}
        </p>
      </header>)
    }
  }

  async handleOnFilter (data) {
    clearTimeout(this.timer)

    this.timer = setTimeout(async () => {
      this.setState({ filters: data })
    }, 500)
  }

  async handleOnExport (data, filename) {
    this.setState({ exporting: true })
    const config = this.config
    const params = {
      start: 0,
      limit: 1000000 // ToDo: change mongoose data tables to support limit: 'all'
    }

    const body = await api.get(config.apiUrl, {
      ...this.state.filters,
      ...params
    })

    let csvArray = []
    if (body.data.length) {
      csvArray = body.data.map(row => this.exportFormatter(row))
    }

    const csv = json2csv.parse(csvArray)
    download('data:text/csv;charset=utf-8,' + csv, (filename || config.name) + '.csv', 'data:text/plain; charset=utf-8')
    this.setState({ exporting: false })
  }

  onSelectChange (items) {
    this.setState({
      selectedRows: items
    })
  }

  render () {
    const config = this.config
    const filters = this.getFilters()

    if (!this.state.loaded) {
      return <Loader />
    }

    let multiFilterComponent
    if (filters && !filters.schema) {
      const [ defaultInput ] = Object.keys(filters)
      multiFilterComponent = (
        <BaseMultiFilter
          config={filters}
          filters={{...config.defaultFilters, ...this.state.filters}}
          onFilter={(data) => this.handleOnFilter(data)}
          defaultInput={defaultInput}
        />
      )
    }

    let filterComponent
    if (filters && filters.schema) {
      filterComponent = (
        <BaseFilterPanel
          schema={filters.schema}
          uiSchema={filters.uiSchema}
          filters={{...config.defaultFilters, ...this.state.filters}}
          export={!!this.exportFormatter}
          onFilter={(data) => this.handleOnFilter(data)}
          onExport={(data) => this.handleOnExport(data, this.state.filename)}
        />
      )
    }

    let hasTopPanel = this.exportFormatter || multiFilterComponent

    let exportButtonClassName = classNames('button is-primary', {
      'is-loading': this.state.exporting
    })

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>{config.title}</h1>
            {hasTopPanel && <div className='columns'>
              <div className='column is-paddingless-bottom'>
                {multiFilterComponent}
              </div>
              {this.exportFormatter && <div className='column is-paddingless-bottom has-text-right'>
                <a
                  className={exportButtonClassName}
                  onClick={() => this.handleOnExport()}
                >Exportar</a>
              </div>}
            </div>}
            <div className='card'>
              {this.getHeader()}
              <div className='card-content'>
                <div className='columns'>
                  <div className='column'>
                    <BranchedPaginatedTable
                      loadRequest={this.state.loadRequest}
                      branchName={config.cursorName}
                      baseUrl={config.apiUrl}
                      columns={this.getColumns()}
                      selectable={config.selectable}
                      sortedBy={config.sortBy || 'name'}
                      onSelectChange={(items) => this.onSelectChange(items)}
                      filters={{...config.defaultFilters, ...this.state.filters}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {filterComponent}
      </div>
    )
  }
}

export default ListPageComponent
