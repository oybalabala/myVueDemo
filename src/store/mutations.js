import {ADD_LIST, DELETE_ITEM, DELETE_QUERY_RESULT, EDIT_DATA} from './mutation-types'
export default {
  // 添加用户
  [ADD_LIST]: function (state, {list}) {
    // console.log('mutations中的方法ADD_LIST执行了！')
    // console.log(list)
    state.lists.push(list)
    // console.log(state.lists[0].id)
    // console.log('添加成功')
  },
  // 在detail中删除用户
  [DELETE_ITEM]: function (state, {Index}) {
    state.lists.splice(Index, 1)
  },
  // 在搜索完毕的result中删除用户
  [DELETE_QUERY_RESULT]: function (state, {id}) {
    const Id = id
    let index
    for (let i = 0; i < state.lists.length; i++) {
      if (Id === state.lists[i].id) {
        index = i
        break
      }
    }
    state.lists.splice(index, 1)
  },

    // 修改编辑过后的数据
  [EDIT_DATA]:function (state,{submitData}){
     state.lists[submitData.editIndex].id = submitData.id
     state.lists[submitData.editIndex].name = submitData.name
  }

}
