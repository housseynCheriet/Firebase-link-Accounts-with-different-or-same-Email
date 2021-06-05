//import {store} from '../store/store'
import {firebase} from '../firestore'

var firebaseAuth=firebase.auth();

export default (to, from, next) => {
//console.log(store);
//console.log(to);
  if (firebaseAuth.currentUser) {

  if(to.path=="/login")
 next('/')
     else
    next()
  } else if(to.path!="/login"){
    next('/login')
  }
  else {
    next()
  }
}
