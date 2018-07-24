<template>
    <el-container style="border: 1px solid #eee">
        <AsideMenu></AsideMenu>
        <el-container>
            <el-header>
                <el-row style="font-size: 20px">
                    <el-col :span="12">
                        <span>{{pageName}}信息列表</span>
                    </el-col>
                    <el-col :span="12" style="text-align: right">
                        <i class="el-icon-setting" style="margin-right: 1rem;" @click="dialogOfConfig=true"></i>
                        <el-button type="primary" round @click="showUpdatingDialog">更新</el-button>
                        <el-button type="primary" round
                                   @click="viewLatestData">
                            查看更新结果
                        </el-button>
                    </el-col>
                </el-row>
            </el-header>
            <!--配置信息对话框-->
            <el-dialog title="配置信息" :visible.sync="dialogOfConfig">
                <el-form :model="updatingConfig">
                    <el-form-item v-for="(value, key) in updatingConfig" :label='value.name+": " ' label-width="100px" :key="key">
                        <el-input clearable auto-complete="off" type="textarea" autosize v-model="value.value"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogOfConfig = false">取 消</el-button>
                    <el-button v-loading="saveUpdatingConfigLoading" type="primary" @click="saveConfig">保存配置</el-button>
                </div>
            </el-dialog>
            <!--获取最新数据对话框-->
            <el-dialog :title='"获取"+pageName+"最新数据"'
                       :visible.sync="dialogOfGetLatestData"
                       v-loading="getLatestDataLoading"
                       element-loading-text="获取最新数据中，请稍候...">
                <el-form :model="updatingConfig">
                    <el-form-item v-for="(value, key) in updatingConfig" :label='value.name+": " ' label-width="100px" :key="key">
                        <span v-model="value.value"></span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogOfGetLatestData = false">取 消</el-button>
                    <el-button type="primary" @click="getLatestData">获取最新数据</el-button>
                </div>
            </el-dialog>
            <!--编辑已存在专家信息对话框-->
            <el-dialog title="专家信息" :visible.sync="dialogOfInfo">
                <el-form :model="detailedData">
                    <el-form-item v-for="(value, key) in detailedSetting" :label='value.name+": " ' label-width="120px" :key="key">
                        <!--可编辑的显示输入框-->
                        <el-input clearable v-if='value.modify==="true" ' type="textarea" autosize v-model="detailedData[key]" auto-complete="off"></el-input>
                        <!--不可编辑的显示文本-->
                        <span v-else>{{detailedData[key]}}</span>
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
                    <el-form-item v-for="(value, key) in editableSetting" :label='value.name+": " ' label-width="120px" :key="key">
                        <!--可编辑的显示输入框-->
                        <el-input clearable v-if='value.modify==="true" ' type="textarea" autosize v-model="detailedData[key]" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogOfAddingNewAca = false">取 消</el-button>
                    <el-button type="primary" @click="saveNewAca()" :loading="addLoading">添 加</el-button>
                </div>
            </el-dialog>

            <el-main>
                <!--添加新专家按钮-->
                <el-row style="text-align: left; margin-bottom: 10px;">
                    <el-button type="primary" icon="el-icon-plus" circle @click="add()"></el-button>
                </el-row>
                <!--专家列表-->
                <p>共有 {{totalSize}} 条数据</p>
                <el-table border
                          highlight-current-row
                          v-loading="listLoading"
                          element-loading-text="拼命加载中..."
                          :data="storeData">
                    <!--编号-->
                    <el-table-column
                        label="编号"
                        type="index"
                        width="50">
                    </el-table-column>
                    <!--展示信息-->
                    <el-table-column v-for="(value, key) in listSetting" :label="value" :key="key">
                        <template slot-scope="scope">
                            <p class="p1">{{scope.row[key]}}</p>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button-group>
                                <!--编辑按钮-->
                                <el-button size="medium" @click="edit(scope.row)">编辑</el-button>
                                <!--删除按钮-->
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click.native="del(scope.row[idSetting.name])"
                                    size="medium"
                                ></el-button>
                            </el-button-group>
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
    </el-container>

