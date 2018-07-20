<template>
    <el-container style="border: 1px solid #eee">
        <el-aside width="200px">
            <el-menu background-color="#545c64"
                     text-color="#fff"
                     active-text-color="#ffd04b">
                <el-menu-item index="1">
                    <a href="/admin/acaofsci">中国科学院院士</a>
                </el-menu-item>
                <el-menu-item index="2">
                    <a href="/admin/acaofeng">中国工程院院士</a>
                </el-menu-item>
                <el-menu-item index="3">
                    <a href="/admin/18">长江学者</a>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header>
                <el-row style="font-size: 20px">
                    <el-col :span="12">
                        <span>更新结果</span>
                    </el-col>
                    <el-col :span="12" style="text-align: right">
                        <el-button type="primary" round>保存更新结果</el-button>
                    </el-col>
                </el-row>
            </el-header>


            <el-main>
                <!--添加新专家按钮-->
                <el-row style="text-align: left; margin-bottom: 10px;">
                    <el-button type="primary" icon="el-icon-plus" circle @click=""></el-button>
                </el-row>
                <!--专家列表-->
                <p>共有 条数据</p>
                <el-table border
                          highlight-current-row
                          v-loading="listLoading"
                          element-loading-text="拼命加载中..."
                          :data="storeData"
                            >
                    <el-table-column label="数据" prop="nm">
                    </el-table-column>
                    <el-table-column label="状态"
                                     prop="status"
                        :filters="[{text:'成功',value:'success'},{text:'失败',value:'fail'}]"
                        :filter-method="testfilter">
                        <template slot-scope="scope">
                            <el-tag :type='scope.row.status==="success"? "primary" : "success" '>
                                {{scope.row.status}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!--编辑按钮-->
                            <el-button
                                size="medium"
                                @click="">编辑
                            </el-button>
                            <!--删除按钮-->
                            <el-button
                                size="medium"
                                type="danger"
                                icon="el-icon-delete"
                                @click.native=""
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
    </el-container>
</template>

<script>
    export default {
        name: "GeneralUpdatedResults",
        data: function () {
            return {
                // 保存的数据
                storeData: [
                    {
                        nm: '1',
                        status:'success'
                    },
                    {
                        nm: '2',
                        status:'fail'
                    },
                    {
                        nm: '1',
                        status:'success'
                    },
                    {
                        nm: '2',
                        status:'fail'
                    }
                ],
                // 分页控制
                pageNum: 1,
                pageSize: 20,
                totalSize: 0,
                // 加载状态控制
                listLoading: false,     // 列表加载状态
            }
        },
        methods: {
            // 点击页数触发时间
            handelCurrentChange(val) {
                this.pageNum = val;
            },
            testfilter:function (value, row) {
                return row.status===value
            }
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
