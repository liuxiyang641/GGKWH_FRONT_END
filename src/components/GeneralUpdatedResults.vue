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
            <!--新增数据详细信息对话框-->
            <el-dialog title="新增数据更新信息" :visible.sync="dialogOfAddedData">
                <!--保证this.detailedDatab不是一个空对象，否则在初始化绑定时会报错-->
                <el-form label-width="5rem" :model="detailedData" v-if='JSON.stringify(this.detailedData)!=="{}" '>
                    <el-form-item v-for="(value, key) in detailedSetting" :label='value.name+": " ' :key="key">
                        <el-input v-if='value.modify==="true" ' auto-complete="off" type="textarea" autosize v-model="detailedData[key].newValue"></el-input>
                        <span v-else>{{detailedData[key].newValue}}</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogOfAddedData = false">取 消</el-button>
                    <el-button type="primary" @click="">保 存</el-button>
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

            <el-main>
                <!--信息列表-->
                <p>共有{{totalSize}}条数据</p>
                <el-table border
                          highlight-current-row
                          v-loading="listLoading"
                          element-loading-text="拼命加载更新结果中..."
                          :data="storeData">
                    <!--编号-->
                    <el-table-column
                        label="编号"
                        type="index"
                        width="50">
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
                                     :filters="[{text:'被移除',value:'deleted'},{text:'新增',value:'new'},{text:'数据更新',value:'updated'},{text:'无更新',value:'kong'}]"
                                     :filter-method="statusFilter">
                        <template slot-scope="scope">
                            <el-tag v-if='scope.row.status==="deleted"' type='danger'>
                                被移除
                            </el-tag>
                            <el-tag v-else-if='scope.row.status==="updated"'>
                                数据更新
                            </el-tag>
                            <el-tag v-else-if='scope.row.status==="new"' type="success">
                                新增
                            </el-tag>
                            <el-tag v-else-if='scope.row.status==="kong"' type="info">
                                无更新
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!--被删除的数据-->
                            <el-button-group v-if='scope.row.status==="deleted"'>
                                <el-button size="medium">查看</el-button>
                                <el-button size="medium">保留</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click.native=""
                                    size="medium"
                                ></el-button>
                            </el-button-group>
                            <!--数据更新状态-->
                            <el-button-group v-else-if='scope.row.status==="updated"'>
                                <el-button size="medium" @click="dialogOfAddedInfo=true">编辑</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click.native=""
                                    size="medium"
                                ></el-button>
                            </el-button-group>
                            <!--无更新状态-->
                            <el-button-group v-else-if='scope.row.status==="kong"'>
                                <el-button size="medium">编辑</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click.native=""
                                    size="medium"
                                ></el-button>
                            </el-button-group>
                            <!--新增数据相关操作-->
                            <el-button-group v-else-if='scope.row.status==="new"'>
                                <el-button size="medium" @click="showDialogOfAdded(scope.row.data)">编辑</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    @click.native=""
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
        name: "GeneralUpdatedResults",
        data: function () {
            return {
                // 保存的数据
                storeData: [],
                detailedData: {},    //详细信息
                // 对话框
                dialogOfAddedData: false,      // 数据更新状态信息
                // 分页控制
                pageNum: 1,
                pageSize: 20,
                totalSize: 0,
                // 加载状态控制
                listLoading: false,     // 列表加载状态
                // 页面设置
                listSetting: {},     // 信息列表设置，包含key和对应的中文名
                detailedSetting: {},   // 详细信息设置，包含key，中文名以及是否可编辑
                editableSetting: {},     // 可编辑的信息设置
                idSetting: {},   // 列表信息id的设置，包括id的key和类型（int与str）
                pageName: null,   // 页面名称

            }
        },
        components: {
            AsideMenu,
        },
        computed: {},
        methods: {
            // 弹出展示新增数据详细信息对话框
            showDialogOfAdded: function (rowData) {
                this.detailedData = {};
                for (let key in rowData) {
                    this.detailedData[key] = Object.assign({}, rowData[key])
                }
                this.dialogOfAddedData = true;
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
                                // 总页数配置
                                this.totalSize = res.data.pop().totalCount;
                                // 保存的数据
                                this.storeData = res.data;
                                // 取消页面加载转态
                                this.listLoading = false;
                                window.location.href = '#top';
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
                                console.log(this.listSetting);
                                // 详细信息配置
                                this.detailedSetting = JSON.parse(pageSettingInfo.all);
                                console.log(this.detailedSetting);

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
