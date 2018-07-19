<template>
    <el-container>
        <el-header>
            <el-row style="font-size: 20px">
                <el-col :span="12">
                    <span>中国科学院院士列表</span>
                </el-col>
                <el-col :span="12" style="text-align: right">
                    <i class="el-icon-setting" style="margin-right: 1rem;" @click="dialogOfConfig=true"></i>
                    <el-button type="primary" round>更新</el-button>
                </el-col>
            </el-row>
        </el-header>
        <!--配置信息对话框-->
        <el-dialog title="配置信息" :visible.sync="dialogOfConfig">
            <el-form :model="updatingConfig">
                <el-form-item label="更新来源URL" label-width="120px">
                    <el-input auto-complete="off" type="textarea" autosize v-model="updatingConfig.url"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOfConfig = false">取 消</el-button>
                <el-button type="primary" @click="saveConfig">保 存</el-button>
            </div>
        </el-dialog>
        <!--编辑已存在院士信息对话框-->
        <el-dialog title="专家信息" :visible.sync="dialogOfInfo">
            <el-form :model="detailedData">
                <el-form-item label="专家姓名" label-width="120px">
                    <el-input v-model="detailedData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="当选时间" label-width="120px">
                    <el-date-picker
                        v-model="detailedData.evaluate_time"
                        :editable="false"
                        type="year"
                        format="yyyy 年"
                        value-format="yyyy"
                        placeholder="选择年"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="类型" label-width="120px">
                    <el-input type="textarea" autosize v-model="detailedData.expert_category" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="链接" label-width="120px">
                    <el-input type="textarea" autosize v-model="detailedData.link" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="介绍" label-width="120px">
                    <el-input type="textarea" autosize v-model="detailedData.introduce" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOfInfo = false">取 消</el-button>
                <el-button type="primary" @click="saveInfo()" :loading="saveLoading">保 存</el-button>
            </div>
        </el-dialog>
        <!--添加新的院士信息对话框-->
        <el-dialog title="新增院士信息" :visible.sync="dialogOfAddingNewAca">
            <el-form :model="detailedData">
                <el-form-item label="专家姓名" label-width="120px">
                    <el-input v-model="detailedData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="当选时间" label-width="120px">
                    <el-date-picker
                        v-model="detailedData.evaluate_time"
                        type="year"
                        :editable="false"
                        format="yyyy 年"
                        value-format="yyyy"
                        placeholder="选择年"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="类型" label-width="120px">
                    <el-input type="textarea" autosize v-model="detailedData.expert_category" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="链接" label-width="120px">
                    <el-input type="textarea" autosize v-model="detailedData.link" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="介绍" label-width="120px">
                    <el-input type="textarea" autosize v-model="detailedData.introduce" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOfAddingNewAca = false">取 消</el-button>
                <el-button type="primary" @click="saveNewAca()" :loading="addLoading">添 加</el-button>
            </div>
        </el-dialog>

        <el-main>
            <!--添加新院士按钮-->
            <el-row style="text-align: left; margin-bottom: 10px;">
                <el-button type="primary" icon="el-icon-plus" circle @click="add()"></el-button>
            </el-row>
            <!--院士列表-->
            <p>共有 {{totalSize}} 条数据</p>
            <el-table border
                      highlight-current-row
                      v-loading="listLoading"
                      element-loading-text="拼命加载中..."
                      :data="storeData">
                <el-table-column label="姓名" width="80" prop="name">
                </el-table-column>
                <el-table-column label="当选时间" width="100" prop="evaluate_time">
                </el-table-column>
                <el-table-column label="链接" width="300">
                    <template slot-scope="scope">
                        <a :href="scope.row.link">{{scope.row.link}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="介绍" width="800">
                    <template slot-scope="scope">
                        <p class="p1">{{scope.row.introduce}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!--编辑按钮-->
                        <el-button
                            size="medium"
                            @click="edit(scope.row)">编辑
                        </el-button>
                        <!--删除按钮-->
                        <el-button
                            size="medium"
                            type="danger"
                            icon="el-icon-delete"
                            @click.native="del(scope.row.id)"
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
                background
                layout="prev, pager, next"
                :total="totalSize"
                :current-page="pageNum"
                :page-size="pageSize"
                @current-change="handelCurrentChange">
            </el-pagination>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "AcaOfSciAdmin",
        data: function () {
            return {
                // 院士数据
                storeData: [],
                // 院士详细信息
                detailedData: {},
                // 更新配置
                updatingConfig: {
                    url: 'http://www.casad.cas.cn/chnl/371/index.html'
                },
                // 对话框显示控制
                dialogOfInfo: false,     // 控制显示详细信息的对话框
                dialogOfConfig: false,      // 控制显示更新配置的对话框
                dialogOfAddingNewAca: false,    // 控制新增院士对话框
                // 加载状态控制
                listLoading: false,     // 列表加载状态
                addLoading: false,       // 添加新信息按钮加载状态
                saveLoading: false,      // 保存更新的信息加载按钮
                // 分页控制
                pageNum: 1,
                pageSize: 20,
                totalSize: 0,
                // 日期选择器控制
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                }
            }
        },
        computed: {},
        methods: {
            // 点击页数触发时间
            handelCurrentChange(val) {
                this.pageNum = val;
                this.pageJumping();
            },
            // 弹出添加新专家信息对话框
            add: function () {
                this.detailedData = {};
                this.dialogOfAddingNewAca = true;
            },
            // 弹出编辑专家信息对话框
            edit: function (rowData) {
                this.dialogOfInfo = true;
                // 拷贝
                this.detailedData = Object.assign({}, rowData)
            },
            // 删除专家信息
            del: function (id) {
                this.$confirm('此操作将永久删除该专家信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios.get(this.apiUrl + '/delete/42?Id=' + id)
                        .then(
                            (res) => {
                                if (res.data === true) {
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!'
                                    });
                                    // 数据量减一
                                    this.totalSize -= 1;
                                    let index = this.storeData.findIndex(function (x) {
                                        return x.id === id
                                    });
                                    this.storeData.splice(index, 1);
                                }
                            }
                        ).catch(
                        (error) => {
                            console.log(error);
                            this.$notify({
                                title: '失败',
                                message: '网络异常',
                                type: 'warning',
                                duration: 4000
                            });
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 保存更新配置
            saveConfig: function () {
                this.dialogOfConfig = false;
                this.$notify({
                    title: '成功',
                    message: '成功保存配置信息',
                    type: 'success',
                    duration: 4000
                });
            },
            // 检查专家信息完整性
            checkInfoIntegrity: function () {
                if (!this.detailedData.name || this.detailedData.name === '') {
                    this.$message.error('专家名字不能为空');
                    return false;
                }
                return true;
            },
            // 保存更新的专家信息
            saveInfo: function () {
                if (this.checkInfoIntegrity()) {     // 检查信息完整性
                    this.saveLoading = true;
                    this.axios.post(this.apiUrl + '/update/42?Id=' + this.detailedData.id, this.detailedData,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }).then(
                        (res) => {
                            if (res.data === true) {   // 添加成功
                                this.$notify({
                                    title: '成功',
                                    message: '信息更新成功',
                                    type: 'success',
                                    duration: 4000
                                });
                                // 前端数据更新
                                let index = this.storeData.findIndex(
                                    (x) => {
                                        return x.id === this.detailedData.id
                                    });
                                this.$set(this.storeData,index,this.detailedData)
                                // 按钮加载状态消失
                                this.saveLoading = false;
                                // 对话框消失
                                this.dialogOfInfo = false;
                            }
                            else {  //添加失败
                                this.$notify({
                                    title: '失败',
                                    message: '信息更新失败',
                                    type: 'error',
                                    duration: 4000
                                });
                                // 按钮加载状态消失
                                this.saveLoading = false;
                            }
                        }
                    ).catch(
                        (error) => {
                            console.log(error);
                            this.$notify({
                                title: '失败',
                                message: '网络异常',
                                type: 'warning',
                                duration: 4000
                            });
                            // 按钮加载状态消失
                            this.saveLoading = false;
                        });
                }
            },
            // 保存新添加的专家信息
            saveNewAca: function () {
                if (this.checkInfoIntegrity()) {     // 检查信息完整性
                    // 显示按钮加载
                    this.addLoading = true;
                    this.axios.post(this.apiUrl + '/add/42', this.detailedData,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }).then(
                        (res) => {
                            if (res.data === true) {   // 添加成功
                                this.$notify({
                                    title: '成功',
                                    message: '添加成功',
                                    type: 'success',
                                    duration: 4000
                                });
                                // 总数据数量加一
                                this.totalSize += 1;
                                // 按钮加载状态消失
                                this.addLoading = false;
                                // 对话框消失
                                this.dialogOfAddingNewAca = false;
                            }
                            else {  //添加失败
                                this.$notify({
                                    title: '失败',
                                    message: '添加失败',
                                    type: 'error',
                                    duration: 4000
                                });
                                // 按钮加载状态消失
                                this.addLoading = false;
                            }
                        }
                    ).catch(
                        (error) => {
                            console.log(error);
                            this.$notify({
                                title: '失败',
                                message: '网络异常',
                                type: 'warning',
                                duration: 4000
                            });
                            // 按钮加载状态消失
                            this.addLoading = false;
                        });
                }
            },
            // 页面跳转请求
            pageJumping: function () {
                this.listLoading = true;
                this.axios.get(this.apiUrl + '/display/42?page=' + this.pageNum + '&size=' + this.pageSize)
                    .then(
                        (res) => {
                            if (res.status === 200) {
                                this.totalSize = res.data.pop().totalSize;
                                this.storeData = res.data;
                                this.listLoading = false;
                            }
                        }
                    ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        created: function () {
            this.pageJumping();
        }
    }
</script>

<style scoped>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        text-align: left;
        line-height: 60px;
    }

    .p1 {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
</style>
