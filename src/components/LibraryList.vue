<template>
    <el-container>
        <el-main>
            <el-table
                :data="pageData"
                style="width: 30%;"
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
                            @click="jumpTo(scope.row.name)">管理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                :total="this.tableData.length"
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
            }
        },
        computed:{
            pageData:function () {
                return this.tableData.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize);
            }
        },
        methods:{
            jumpTo:function (name) {
                switch (name){
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
                    default: //默认跳转到中科院院士列表
                        window.location.href='/admin/acaofsci';
                        break;
                }
            },
            handelCurrentChange(val){
                this.pageNum=val
            }
        },
        created:function () {
            this.axios.get('http://2d310e3f.ngrok.io/getAll',
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            ).then(
                res=>{
                    if (res.status===200){
                        this.tableData=res.data
                    }
                }
            ).catch(function (error) {
                console.log(error);
            })
        }
    }
</script>

<style scoped>
.el-container{
}
</style>
