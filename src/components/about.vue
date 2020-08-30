<template>
<div>
  <el-form :model="ruleForm" ref="ruleForm" :rules="rules"  label-width="100px" class="demo-ruleForm">
    <el-form-item label="学号" prop="id">
      <el-input v-model="ruleForm.id"></el-input>
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addStudent('ruleForm')">添加</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      rules: {
        id: [
          {required: true, message: 'id不能为空', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'}
        ]
      },
      ruleForm: {
        id: '',
        name: ''
      },
      list: {}
    }
  },
  methods: {
    WhetherItHasDuplicateId () {
      let id = this.ruleForm.id
      for (let i = 0; i < this.$store.state.lists.length; i++) {
        if (this.$store.state.lists[i].id === id) {
          return true
        }
      }
      console.log('判断失败')
      return false
    },
    addStudent (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.WhetherItHasDuplicateId()) {
            this.$message.error('输入的ID已经存在，请重新输入！')
          } else {
            // console.log('addList方法执行了！')
            const name = this.ruleForm.name
            // const value = this.value
            const id = this.ruleForm.id
            const list = {name: name, id: id}
            this.$store.dispatch('addList', list)
            // console.log('给action分发完毕！！')
            this.ruleForm.name = ''
            this.ruleForm.id = ''
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>

</style>
