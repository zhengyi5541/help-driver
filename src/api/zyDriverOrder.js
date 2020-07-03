import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/zyDriverOrder',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/zyDriverOrder/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/zyDriverOrder',
    method: 'put',
    data
  })
}

export default { add, edit, del }
