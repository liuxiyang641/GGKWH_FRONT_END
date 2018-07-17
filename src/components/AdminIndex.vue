<template>
    <el-container style="border: 1px solid #eee">
        <el-aside width="200px">
            <el-menu background-color="#545c64"
                     text-color="#fff"
                     active-text-color="#ffd04b">
                <el-menu-item index="1">
                    <a href="acaofsci">中国科学院院士</a>
                </el-menu-item>
                <el-menu-item index="2">
                    <a href="acaofeng">中国工程院院士</a>
                </el-menu-item>
                <el-menu-item index="3">
                    <a>长江学者</a>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <router-view></router-view>
    </el-container>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "AdminIndex"
    }
</script>

<style scoped>
    .el-aside {
        background-color: #545c64;
    }
    .el-menu{
        text-align: center;
    }
    a{
        color: #fff;
        text-decoration: none;
    }
    a:hover{
        color: #ffd04b;
    }
</style>
