<template>
	<div>
 
  <pre>
<code id="userInfo">
  <a v-if="auth" v-bind:href="'/user/'+uid">
  <span v-if="pagelogin" >See this user</span>
  <span v-else>"Hi I'm {{ username }}"</span>
</a>
   {{userInfo}}
   <button @click="logout">Logout</button>
 </code>
</pre>
<div id="recaptcha-container"></div>
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

function getProvider(providerId) {
  switch (providerId) {
    case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
      return new firebase.auth.GoogleAuthProvider();
    case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
      return new firebase.auth.FacebookAuthProvider();
    case firebase.auth.GithubAuthProvider.PROVIDER_ID:
      return new firebase.auth.GithubAuthProvider();
    default:
      throw new Error(`No provider implemented for ${providerId}`);
  }
}

const supportedPopupSignInMethods = [
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  firebase.auth.GithubAuthProvider.PROVIDER_ID,
];

async function oauthLogin(provider) {
  return new Promise( (resolve, reject) => {
  console.log("+++++++++++++++++",provider);
  try {
     firebase.auth().signInWithPopup(provider);
  //  var google = new firebase.auth.GoogleAuthProvider();
//firebase.auth().signInWithPopup(google);
  } catch (err) {
     console.log(err);
    if (err.email && err.credential && err.code === 'auth/account-exists-with-different-credential') {
      
      const providers =  firebase.auth().fetchSignInMethodsForEmail(err.email)
      const firstPopupProviderMethod = providers.find(p => supportedPopupSignInMethods.includes(p));

      // Test: Could this happen with email link then trying social provider?
      if (!firstPopupProviderMethod) {
        throw new Error(`Your account is linked to a provider that isn't supported.`);
      }

      const linkedProvider = getProvider(firstPopupProviderMethod);
      linkedProvider.setCustomParameters({ login_hint: err.email });

      const result =  firebase.auth().signInWithPopup(linkedProvider);
      result.user.linkWithCredential(err.credential);
    }
      return reject(err);
    // Handle errors...
    // toast.error(err.message || err.toString());
  }
   })
}
































 const authNewGoogleUser = ({ email, idToken, accessToken }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth = firebase.auth()
        let result = await auth.currentUser

       // const tokenResult = await firebase.auth().instance.currentUser();
const token = await firebase.auth().currentUser.getIdToken( true)

        // check registered auth provider.
        //const provider = await auth.fetchSignInMethodsForEmail(email);
        const provider = new firebase.auth.FacebookAuthProvider();
          console.log("provider: ",provider);
          oauthLogin(provider)
        // try signin/link with 'google.com' provider

        /*if (!provider.includes('google.com')) {
          result = await linkWithGoogle(token, accessToken)
        }

        // try linking with 'email' provider if doesn't linked yet

        if (!provider.includes('password')) {
         // const securePassword = await generateSecurePassword(48)
          //result = await linkWithEmail(email, securePassword)
        }

        return resolve(result)
        */
      } catch (err) {
        return reject(err)
      }
    })
  }

/*  const linkWithGoogle = (idToken, accessToken) => {
    return new Promise(async (resolve, reject) => {
      try {
        // setting up 'google.com' provider credential to be used.
        const googleCredential = await firebase.auth.GoogleAuthProvider.credential(
          idToken,
          accessToken
        )
        const result = await linkWithCredential(googleCredential)

        return resolve(result)
      } catch (err) {
        return reject(err)
      }
    })
  } 
*/
/*  const linkWithCredential = credential => {
    return new Promise(
      async (resolve, reject) => {
      try {
        const result = await firebase.auth().currentUser.linkWithCredential(credential)
console.log("IsLinked: ",result)
     //   const newCredential = result.user.providerData[0]
      //  console.log("newCredential: ",newCredential)
        await updateProfile({
          displayName: newCredential.displayName,
          phoneNumber: newCredential.phoneNumber,
          photoURL: newCredential.photoURL,
        })

        return resolve(result)
      } catch (err) {
        return reject(err)
      }
    }
    )
  }*/
 const linkWithCredential = async credential => {
 const result = await firebase.auth().currentUser.linkWithCredential(credential)
console.log("IsLinked: ",result)
     //   const newCredential = result.user.providerData[0]
      //  console.log("newCredential: ",newCredential)
       /* await updateProfile({
          displayName: newCredential.displayName,
          phoneNumber: newCredential.phoneNumber,
          photoURL: newCredential.photoURL,
        })*/

 }
 async function linking(email){
   const emailCredential  = await firebase.auth.EmailAuthProvider.credential(email,'12345678');
  // console.log(emailCredential );
  const result = await linkWithCredential(emailCredential)
        console.log(result)
       // console.log("newCredential: ",newCredential)
} 


    /*  const MyUserDataRepo = function() {};

MyUserDataRepo.prototype.get = function(user) {
  // TODO(you): How you implement this is specific to your application!
  return {};
};*/

  console.log(this.User);
  const proxy1 = new Proxy(this.User, {});
  console.log({...proxy1});
   console.log({...proxy1}.displayName);
   this.username={...proxy1}.displayName;
  var user;
