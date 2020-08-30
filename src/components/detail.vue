<template>
  <div>
    <template>
      <!--      表格显示-->
      <el-table :data="lists.slice((currentPage - 1) * pageSize,currentPage *pageSize)"
                style="width: 100%" v-show="status"
                @selection-change="handleSelectionChange"
                ref="multipleTable"
                :row-key="getRowKey">
        <!--        复选框-->
        <el-table-column
          type="selection"
          :reserve-selection="true"
          width="55">
        </el-table-column>
        <!--        第一列：学号--->
        <el-table-column label="学号" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <!--        第一列：姓名--->
        <el-table-column label="姓名" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <!--        第一列：操作--->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--            编辑功能-->
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
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
                 style="margin-top: 20px">取消选择
      </el-button>
      <!--      分页功能-->
      <el-pagination
        v-show="status"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes=pageSizes
        :page-size=pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total=lists.length>
      </el-pagination>
      <span v-show="status">
          <span>已选择{{ multipleSelection.length }}</span> / {{ $store.state.lists.length }}
      </span>
      <!--          editDialogVisible控制修改对话框的隐藏于显示-->
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
            <el-input type="text" v-model="editForm.name" placeholder="请输入学号"
                      @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button @click="editDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data () {
    return {
      pageSizes: [5, 10, 20, 30],
      pageSize: 5,
      currentPage: 1,
      multipleSelection: [],
      delId: [],
      editDialogVisible: false,
      // editForm编辑提示框中输入的数据
      editForm: {
        id: '',
        name: '',
        editIndex: ''
      },
      errorShow: false,
      rules: {
        id: [
          {required: true, message: 'id不能为空', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'}
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
        // 判断编辑的元素是否合法---->如果除了当前编辑的元素之外还有id与当前编辑元素一样的元素，则返回true
        if (this.$store.state.lists[i].id === id && i !== index) {
          return true
        }
      }
      return false
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editDialogVisible = false
          if (this.WhetherItHasDuplicateId(this.editForm.editIndex)) {
            this.$message.error('输入的ID已经存在，请重新输入！')
            this.errorShow = true
            this.editDialogVisible = true
          } else {
            this.$store.dispatch('editData', this.editForm)
            this.editForm = {}
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearSelection () {
      this.$refs.multipleTable.clearSelection()
    },
    getRowKey (row) {
      return row.id
    },
    // 批量删除函数
    popDelete: function () {
      this.$confirm('确认删除所选中的' + this.multipleSelection.length + '条记录吗？', '提示', {
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (val) {
      this.pageSize = val
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    handleEdit (index) {
      this.editDialogVisible = true
      this.editForm.editIndex = this.pageSize * (this.currentPage - 1) + index
    },
    handleDelete (index) {
      // 当前页剩余条数
      let restItem = this.$store.state.lists.length - (this.currentPage - 1) * this.pageSize
      let Index = this.editForm.editIndex = this.pageSize * (this.currentPage - 1) + index
      this.$confirm('确认删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('deleteItem', Index)
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
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['lists']),
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
