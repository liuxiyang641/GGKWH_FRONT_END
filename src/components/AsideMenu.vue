<template>
    <el-aside width="200px">
        <el-menu background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">
            <el-menu-item index="1">
                <a href="/admin/42">中国科学院院士</a>
            </el-menu-item>
            <el-menu-item index="2">
                <a href="/admin/43">中国工程院院士</a>
            </el-menu-item>
            <el-menu-item index="3">
                <a href="/admin/18">长江学者</a>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>

<script>
    export default {
        name: "AsideMenu"
    }
</script>

<style scoped>
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
