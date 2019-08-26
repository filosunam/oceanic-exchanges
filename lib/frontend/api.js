import qs from 'qs'

import request from './request'
import envVars from './env-variables'
import tree from '~core/tree'

export default {
  get (endpoint, data, options) {
    return this.request('get', endpoint, data, options)
  },

  post (endpoint, data, options) {
    return this.request('post', endpoint, data, options)
  },

  put (endpoint, data, options) {
    return this.request('put', endpoint, data, options)
  },

  del (endpoint, data, options) {
    return this.request('del', endpoint, data, options)
  },

  request (method, endpoint, data, options = {}) {
    let url = `${envVars.API_HOST}/api${endpoint}`

    const headers = {
      'Accept': 'application/json',
      ...options.headers
    }

    if (tree.get('jwt')) {
      headers['Authorization'] = `Bearer ${tree.get('jwt')}`
    }

    if (method === 'get') {
      url += `?${qs.stringify(data)}`
      return request('get', headers, url)
    } else {
      return request(method, headers, url, data)
    }
  }
}
