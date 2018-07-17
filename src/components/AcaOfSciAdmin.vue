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

        <el-dialog title="专家信息" :visible.sync="dialogOfInfo">
            <el-form :model="detailedData">
                <el-form-item label="专家姓名" label-width="120px">
                    <el-input v-model="detailedData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="当选时间" label-width="120px">
                    <el-input type="textarea" autosize v-model="detailedData.evaluateTime" auto-complete="off"></el-input>
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
                <el-button type="primary" @click="saveInfo()">保 存</el-button>
            </div>
        </el-dialog>

        <el-main>
            <!--添加新数据按钮-->
            <el-row style="text-align: left; margin-bottom: 10px;">
                <el-button type="primary" icon="el-icon-plus" circle @click="edit({})"></el-button>
            </el-row>
            <el-table border
                      highlight-current-row
                      v-loading="listLoading"
                      element-loading-text="拼命加载中..."
                      :data="displayData">
                <el-table-column label="姓名" width="80" prop="name">
                </el-table-column>
                <el-table-column label="当选时间" width="100" prop="evaluateTime">
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
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button
                            size="medium"
                            @click="edit(scope.row)">编辑</el-button>
                        <el-button
                            size="medium"
                            type="danger"
                            icon="el-icon-delete"
                            ></el-button>
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
                // 控制显示详细信息的对话框
                dialogOfInfo:false,
                // 控制显示更新配置的对话框
                dialogOfConfig:false,
                // 院士详细信息
                detailedData:{},
                // 更新配置
                updatingConfig:{
                    url:'http://www.casad.cas.cn/chnl/371/index.html'
                },
                listLoading:false
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
            },
            edit:function(rowData){
                this.dialogOfInfo=true;
                // 拷贝
                this.detailedData=Object.assign({}, rowData)
            },
            saveInfo:function(){
                console.log(this.detailedData)
            },
            saveConfig:function () {
                this.dialogOfConfig=false;
                this.$notify({
                    title: '成功',
                    message: '成功保存配置信息',
                    type: 'success',
                    duration: 4000
                });
            }
        },
        created:function () {
            this.listLoading=true;
            this.axios.get('http://0990581d.ngrok.io/academician/getAll')
                .then(
                    (res)=>{
                        if (res.status===200){
                            this.storeData=res.data;
                            this.listLoading=false;
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
    .p1{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
</style>
