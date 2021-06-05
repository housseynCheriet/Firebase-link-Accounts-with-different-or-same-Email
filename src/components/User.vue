<template>
	<div>
 
  <pre>
<code id="userInfo">
  <a v-if="auth" v-bind:href="'/user/'+uid">
  <span v-if="pagelogin" >See this user</span>
  <span v-else>"Hi I'm {{ username }}"</span>
</a>
   <div id="userInfoData">{{userInfo}}</div>
   <button @click="logout">Logout</button>
 </code>
</pre>
</div>
</template>

<script>
	import firebase from "firebase/app";
  import { mapGetters, mapActions } from "vuex";
 /* console.log(
    mapGetters()
    )*/
export default {
  name: "user",
  props:["fromLogin"],
    data () {
      return {
      auth:false,
        userInfo:"",
        uid:"",
        pagelogin:true,
        username: "",
      }
    },
  computed: {
    ...mapGetters({ User: "StateUser" }),

   /* ...mapState([
            'user',
        ])*/
  }
    ,
    created:  function (){


//  console.log('userInfo:',this.User);
  /* console.log(this.User);
  const proxy1 = new Proxy(this.User, {});
  console.log({...proxy1});
   console.log({...proxy1}.displayName);
   this.username={...proxy1}.displayName;*/
  var user;
if (firebase.auth().currentUser) {
   //user=firebase.auth().currentUser.ac;
    user=firebase.auth().currentUser;
            if(this.fromLogin!=1){
              this.pagelogin=false;
              if(this.$route.params.uid!=user.uid)
              window.location.assign("/user/"+user.uid)
            }
         //   this.userInfo=this.User;
        //    this.username= this.User?.displayName;
            this.auth=true;
          
user.isEmail= user.email?user.email:user.providerData[0].email;
          this.uid=user.uid;
   this.username= user.displayName;

             this.userInfo = {
                displayName: user.displayName,
                email: user.providerData[0].email,
                emailVerified: user.emailVerified,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                uid: user.uid,
                accessToken: user.refreshToken,
                providerData: user.providerData
              };


          } else {
            this.userInfo = "User is signed out.";
            
          }



    },
    methods: {
...mapActions(["LogOut"]),
      logout(e){
         e.preventDefault(); 
            firebase.auth().signOut().then(() => {
              this.LogOut(); 
        this.$router.go("/login");
            });
         },
         
}
};
</script>
<style  lang="scss" scoped>
	a {
    position: relative;
    top: -10px;
    background: blueviolet;
    padding: 10px;
    color: black;
    font-size: 1.6rem;
    font-weight: 700;
    border-radius: 10px;
}
button {
    background: red;
    font-size: 1.3rem;
}

</style>