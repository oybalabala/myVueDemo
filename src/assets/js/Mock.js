// 引入mockjs
import Mock from 'mockjs'
// 使用mockjs模拟数据
Mock.mock('http://test/mock', () => {
  const users = []
  for (let i = 0; i < 100; i++) {
    users.push({
      'id': Mock.Random.guid(),
      'name': Mock.Random.cname()
    })
  }
  return users
})
