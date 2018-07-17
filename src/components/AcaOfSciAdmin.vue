<template>
    <el-container>
        <el-header>
            <span style="font-size: 20px">中国科学院院士列表</span>
        </el-header>

        <el-main>
            <el-table border
                      highlight-current-row
                      :data="displayData">
                <el-table-column label="姓名" width="80">
                    <template scope="scope">
                        <el-input v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="evaluateTime" label="当选时间" width="100">
                </el-table-column>
                <el-table-column prop="link" label="链接" width="120">
                </el-table-column>
                <el-table-column prop="introduce" label="介绍" width="800">
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button
                            size="medium"
                            >保存</el-button>
                        <el-button
                            size="medium"
                            >撤销</el-button>
                        <el-button
                            size="medium"
                            >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                :total="storeData.length"
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
        data:function () {
            return{
                storeData:[],
                pageNum:1,
                pageSize:20,
            }
        },
        computed:{
            displayData:function () {
                return this.storeData.slice((this.pageNum-1)*this.pageSize,this.pageNum*this.pageSize);
            }
        },
        methods:{
            handelCurrentChange(val){
                this.pageNum=val
            }
        },
        created:function () {
            this.axios.get('http://2d310e3f.ngrok.io/academician/getAll')
                .then(
                    (res)=>{
                        if (res.status===200){
                            this.storeData=res.data;
                        }
                    }
                )
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
</style>
