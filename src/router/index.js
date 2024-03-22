import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')

// import Cate from '../components/games/Cate.vue'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/games/Cate.vue')
// import GameList from '../components/games/GameList.vue'
const GameList = () => import(/* webpackChunkName: "Cate_Params" */ '../components/games/GameList.vue')
// import AddGame from '../components/games/Addgame.vue'
const AddGame = () => import(/* webpackChunkName: "Cate_Params" */ '../components/games/Addgame.vue')

// import HomePage from '../views/HomePage.vue'
const HomePage = () => import(/* webpackChunkName: "HomePage" */ '../views/HomePage.vue')
// import UserHomePage from '../views/UserHomePage.vue'
const UserHomePage = () => import(/* webpackChunkName: "HomePage" */ '../views/UserHomePage.vue')
// import UserProfile from '../views/UserProfile.vue'
const UserProfile = () => import(/* webpackChunkName: "HomePage" */ '../views/UserProfile.vue')
// import DetailPage from '../views/DetailPage.vue'
const DetailPage = () => import(/* webpackChunkName: "HomePage" */ '../views/DetailPage.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/userslist', component: Users },
      { path: '/rights', component: Rights },
      { path: '/informationclass', component: Cate },
      { path: '/informationlist', component: GameList },
      { path: '/informationlist/add', component: AddGame }
    ]
  },
  {
    path: '/homepage',
    component: HomePage,
    redirect: '/userhomepage',
    children: [
      { path: '/userhomepage', component: UserHomePage },
      { path: '/userprofile', component: UserProfile }
    ]
  },
  { path: '/detail', name: 'detail', component: DetailPage }
]

const router = new VueRouter({
  // mode: 'hash',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
