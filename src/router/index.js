import Vue from 'vue'
import Router from 'vue-router'
import LibraryList from '@/components/LibraryList'
import AdminIndex from '@/components/AdminIndex'
import AcaOfSciAdmin from '@/components/AcaOfSciAdmin'
import AcaOfEngAdmin from '@/components/AcaOfEngAdmin'
import GeneralAdmin from '@/components/GeneralAdmin'


Vue.use(Router)

export default new Router({
    mode:'history',
    routes: [
        {
            path: '/',
            name: 'LibraryList',
            component: LibraryList
        },
        {
            path: '/admin',
            name: 'AdminIndex',
            component: AdminIndex,
            children:[
                {
                    path:'acaofsci',
                    component: AcaOfSciAdmin
                },
                {
                    path:'acaofeng',
                    component:AcaOfEngAdmin
                },
            ]
        },
        {
            path:'/admin/:tableId',
            name:'GeneralAdmin',
            component:GeneralAdmin
        }

    ]
})