</template>

<script>
    import AsideMenu from '@/components/AsideMenu'

    export default {
        name: "generalAdmin",
        data: function () {
            return {
                // 院士数据
                storeData: [],
                // 院士详细信息
                detailedData: {},
                // 对话框显示控制
                dialogOfInfo: false,     // 控制显示详细信息的对话框
                dialogOfConfig: false,      // 控制显示更新配置的对话框
                dialogOfAddingNewAca: false,    // 控制新增院士对话框
                dialogOfGetLatestData: false,     // 更新数据库对话框
                // 加载状态控制
                listLoading: false,     // 列表加载状态
                addLoading: false,       // 添加新信息按钮加载状态
                saveLoading: false,      // 保存更新的信息加载按钮
                getLatestDataLoading: false,     // 获取最新数据加载状态
                saveUpdatingConfigLoading:false,    // 保存更新配置设置
                // 分页控制
                pageNum: 1,
                pageSize: 20,
                totalSize: 0,
                // 日期选择器控制
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },
                // 页面设置
                listSetting: {},     // 信息列表设置，包含key和对应的中文名
                detailedSetting: {},   // 详细信息设置，包含key，中文名以及是否可编辑
                editableSetting: {},     // 可编辑的信息设置
                idSetting: {},   // 列表信息id的设置，包括id的key和类型（int与str）
                pageName: null,   // 页面名称
                updatingConfig: {},  // 更新配置
            }
        },
        components: {
            AsideMenu,
        },
        computed: {},
        methods: {
            // 点击页数触发事件
            handelCurrentChange: function (val) {
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
            // 弹出更新对话框
            showUpdatingDialog: function () {
                this.dialogOfGetLatestData = true;
            },
            // 删除专家信息
            del: function (id) {
                this.$confirm('此操作将永久删除该专家信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let requestUrl = this.apiUrl + '/delete/' + this.$route.params.tableId +
                        '?Id=' + id + '&flag=' + (this.idSetting.isDigit === 'true' ? 1 : 2);
                    this.axios.get(requestUrl)
                        .then(
                            (res) => {
                                if (res.data === true) {
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!'
                                    });
                                    // 数据量减一
                                    this.totalSize -= 1;
                                    let index = this.storeData.findIndex(
                                        (x) => {
                                            return x[this.idSetting.name] === id
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
                this.saveUpdatingConfigLoading=true;    // 保存更新配置按钮加载
                let requestUrl = this.apiUrl + '/setConfig/' + this.$route.params.tableId;
                let configData = {};      // 构造传递参数
                for (let key in this.updatingConfig) {
                    configData[key] = this.updatingConfig[key].value;
                }
                this.axios.post(requestUrl, configData,)
                    .then(
                        (res) => {
                            if (res.data === true) {   // 添加成功
                                this.$notify({
                                    title: '成功',
                                    message: '成功保存配置信息',
                                    type: 'success',
                                    duration: 4000
                                });
                                // 按钮加载状态消失
                                this.saveUpdatingConfigLoading = false;
                                // 对话框消失
                                this.dialogOfConfig = false;
                            }
                            else {  //添加失败
                                this.$notify({
                                    title: '失败',
                                    message: '保存信息失败',
                                    type: 'error',
                                    duration: 4000
                                });
                                // 按钮加载状态消失
                                this.saveUpdatingConfigLoading = false;
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
                        this.saveUpdatingConfigLoading = false;
                    });
            },
            // 检查专家信息完整性
            checkInfoIntegrity: function () {
                if (!this.detailedData) {
                    this.$message.error('所填信息不能为空');
                    return false;
                }
                return true;
            },
            // 保存更新的专家信息
            saveInfo: function () {
                if (this.checkInfoIntegrity()) {     // 检查信息完整性
                    this.saveLoading = true;
                    let requestUrl = this.apiUrl + '/update/' + this.$route.params.tableId +
                        '?Id=' + this.detailedData[this.idSetting.name] + '&flag=' + (this.idSetting.isDigit === 'true' ? 1 : 2);
                    this.axios.post(requestUrl, this.detailedData,
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
                                        return x[this.idSetting.name] === this.detailedData[this.idSetting.name]
                                    });
                                this.$set(this.storeData, index, this.detailedData)
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
                    // flag表示id的类型，1为整型，2为str
                    let requestUrl = this.apiUrl + '/add/' + this.$route.params.tableId + '?flag=' + (this.idSetting.isDigit === 'true' ? 1 : 2);
                    this.axios.post(requestUrl, this.detailedData,
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
            // 获取最新数据
            getLatestData: function () {
                this.getLatestDataLoading = true;
                this.axios.get(this.apiUrl + '/generateUpgrade/' + this.$route.params.tableId + '?year=' + this.updatingConfig.year)
                    .then(
                        (res) => {
                            if (res.data === true) {
                                this.$notify({
                                    title: '成功',
                                    message: '成功获取最新数据，请查看更新结果',
                                    type: 'success',
                                    duration: 4000
                                });
                                this.getLatestDataLoading = false;
                                this.dialogOfGetLatestData = false;
                            }
                            else {
                                this.$notify({
                                    title: '失败',
                                    message: '获取最新数据失败',
                                    type: 'error',
                                    duration: 4000
                                });
                                this.getLatestDataLoading = false;
                            }
                        }
                    )
                    .catch(
                        (error) => {
                            console.log(error);
                            this.$notify({
                                title: '失败',
                                message: '网络异常',
                                type: 'warning',
                                duration: 4000
                            });
                            this.getLatestDataLoading = false;
                        }
                    );
            },
            viewLatestData: function () {
                window.location.href = '/updated/results/' + this.$route.params.tableId;
            },
            // 页面跳转请求
            pageJumping: function () {
                this.listLoading = true;
                let requestUrl = this.apiUrl + '/display/' + this.$route.params.tableId + '?page=' + this.pageNum + '&size=' +
                    this.pageSize + '&flag=' + (this.idSetting.isDigit === 'true' ? 1 : 2);
                this.axios.get(requestUrl)
                    .then(
                        (res) => {
                            if (res.status === 200) {
                                // 保存的数据
                                this.storeData = res.data;
                                // 取消页面加载转态
                                this.listLoading = false;
                                window.location.href = '#top';
                            }
                        }
                    ).catch(function (error) {
                    console.log(error);
                });
            },
            // 获取页面setting
            getPageSetting: function () {
                this.listLoading = true;
                this.axios.get(this.apiUrl + '/getConfig/' + this.$route.params.tableId)
                    .then(
                        (res) => {
                            if (res.status === 200) {
                                // 获取页面配置信息
                                let pageSettingInfo = res.data;
                                // 总页数配置
                                this.totalSize = pageSettingInfo.totalSize;
                                // 页面名字
                                this.pageName = pageSettingInfo.pageName;
                                // 列表展示信息配置
                                this.listSetting = JSON.parse(pageSettingInfo.show);
                                // 详细信息配置
                                this.detailedSetting = JSON.parse(pageSettingInfo.all);
                                // 可编辑信息配置
                                Object.keys(this.detailedSetting).forEach(
                                    (key) => {
                                        if (this.detailedSetting[key].modify === 'true') {
                                            this.editableSetting[key] = this.detailedSetting[key];
                                        }
                                    });

                                // id设置
                                this.idSetting = JSON.parse(pageSettingInfo.index);
                                // 更新设置
                                this.updatingConfig = JSON.parse(pageSettingInfo.upgrade);
                                this.pageJumping();
                            }
                        }
                    )
                    .catch(
                        (error) => {
                            console.log(error);
                        }
                    );
            },
        },
        created: function () {
            this.getPageSetting();
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

    .el-aside {
        background-color: #545c64;
    }

    .el-menu {
        text-align: center;
    }

    a {
        color: #fff;
        text-decoration: none;
    }

    a:hover {
        color: #ffd04b;
    }
</style>