if (firebase.auth().currentUser) {
   //user=firebase.auth().currentUser.ac;
    user=firebase.auth().currentUser;
            if(this.fromLogin!=1){
              this.pagelogin=false;
              if(this.$route.params.uid!=user.uid)
              window.location.assign("/user/"+user.uid)
            }

          this.auth=true;
          this.uid=user.uid;
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

/*
document.querySelector('body').appendChild(document.createElement('div'));

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  this._shadowHelper,
  {
    size: 'invisible',
    callback: () => this._recaptchaReady = true,
  },
);
window.recaptchaWidgetId = await window.recaptchaVerifier.render();

//grecaptcha.reset(window.recaptchaWidgetId);
//or

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
          'size': 'normal',
          'callback': function(response) {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log('reCAPTCHA solved');
            //updateSignInButtonUI();
          },
          'expired-callback': function() {
            // Response expired. Ask user to solve reCAPTCHA again.
            console.log('Response expired');
            //updateSignInButtonUI();
          }
        });

        recaptchaVerifier.render().then(function(widgetId) {
          window.recaptchaWidgetId = widgetId;
        });
*/
/*function submitPhoneNumberAuth() {
   firebase.auth().signInWithPhoneNumber('+213699007222', window.recaptchaVerifier).then(function (confirmationResult) {
      // confirmationResult can resolve with the fictional testVerificationCode above.
      console.log( 'confirmationResult.confirm(testVerificationCode)');
var credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code);
          }).catch(function (error) {
      console.log('Error; SMS not sent',error);
      //  ...
    });
}
//firebase.auth().settings.appVerificationDisabledForTesting = true;
const elem=document.createElement('div');
elem.setAttribute("id", "recaptcha-container");
document.querySelector('body').appendChild(elem);

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(elem,
  {
    size: 'invisible',
    callback: function(response) {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log('reCAPTCHA solved',response);
            console.log(window.recaptchaVerifier);
          
           //submitPhoneNumberAuth();
          },
          'expired-callback': function() {
            // Response expired. Ask user to solve reCAPTCHA again.
            console.log('Response expired');
            //updateSignInButtonUI();
          }
  },
);
//
console.log(window.recaptchaVerifier);
*/
/*recaptchaVerifier.render().then(function(widgetId) {
          window.recaptchaWidgetId = widgetId;
        });
//recaptchaVerifier.verify();
setTimeout(function(){
//submitPhoneNumberAuth();
recaptchaVerifier.verify();

}, 3000);
*/
//submitPhoneNumberAuth();



   /////////console.log(firebase.auth().fetchSignInMethodsForEmail( this.userInfo.email));

 /*  firebase.auth().fetchSignInMethodsForEmail(this.userInfo.email).then((providers) => {
                console.log('providers:', providers);
                
              });
*/
/*const provider = new firebase.auth.FacebookAuthProvider();
          console.log("provider: ",provider);
          oauthLogin(provider);*/

////linking(user.email)
//console.log(firebase.auth().fetchSignInMethodsForEmail(user.email));
        //     authNewGoogleUser ({ email:this.userInfo.email, idToken:user.uid, accessToken:user.refreshToken });

/* 
              
var credentialGoogle = firebase.auth.GoogleAuthProvider.credential(user.uid, user.refreshToken);
console.log(credentialGoogle);
var providerGoogle = new firebase.auth.GoogleAuthProvider();
console.log(providerGoogle);
var credentialGoogle2 = firebase.auth.GoogleAuthProvider.credential(user.uid);
console.log(providerGoogle);
console.log(firebase.auth());
              console.log(firebase.auth().currentUser);
               console.log(JSON.stringify(this.userInfo, null, '  '));
  var userr = firebase.auth().currentUser;
var credentials = firebase.auth.EmailAuthProvider.credential(
  userr.email,
  'yourpassword'
);
console.log(credentials)


  var repo = new MyUserDataRepo();

  // Get reference to the currently signed-in user
  var prevUser = firebase.auth().currentUser;

  // Get the data which you will want to merge. This should be done now
  // while the app is still signed in as this user.
  var prevUserData = repo.get(prevUser);

*/



///user.reauthenticateWithCredential(credentials);

 

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
div#recaptcha-container {
    background: red;
    height: 60px;
}
</style>