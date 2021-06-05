<template>
  <div>
  <div v-if="!auth">
    
  <div id="firebaseui-container"></div>
  <p v-if="showError" id="error">Error</p>
  </div>
  <div v-else>
  <User fromLogin="1" />
 </div>
</div>
</template>

<script>
import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { mapActions } from "vuex";
 import User from './User'
 window.withSameEmail=false;//withSameEmail
console.log(typeof process.env.VUE_APP_WITH_SAME_EMAIL, process.env.VUE_APP_WITH_SAME_EMAIL)
export default {
  name: "Login",
  components:{
    User
  },
    data () {
      return {
        auth:false,
        uid:""
      }
    },
    mounted() {
   
firebase.auth().settings.appVerificationDisabledForTesting = true;

//firebase.auth().signOut();
   
   
   
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }

    const uiConfig = {

      requireExisting: true,
      signInOptions: [
        {
          provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          scopes: ["email"],
        },
        
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          scopes: ["email"],
          customParameters: {
            // Forces password re-entry.
            auth_type: "reauthenticate",
          },
        } ,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        {
          provider:firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          defaultCountry: 'DZ'
        },
      ],
      callbacks: {
        signInSuccessWithAuthResult: this.callThis,
      },
      //signInSuccessUrl: '/profile',
    };
    ui.start("#firebaseui-container", uiConfig);
  },
    methods: {
    ...mapActions(["Register","LogOut"]),
      logout(e){
         e.preventDefault(); 
            firebase.auth().signOut().then(() => {
             this.LogOut(); 
        this.$router.go("/login");
            });
         },
        

async callThis(a) {

   const providerInArray= (providerData,providerId)=>{
  var bol=false,i=0;
  while(!bol&&providerData[i]){
    if(providerData[i].providerId==providerId){
      bol=true
    }
    else
      i++;
   

  } 
  return bol;
}

const linkWithPopup=async (provider_)=>{
  await user.linkWithPopup(provider_)
          .then(function (result) {
            //var token = result.credential.accessToken;
            //window.callAndLinkedFromPhone=true;
            var user2 = result.user;
            console.log(` user`, user2);
           // return;
         //   if(!user.isEmailLinked&&user2.providerData[0].email)
         //   return emailLinking(user2,user2.providerData[0].email);
        
          }).catch(function (error) {
            console.log(error);
           // if(bol&&error.credential)
           //  return mergeAuthsPhoneUser(user,error.credential)
          
          });  
}
    const mergeAuths= async (deleteUser,main_credential,resultCredential,bol) => {
return deleteUser.delete().then(function() {
  console.log("User deleted.")

//if(main_credential){// check if not call from phone
       return firebase.auth().signInWithCredential(main_credential).then(function(result) {
         return result.user.linkWithCredential(resultCredential)
  .then((usercred) => {
   // if(bol) window.callAndLinkedFromPhone=true;
    var user = usercred.user;
    console.log("the account successfully linked", user);
  }).catch((error) => {
    console.log("Error linking account", error);
  });
         
        }).catch(function(error) {
          console.log("Sign In Error", error);
        });
   //   }else return;
/***********/

}).catch(function(error) {
  console.log("An error happened.",error)
});
    }
const mergeAuthsPhoneUser = async (phoneUser,error_credential) => {
   

     await firebase.auth().signInWithPhoneNumber(phoneUser.phoneNumber, window.recaptchaVerifier).then(function (confirmationResult) {
      // confirmationResult can resolve with the fictional testVerificationCode above.
        var code = prompt("Once you receive the verification code, enter it here to confirm your identity.");

if (code != null) {
   

const credentialPhone = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code);
        //(deleteUser,main_credential,resultCredential)
return mergeAuths(phoneUser,error_credential,credentialPhone,true);


}
          }).catch(function (error) {
      console.log('Error; SMS not sent',error);
      //  ...
    });
        
    }
    const userSignOut = async (user_isCredentiel) => {
      console.log("start signOut")
await firebase.auth().signOut().then(function() {
  console.log("User signOut.")
return firebase.auth().signInWithCredential(user_isCredentiel).then(function() {
        
         console.log("Reauthenticate ");
         //return;
        }).catch(function(error) {
          console.log("Sign In Error", error);
        });


}).catch(function(error) {
  console.log("An error happened.",error)
});
    }

      const linking = async (user, provider_,bol) => {
 provider_.addScope('email');
        const testbol=true;
      //  if (user.isCredentiel||(user.isNewUser&&bol)) {




//var whoFunc=user.isCredentiel?firebase.auth().signInWithPopup:firebase.auth().linkWithPopup;

await firebase.auth().signInWithPopup(provider_)
      .then(async function(result) {
        // Successful sign-in.
        console.log(result);
      var deleteUser=result.user,
      main_credential=user.isCredentiel,
      resultCredential=result.credential;
      if(!window.withSameEmail) {
if (bol) {
  
    if(user.isNewUser&&user.providerData.length==1){
      deleteUser=user;
      
            const elem = document.createElement("DIV");   
            elem.setAttribute('id','verifyPhone')                   // Insert 
document.body.appendChild(elem); 
 window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    'verifyPhone',  {
      'size': 'invisible',  
    });
 //recaptchaVerifier.render();
            await mergeAuthsPhoneUser(deleteUser,result.credential);
          console.log('finich of mergeAuthsPhoneUser');
            
    }
  

}else if(result.additionalUserInfo.isNewUser)
              {console.log("mergeAuths");
                console.log(result,result.additionalUserInfo.isNewUser);
                await mergeAuths(deleteUser,main_credential,resultCredential);
              }else{
                console.log('----userSignOut');
              await userSignOut(user.isCredentiel);
      } 
    }
      else if(result.additionalUserInfo.isNewUser||user.isNewUser) 
         {
if(user.isNewUser&&!result.additionalUserInfo.isNewUser){
  deleteUser=user,
      main_credential=result.credential,
      resultCredential=user.isCredentiel;
}
        
        if(/*!window.withSameEmail||*/(/*window.withSameEmail&&*/user.isEmail==result.user.providerData[0].email))
        {
      // if(/*!user.isEmailLinked*/(window.withSameEmail&&user.isEmail==result.user.providerData[0].email))
         window.thisEmail=user.isEmail;
           //await emailLinking(user,result.user.providerData[0].email);
          console.log("--------------");
                    //(deleteUser,main_credential,resultCredential)
              await mergeAuths(deleteUser,main_credential,resultCredential);
        } else{
         
         // console.log(typeof result.additionalUserInfo.isNewUser,result.additionalUserInfo.isNewUser)
         /////// if(window.withSameEmail){
            console.log("Not the same email : "+user.isEmail+" != "+result.user.providerData[0].email);
          console.log("aaaa----delete");
          return deleteUser.delete().then(function() {
  console.log("User deleted.")
return firebase.auth().signInWithCredential(main_credential).then(function() {
        
         console.log("Reauthenticate ");
        }).catch(function(error) {
          console.log("Sign In Error", error);
        });


}).catch(function(error) {
  console.log("An error happened.",error)
});
 
////////}else {
   
/////// return userSignOut(user.isCredentiel); 
///////}

        }
        
} /*else if(user.isNewUser){

  if(!window.withSameEmail||(window.withSameEmail&&user.email==result.user.providerData[0].email)){

}
}*/else
await userSignOut(user.isCredentiel);

      }).catch(function (error) {
            console.log(error);
            alert(/*'errrrrrrrrrrrrror'*/error);
         /*   //if(bol)
             return mergeAuthsPhoneUser(user,error.credential)*/
          
          });







       /* }else{
           await user.linkWithPopup(provider_)
          .then(function (result) {
            //var token = result.credential.accessToken;
            var user2 = result.user;
            console.log(` user`, user2);
           // return;
         //   if(!user.isEmailLinked&&user2.providerData[0].email)
         //   return emailLinking(user2,user2.providerData[0].email);
        
          }).catch(function (error) {
            console.log(error);
           // if(bol&&error.credential)
           //  return mergeAuthsPhoneUser(user,error.credential)
          
          });
        }*/
     /* 
          
*/if (!testbol) {
console.log(typeof process.env.VUE_APP_WITH_SAME_EMAIL, process.env.VUE_APP_WITH_SAME_EMAIL)
if(process.env.VUE_APP_WITH_SAME_EMAIL=="true"&&!bol){// call from phone
 
     await firebase.auth().signInWithPopup(provider_)
      .then(async function(result) {
        // Successful sign-in.
        console.log(result);
       
if(result.additionalUserInfo.isNewUser) 
         {

        
        if(user.email==result.user.providerData[0].email)
        
       {
       if(!user.isEmailLinked)
            await emailLinking(user,result.user.providerData[0].email);
                      //(deleteUser,main_credential,resultCredential)
       await mergeAuths(result.user,user.isCredentiel,result.credential);
        } else{
          console.log("Not the same email : "+user.email+" != "+result.user.providerData[0].email);
          console.log(typeof result.additionalUserInfo.isNewUser,result.additionalUserInfo.isNewUser)
          
          console.log("aaaa----delete");
          return result.user.delete().then(function() {
  console.log("User deleted.")
return firebase.auth().signInWithCredential(user.isCredentiel).then(function() {
        
         console.log("Reauthenticate ");
        }).catch(function(error) {
          console.log("Sign In Error", error);
        });


}).catch(function(error) {
  console.log("An error happened.",error)
});
 

        }
        
} else 
await firebase.auth().signOut().then(function() {
  console.log("User signOut.")
return firebase.auth().signInWithCredential(user.isCredentiel).then(function() {
        
         console.log("Reauthenticate ");
        }).catch(function(error) {
          console.log("Sign In Error", error);
        });


}).catch(function(error) {
  console.log("An error happened.",error)
});
      }).catch(function (error) {
            console.log(error);
            alert(/*'errrrrrrrrrrrrror'*/error);
         /*   //if(bol)
             return mergeAuthsPhoneUser(user,error.credential)*/
          
          });
    }else 
{
  await user.linkWithPopup(provider_)
          .then(function (result) {
            //var token = result.credential.accessToken;
            var user2 = result.user;
            console.log(` user`, user2);
            if(!user.isEmailLinked&&user2.providerData[0].email)
            return emailLinking(user2,user2.providerData[0].email);
        
          }).catch(function (error) {
            console.log(error);
            if(bol&&error.credential)
             return mergeAuthsPhoneUser(user,error.credential)
          
          });
      
      }


    }
    };
      /*const switchLinking = async (user,providerId,bol) => {
        var provider_;
        if (
          providerId ==
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ) {
          provider_ = new firebase.auth.FacebookAuthProvider();
          await linking(user, provider_);
        } else if (
          providerId ==
          firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ) {
           provider_ = new firebase.auth.GoogleAuthProvider();
           linking(user, provider_);
        } else if (
          (!window.withSameEmail&&providerId ==
                     firebase.auth.PhoneAuthProvider.PROVIDER_ID) || providerId == firebase.auth.EmailAuthProvider.PROVIDER_ID
        ) {
           provider_ = new firebase.auth.GoogleAuthProvider();
          await linking(user, provider_,bol);
          provider_ = new firebase.auth.FacebookAuthProvider();
          await linking(user, provider_,bol);
        }
      };*/
      const emailLinking = async (user,_email) => {
        var provider_,providerId=user.isProviderId,bolPhone=providerId ==
                     firebase.auth.PhoneAuthProvider.PROVIDER_ID;
       
         
            if((!window.withSameEmail&&providerId ==
                     firebase.auth.PhoneAuthProvider.PROVIDER_ID)&&!window.withSameEmail&&user.providerData.length==1){
  if(!providerInArray(user.providerData,firebase.auth.FacebookAuthProvider.PROVIDER_ID))
await linkWithPopup(new firebase.auth.FacebookAuthProvider());
if(!providerInArray(user.providerData,firebase.auth.GoogleAuthProvider.PROVIDER_ID))
await linkWithPopup(new firebase.auth.GoogleAuthProvider());
}
          
          else if 
          ( providerId == firebase.auth.EmailAuthProvider.PROVIDER_ID
        ) {
           
             if(!providerInArray(user.providerData,firebase.auth.FacebookAuthProvider.PROVIDER_ID)){
          provider_ = new firebase.auth.FacebookAuthProvider();
          await linking(user, provider_);
        }
        if(!providerInArray(user.providerData,firebase.auth.GoogleAuthProvider.PROVIDER_ID)){
           provider_ = new firebase.auth.GoogleAuthProvider();
           await linking(user, provider_);
         }

           return;
        }else{

      //  if (!window.callAndLinkedFromPhone) 
          if(!providerInArray(user.providerData,firebase.auth.FacebookAuthProvider.PROVIDER_ID)){
          provider_ = new firebase.auth.FacebookAuthProvider();
          await linking(user, provider_,bolPhone);
        }
       // if (!window.callAndLinkedFromPhone) 
        if(!providerInArray(user.providerData,firebase.auth.GoogleAuthProvider.PROVIDER_ID)){
           provider_ = new firebase.auth.GoogleAuthProvider();
         await linking(user, provider_,bolPhone);
         }
       } 
        


 console.log(firebase.auth.EmailAuthProvider.PROVIDER_ID,providerInArray(user.providerData,firebase.auth.EmailAuthProvider.PROVIDER_ID))    
if(!providerInArray(user.providerData,firebase.auth.EmailAuthProvider.PROVIDER_ID)){
  if(!window.thisEmail&&window.withSameEmail){
    
            window.thisEmail=user.isEmail;
        
  }   
  if(!window.thisEmail&&!window.withSameEmail&&user.providerData.length==1&&user.isEmail) window.thisEmail=user.isEmail; // for add email to not same email
      if (window.thisEmail) {
  

  console.log("emmmmmmmmail");
  const emailCredential =
            await firebase.auth.EmailAuthProvider.credential(
              window.thisEmail,
              "12345678"
            );
          await firebase
            .auth()
            .currentUser.linkWithCredential(emailCredential).then((usercred) => {
            //  user.isEmailLinked=true;
    console.log("the account successfully linked with email", usercred);
  }).catch((error) => {
    console.log("Error linking account with email", error);
   /* if(error.code== "auth/email-already-in-use"){
      user.isEmailLinked=true;
     }*/
  });
      }
      }

console.log('fin');
return;
/*
       if(a.additionalUserInfo.isNewUser) 
        


        var email=user.providerData[0].email;
        if(_email)
          email=_email;
     
        
          
        if (email) {
        
         
const emailCredential =
            await firebase.auth.EmailAuthProvider.credential(
              email,
              "12345678"
            );
          await firebase
            .auth()
            .currentUser.linkWithCredential(emailCredential).then((usercred) => {
              user.isEmailLinked=true;
    console.log("the account successfully linked", usercred);
  }).catch((error) => {
    console.log("Error linking account with email", error);
  });
          if(!_email)
         await switchLinking(user);
        
          
        } else await switchLinking(user,true); //signin phone
     */
      };
      var user;

      if (firebase.auth().currentUser) {
       // user = firebase.auth().currentUser;
       user =  a.user ;
      user.isEmail= user.email?user.email:user.providerData[0].email;
      user.isProviderId=a.additionalUserInfo.providerId;
       user.isCredentiel=a.credential;
       user.isNewUser=a.additionalUserInfo.isNewUser;
        this.auth = true;
        this.uid = user.uid;
        this.userInfo = {
          displayName: user.displayName,
          email: user.isEmail,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          uid: user.uid,
          accessToken: user.accessToken,
          providerData: user.providerData,
        };

       await emailLinking(user);
    


            

  try {
        await this.Register(this.userInfo);
        this.showError = false
      } catch (error) {
        this.showError = true
      }

       }   
        }
     }
};
</script>
<style scoped>
#error {
  color: red;
}
</style>


