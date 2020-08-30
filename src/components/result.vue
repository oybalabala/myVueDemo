<template>
  <div>
    <el-table :data="result.slice((currentPage - 1) * pageSize,currentPage *pageSize)"
              style="width: 100%" v-show="status"
              @selection-change="handleSelectionChange"
              ref="multipleTable"
              :row-key="getRowKey">
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="55">
      </el-table-column>
      <el-table-column label="学号" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="180">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!--            编辑功能-->
          <el-button type="primary" size="mini" icon="el-icon-edit"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!--            删除功能-->
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <!--      全部删除按钮-->
    <el-button type="danger" v-show="status && isShow" @click="popDelete" round
               style="margin-top: 20px">批量删除
    </el-button>
    <!--      全部取消选中-->
    <el-button @click="clearSelection()" v-show="status && isShow" round
               style="margin-top: 20px">取消选择</el-button >
<!--    分页功能-->
    <el-pagination
      v-show="status"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes=pageSizes
      :page-size=pageSize
      layout="total, sizes, prev, pager, next, jumper"
      :total=result.length>
    </el-pagination>
    <span v-show="status">
          <span>已选择{{multipleSelection.length}}</span> / {{ this.result.length }}
      </span>
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form label-width="70px" :model="editForm" :rules="rules" ref="ruleForm">
        <el-form-item label="学号" prop="id">
          <el-input type="text" v-model="editForm.id" placeholder="请输入学号"
                    @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input type="text" v-model="editForm.name" placeholder="请输入姓名"
                    @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click= "editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pageSizes: [5, 10, 20, 30],
      pageSize: 5,
      currentPage: 1,
      delId: [],
      // multipleSelection为选中table的行数据数组
      multipleSelection: [],
      // editForm编辑提示框中输入的数据
      editForm: {
        id: '',
        name: '',
        editIndex: ''
      },
      editDialogVisible: false,
      rules: {
        id: [
          {required: true, message: 'id不能为空', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '姓名不能为空', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    WhetherItHasDuplicateId (index) {
      let id = this.editForm.id
      for (let i = 0; i < this.$store.state.lists.length; i++) {
        if (this.$store.state.lists[i].id === id && i !== index) {
          return true
        }
      }
      console.log('判断失败')
      return false
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('我执行啦')
          this.editDialogVisible = false
          let Index
          // 计算查找出的项在原本lists中的索引
          for (let i = 0; i < this.$store.state.lists.length; i++) {
            if (this.editForm.id === this.$store.state.lists[i].id) {
              Index = i
            }
          }
          if (this.WhetherItHasDuplicateId(Index)) {
            this.$message.error('输入的ID已经存在，请重新输入！')
            this.errorShow = true
            this.editDialogVisible = true
          } else {
            // 由于所有操作都是在lists上操作的，所以在dispatch之前，要更新editForm.editIndex使提交对象的
            // index与lists对应上，而不是和result对应
            this.editForm.editIndex = Index
            this.$store.dispatch('editData', this.editForm)
            console.log('this.editForm = {}执行了')
            this.editForm = {}
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 全部取消选中
    clearSelection () {
      this.$refs.multipleTable.clearSelection()
    },
    popDelete: function () {
      this.$confirm('确认删除所有选中的记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.multipleSelection.length; i++) {
          this.delId.push(this.multipleSelection[i]['id'])
        }
        for (let i = 0; i < this.delId.length; i++) {
          this.$store.dispatch('deleteQueryResult', this.delId[i])
        }
        this.delId = []
        this.$refs.multipleTable.clearSelection()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getRowKey (row) {
      return row.id
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    handleEdit (index) {
      this.editDialogVisible = true
      this.editForm.editIndex = this.pageSize * (this.currentPage - 1) + index
    },
    handleDelete (index) {
      let restItem = this.$store.state.lists.length - (this.currentPage - 1) * this.pageSize
      let Index = this.editForm.editIndex = this.pageSize * (this.currentPage - 1) + index

      this.$confirm('确认删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteQueryResult', this.result[Index].id)
        if (index === 0 && restItem === 1) {
          console.log('跳转至前一页')
          this.currentPage = this.currentPage - 1
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  // watch: {
  //   str: function () {
  //     console.log('str:' + this.str)
  //   }
  // },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    str: {
      type: String,
      default: ''
    }
  },
  computed: {
    result: {
      get () {
        const arr = []
        const keyWord = this.str
        if (keyWord === '') {
          return []
        } else {
          let reg = new RegExp(keyWord)
          for (let i = 0; i < this.$store.state.lists.length; i++) {
            if (reg.test(this.$store.state.lists[i].name)) {
              arr.push(this.$store.state.lists[i])
            }
          }
          return arr
        }
      }
    },
    isShow: {
      get () {
        if (this.multipleSelection.length !== 0) {
          return true
        } else {
          return false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
