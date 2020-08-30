<template>
  <div>
  <el-row class="title">
    <el-col :span="24"><div class="grid-content bg-purple-dark">
      <h1>hi!</h1>
    </div>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="12">
      <div class="grid-content bg-purple menu">
        <el-dropdown>
          <el-button type="primary">
            {{selectTitle}}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link to="/about">
                <el-button type="success" round @click="changeWord('录入')">录入</el-button>
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/query">
                <el-button type="success" round @click="changeWord('查询')">查询</el-button>
              </router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="grid-content bg-purple-light">
        <router-view></router-view>
      </div>
    </el-col>
  </el-row>
  </div>
</template>
<script>
import about from './components/about'
import query from './components/query'
import axios from 'axios'
export default {
  mounted () {
    axios.get('http://test/mock').then(
      (resp) => {
        // console.log(resp)
        this.$store.state.lists = resp.data
      }
    )
  },
  components: {about, query},
  methods: {
    changeWord (word) {
      this.selectTitle = word
    }
  },
  data () {
    return {
      selectTitle: '请选择'
    }
  }

}
</script>

<style>
.menu{
  text-align: center;
}
.title{
  text-align: center;
  font-size: 40px;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  /*background: #99a9bf;*/
}
.bg-purple {
  /*background: #d3dce6;*/
}
.bg-purple-light {
  /*background: #e5e9f2;*/
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
