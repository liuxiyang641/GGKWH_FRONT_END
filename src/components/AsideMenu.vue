<template>
    <el-aside width="200px">
        <el-menu background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :default-active="idToIndex[(this.$route.params.tableId).toString()]">
            <el-menu-item index="1" @click='jumpTo("/admin/42")'>
                <p>中国科学院院士</p>
            </el-menu-item>
            <el-menu-item index="2" @click='jumpTo("/admin/43")'>
                <p>中国工程院院士</p>
            </el-menu-item>
            <el-menu-item index="3" @click='jumpTo("/admin/18")'>
                <p>长江学者</p>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script>
    export default {
        name: "AsideMenu",
        data:function(){
            return{
                activeIndex:'0',
                idToIndex:{
                    '42':'1',
                    '43':'2',
                    '18':'3',
                },
            }
        },
        methods:{
            jumpTo:function (linkStr) {
                window.location.href=linkStr;
            },
        },
    }
</script>

<style scoped>
    .el-aside {
        background-color: #545c64;
    }

    .el-menu {
        text-align: center;
    }

    .el-menu-item:hover {
        color: #ffd04b;
    }

    a {
        color: #fff;
        text-decoration: none;
    }

    p:hover {
        color: #ffd04b;
    }
</style>
