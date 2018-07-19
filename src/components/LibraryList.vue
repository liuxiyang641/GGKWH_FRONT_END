<template>
    <el-container>
        <el-main>
            <!--公共库列表-->
            <el-table
                :data="tableData"
                style="width: 30%;"
                highlight-current-row
                v-loading="listLoading"
                element-loading-text="拼命加载中..."
                border>
                <el-table-column
                    prop="chineseName"
                    label="公共库名称"
                    style="width: fit-content">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="medium"
                            @click="jumpTo(scope.row)">管理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
                background
                layout="prev, pager, next"
                :total="49"
                :current-page="this.pageNum"
                @current-change="handelCurrentChange">
            </el-pagination>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "LibraryList",
        data:function () {
            return {
                tableData:[],
                pageNum:1,
                pageSize:10,
                listLoading:true
            }
        },
        computed:{
        },
        methods:{
            jumpTo:function (row) {
                switch (row.name){
                    // 长江学者
                    case 'GG_ZJ_CJ':
                        window.location.href='/admin/';
                        break;
                    //    中科院院士
                    case 'GG_ZJ_KXYYS':
                        window.location.href='/admin/acaofsci';
                        break;
                    //    工程院院士
                    case 'GG_ZJ_GCYYS':
                        window.location.href='/admin/acaofsci';
                        break;
                    default: //默认跳转到长江学者列表
                        window.location.href='/admin/18';
                        break;
                }
            },
            handelCurrentChange(val){
                this.pageNum=val;
                this.pageJumping();
            },
            pageJumping:function(){
                this.listLoading=true;
                this.axios.get(this.apiUrl+'/getAll?page='+this.pageNum+'&size='+this.pageSize,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                ).then(
                    res=>{
                        if (res.status===200){
                            this.tableData=res.data;
                            this.listLoading=false;
                        }
                    }
                ).catch(function (error) {
                    console.log(error);
                });
            }
        },
        created:function () {
            this.pageJumping();
        }
    }
</script>

<style scoped>
.el-container{
}
</style>
