// //
// // /********************************自动导包 start********************************/
// // /********************************自动导包 end********************************/
// //
// import asyncRoute from './async-route'
// import user from './user'
// import comment from './comment'
// const allModules = import.meta.globEager('./*/index.ts')
// const modules = {} as any
// Object.keys(allModules).forEach((path) => {
//   const fileName = path.split('/')[1]
//   modules[fileName] = allModules[path][fileName] || allModules[path].default || allModules[path]
// })
// // // console.log(modules, 'vuex自动导包')
// //
// export default {
//   asyncRoute,
//   comment,
//   user
// }
