<template>
    <el-container style="border: 1px solid #eee">
        <AsideMenu></AsideMenu>
        <el-container>
            <el-header>
                <el-row style="font-size: 20px">
                    <el-col :span="12">
                        <span>{{pageName}}更新结果</span>
                    </el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button type="primary" round>保存更新结果</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <!--new数据详细信息对话框-->
            <el-dialog title="新增数据更新信息" :visible.sync="dialogOfNewData">
                <!--保证this.detailedDatab不是一个空对象，否则在初始化绑定时会报错-->
                <el-form label-width="5rem" :model="detailedData" v-if='JSON.stringify(this.detailedData)!=="{}" '>
                    <el-form-item v-for="(value, key) in detailedSetting" :label='value.name+": " ' :key="key">
                        <el-input v-if='value.modify==="true" ' auto-complete="off" type="textarea" autosize v-model="detailedData[key].newValue"></el-input>
                        <span v-else>{{detailedData[key].newValue}}</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogOfNewData = false">取 消</el-button>
                    <el-button type="primary" @click="submitModification" v-loading="submitModificationLoading">提 交</el-button>
                </div>
            </el-dialog>

            <!--saved数据详细信息对话框-->
            <el-dialog title="数据更新信息" :visible.sync="dialogOfSavedData">
                <!--保证this.detailedDatab不是一个空对象，否则在初始化绑定时会报错-->
                <el-form label-width="5rem" :model="detailedData" v-if='JSON.stringify(this.detailedData)!=="{}" '>
                    <el-form-item v-for="(value, key) in detailedSetting" :label='value.name+": " ' :key="key">
                        <span>{{detailedData[key].newValue}}</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogOfSavedData = false">关 闭</el-button>
                </div>
            </el-dialog>

            <el-dialog title="数据更改信息" visible.sync="false">
                <el-form label-width="5rem" :model="detailedData">
                    <el-row style="font-size: 20px;text-align: center">
                        <el-col :span="12" style="border-right: 2px solid #eee">
                            原数据
                        </el-col>
                        <el-col :span="12">
                            新数据
                        </el-col>
                    </el-row>
                    <el-row style="text-align: left" v-for="(value, key) in detailedSetting" :key="key">
                        <el-col :span="12" style="border-right: 2px solid #eee">
                            <el-form-item :label='value.name+": " '>
                                <span>{{typeof (detailedData[key])!=='undefined'?detailedData[key].oldValue:''}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item :label='value.name+": " '>
                                <el-input v-if="typeof (detailedData[key])!=='undefined'" auto-complete="off" type="textarea" autosize
                                          v-model="detailedData[key].newValue"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="">取 消</el-button>
                    <el-button type="primary" @click="">保 存</el-button>
                </div>
            </el-dialog>
            <!--提示无更新结果-->
            <el-alert
                v-if="existUpdatedResults"
                title="错误!"
                type="error"
                description="暂无更新结果，请返回上一页面先获取最新数据"
                show-icon>
            </el-alert>
            <el-main>
                <!--信息列表-->
                <p>共有{{totalSize}}条数据</p>
                <el-table border
                          highlight-current-row
                          v-loading="listLoading"
                          element-loading-text="拼命加载更新结果中..."
                          :data="storeData">
                    <!--序号-->
                    <el-table-column
                        label="序号"
                        width="70">
                        <template slot-scope="scope">
                            <span>{{scope.row.index}}</span>
                        </template>
                    </el-table-column>
                    <!--展示数据信息列-->
                    <el-table-column v-for="(value, key) in listSetting" :label="value" :key="key">
                        <template slot-scope="scope">
                            <p class="p1">{{typeof (scope.row.data[key])!=='undefined'?scope.row.data[key].newValue:key}}</p>
                        </template>
                    </el-table-column>
                    <!--数据状态列-->
                    <el-table-column label="状态"
                                     prop="status"
                                     width="100"
                                     :filters="[{text:'被移除',value:'deleted'},{text:'新增',value:'new'},{text:'数据更新',value:'update'},{text:'已保存',value:'saved'}]"
                                     :filter-method="statusFilter">
                        <template slot-scope="scope">
                            <el-tag v-if='scope.row.status==="deleted"' type='danger'>
                                被移除
                            </el-tag>
                            <el-tag v-else-if='scope.row.status==="new"' type="success">
                                新增
                            </el-tag>
                            <el-tag v-else-if='scope.row.status==="saved"' type="info">
                                已保存
                            </el-tag>
                            <el-tag v-else-if='scope.row.status==="update"'>
                                数据更新
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!--被删除的数据-->
                            <el-button-group v-if='scope.row.status==="deleted"'>
                                <el-button >查看</el-button>
                                <el-button >保留</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="small"
                                    @click.native=""
                                ></el-button>
                            </el-button-group>
                            <!--数据更新状态-->
                            <el-button-group v-else-if='scope.row.status==="update"'>
                                <el-button  size="small" @click="dialogOfAddedInfo=true">编辑</el-button>
                                <el-button  @click="saveSingleData(scope.row.index)" size="small">保存</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="small"
                                    @click.native=""
                                ></el-button>
                            </el-button-group>
                            <!--已保存数据状态-->
                            <el-button-group v-else-if='scope.row.status==="saved"'>
                                <el-button size="small" @click="showDialogOfSavedData(scope.row.data)">查看</el-button>
                            </el-button-group>
                            <!--新增数据相关操作-->
                            <el-button-group v-else-if='scope.row.status==="new"' >
                                <el-button  @click="showDialogOfNewData(scope.row.data,scope.row.index)" size="small">编辑</el-button>
                                <el-button  @click="saveSingleData(scope.row.index)" size="small">保存</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="small"
                                    @click.native="del(scope.row.index)"
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
        name: "GeneralUpdatedResults",
        data: function () {
            return {
                // 保存的数据
                storeData: [],
                detailedData: {},    //详细信息
                modifyingRowIndex: null, //正在编辑的行序号
                // 对话框
                dialogOfNewData: false,      // 数据更新状态信息
                dialogOfSavedData:false,  // 已保存数据库的状态信息
                // 分页控制
                pageNum: 1,
                pageSize: 20,
                totalSize: 0,
                // 加载状态控制
                listLoading: false,     // 列表加载状态
                submitModificationLoading: false,    // 提交修改按钮加载状态
                // 页面设置
                listSetting: {},     // 信息列表设置，包含key和对应的中文名
                detailedSetting: {},   // 详细信息设置，包含key，中文名以及是否可编辑
                editableSetting: {},     // 可编辑的信息设置
                idSetting: {},   // 列表信息id的设置，包括id的key和类型（int与str）
                pageName: null,   // 页面名称
                existUpdatedResults: false,  // 是否存在更新结果

            }
        },
        components: {
            AsideMenu,
        },
        computed: {},
        methods: {
            // 弹出展示新增数据详细信息对话框
            showDialogOfNewData: function (rowData, rowIndex) {
                this.detailedData = JSON.parse(JSON.stringify(rowData));
                this.modifyingRowIndex = rowIndex;
                this.dialogOfNewData = true;
            },
            // 弹出saved数据详细信息对话框
            showDialogOfSavedData:function(rowData){
                this.detailedData = JSON.parse(JSON.stringify(rowData));
                this.dialogOfSavedData=true;
            },
            // 提交修改后的更新信息
            submitModification: function () {
                this.submitModificationLoading = true;
                // 保存修改的数据的序号
                let tempIndex = this.modifyingRowIndex - 1;
                let tempData = {};
                for (let key in this.detailedData) {
                    tempData[key] = this.detailedData[key].newValue;
                }
                this.axios.post(this.apiUrl + '/upgrade/modify/' + this.$route.params.tableId + '?index=' + tempIndex, tempData)
                    .then(
                        (res) => {
                            if (res.status === 200) {
                                if (res.data === true) {
                                    this.$notify({
                                        title: '成功',
                                        message: '修改信息成功',
                                        type: 'success',
                                        duration: 4000
                                    });
                                    // 修改前端数据
                                    this.storeData[tempIndex - (this.pageNum - 1) * this.pageSize].data = this.detailedData;
                                    this.submitModificationLoading = false;
                                    this.dialogOfNewData = false;
                                }
                                else {      // 修改更新信息失败
                                    this.$notify({
                                        title: '失败',
                                        message: '修改信息失败',
                                        type: 'error',
                                        duration: 4000
                                    });
                                    this.submitModificationLoading = false;
                                }
                            }
                            else {
                                this.$message.error('网络异常，请重新尝试');
                                this.submitModificationLoading = false;
                            }
                        }
                    ).catch(
                    (error) => {
                        console.log(error);
                        this.$message.error('网络异常，请重新尝试');
                        this.submitModificationLoading = false;
                    });
            },
            // 保存单条更新信息
            saveSingleData: function (rowIndex) {
                this.$confirm('确认保存该条信息吗？, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    let tempIndex = rowIndex - 1;
                    let requestUrl = this.apiUrl + '/upgradeSave/' +this.$route.params.tableId+
                        '?index=' + tempIndex + '&flag=' + (this.idSetting.isDigit === 'true' ? 1 : 2);
                    this.axios.get(requestUrl)
                        .then(
                            (res) => {
                                if (res.data === true) {
                                    this.$message({
                                        type: 'success',
                                        message: '保存成功!'
                                    });
                                    // 更改为保存状态
                                    this.$set(this.storeData[tempIndex - (this.pageNum - 1) * this.pageSize],'status','saved');
                                }
                                else {
                                    this.$message.error('网络异常，请重新尝试');
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
            // 删除更新信息
            del: function (rowIndex) {
                this.$confirm('此操作将删除该条更新信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tempIndex = rowIndex - 1;
                    let requestUrl = this.apiUrl + '/upgrade/delete/' + this.$route.params.tableId + '?index=' + tempIndex;
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
                                    this.storeData.splice(tempIndex - (this.pageNum - 1) * this.pageSize, 1);
                                }
                                else {
                                    this.$message.error('网络异常，请重新加载');
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
            // 点击页数触发事件
            handelCurrentChange: function (val) {
                this.pageNum = val;
                this.pageJumping();
            },
            // 页面跳转请求
            pageJumping: function () {
                this.listLoading = true;
                this.axios.get(this.apiUrl + '/upgrade/' + this.$route.params.tableId + '?page=' + this.pageNum + '&size=' + this.pageSize)
                    .then(
                        (res) => {
                            if (res.status === 200) {
                                if (res.data !== "") {        // 返回值不为空，存在更新结果
                                    // 总页数配置
                                    this.totalSize = res.data.pop().totalCount;
                                    // 保存的数据
                                    this.storeData = res.data;
                                    // 为每一条数据添加序号，从1开始
                                    for (let i = 0; i < this.storeData.length; ++i) {
                                        this.storeData[i]['index'] = (this.pageNum - 1) * this.pageSize + (i + 1);
                                    }
                                    // 取消页面加载转态
                                    this.listLoading = false;
                                    window.location.href = '#top';
                                }
                                else {
                                    this.listLoading = false;
                                    this.existUpdatedResults = true;
                                }
                            }
                            else {
                                this.$message.error('网络异常，请重新加载');
                                this.listLoading = false;
                            }
                        }
                    ).catch(
                    (error) => {
                        console.log(error);
                        this.$message.error('网络异常，请重新加载');
                        this.listLoading = false;
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
                                // 页面名字
                                this.pageName = pageSettingInfo.pageName;
                                // 列表展示信息配置
                                this.listSetting = JSON.parse(pageSettingInfo.show);
                                // 删除修改时间字段
                                for (var key in this.listSetting) {
                                    if (key === 'MODIFY_TIME') {
                                        delete this.listSetting[key];
                                        break
                                    }
                                }
                                // 详细信息配置
                                this.detailedSetting = JSON.parse(pageSettingInfo.all);
                                // 删除修改时间字段
                                for (var key in this.detailedSetting) {
                                    if (key === 'MODIFY_TIME') {
                                        delete this.detailedSetting[key];
                                        break
                                    }
                                }
                                // 可编辑信息配置
                                Object.keys(this.detailedSetting).forEach(
                                    (key) => {
                                        if (this.detailedSetting[key].modify === 'true') {
                                            this.editableSetting[key] = this.detailedSetting[key];
                                        }
                                    });
                                // id设置
                                this.idSetting = JSON.parse(pageSettingInfo.index);
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
            statusFilter: function (value, row) {
                return row.status === value
            },
        },
        created: function () {
            this.getPageSetting();
        },
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
