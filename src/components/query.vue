<template>
  <div>
    <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
      <el-tab-pane label="按条件查询" name="按条件查询">
        <el-col :span="8">
          <router-link to="/query/result">
          <el-input placeholder="请输入要查询用户的姓名" v-model="targetStr"
                    @keyup.enter.native="changeShow()"></el-input>
          </router-link>
        </el-col>
        <el-col :span="8">
          <router-link to="/query/result">
            <el-button type="primary" round @click="changeShow()"
                     >查询</el-button>
          </router-link>
        </el-col>
        <router-view :status="isShow" :str="targetStr1"></router-view>
      </el-tab-pane>
      <el-tab-pane label="显示全部" name="显示全部">
        <router-link to=/query/detail>
          <el-button type="success" round @click="isShow=true">点我查询全部用户信息</el-button>
        </router-link>
        <router-view :status="isShow"></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import detail from './detail'
import {mapState} from 'vuex'

export default {
  components: {detail},
  computed: {
    ...mapState(['lists'])
  },
  methods: {
    handleClick (tab) {
      this.isShow = false
      this.targetStr = ''
    },
    changeShow () {
      this.isShow = true
      this.targetStr1 = this.targetStr
    }
  },
  data () {
    return {
      activeName: 'first',
      isShow: false,
      targetStr: '',
      targetStr1: ''
    }
  }
}
</script>

<style>

</style>
