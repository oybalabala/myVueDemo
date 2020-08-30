import {ADD_LIST, DELETE_ITEM, DELETE_QUERY_RESULT, EDIT_DATA} from './mutation-types'
export default {
  addList ({commit}, list) {
    // console.log('action执行了！')
    // console.log(list)
    commit(ADD_LIST, {list})
  },
  deleteItem ({commit}, Index) {
    commit(DELETE_ITEM, {Index})
    console.log(Index)
  },
  deleteQueryResult ({commit}, id) {
    commit(DELETE_QUERY_RESULT, {id})
  },
  editData ({commit}, submitData) {
    commit(EDIT_DATA, {submitData})
  }
  // WhetherItHasDuplicateId ({commit}, Id) {
  //   commit(WHETHER_IT_HAS_DUPLICATE_ID, {Id})
  // }
}
