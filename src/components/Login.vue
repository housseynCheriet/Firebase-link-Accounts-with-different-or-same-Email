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
import {
  mapActions
}
from "vuex";
import User from './User'
window.withSameEmail = true; //withSameEmail
console.log(typeof process.env.VUE_APP_WITH_SAME_EMAIL, process.env.VUE_APP_WITH_SAME_EMAIL)
export default {
  name: "Login",
  components: {
    User
  },
  data() {
    return {
      auth: false,
      uid: ""
    }
  },
  mounted() {
    //firebase.auth().settings.appVerificationDisabledForTesting = true;
    //firebase.auth().signOut();
    let ui = firebaseui.auth.AuthUI.getInstance();
    if(!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    const uiConfig = {
      requireExisting: true,
      signInOptions: [{
          provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          scopes: ["email"],
        }, {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          scopes: ["email"],
          customParameters: {
            // Forces password re-entry.
            auth_type: "reauthenticate",
          },
        },
        firebase.auth.EmailAuthProvider.PROVIDER_ID, {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
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
  methods: {...mapActions(["Register", "LogOut"]),
      logout(e) {
        e.preventDefault();
        firebase.auth().signOut().then(() => {
          this.LogOut();
          this.$router.go("/login");
        });
      },
      async callThis(a) {
        const providerInArray = (providerData, providerId) => {
          var bol = false,
            i = 0;
          while(!bol && providerData[i]) {
            if(providerData[i].providerId == providerId) {
              bol = true
            } else i++;
          }
          return bol;
        }
        const linkWithPopup = async(provider_) => {
          await user.linkWithPopup(provider_).then(function(result) {
            var user2 = result.user;
            console.log(` user`, user2);
           }).catch(function(error) {
            console.log(error);
           });
        }
        const mergeAuths = async(deleteUser, main_credential, resultCredential) => {
          return deleteUser.delete().then(function() {
            console.log("User deleted.")
            return firebase.auth().signInWithCredential(main_credential).then(function(result) {
              return result.user.linkWithCredential(resultCredential).then((usercred) => {
                // if(bol) window.callAndLinkedFromPhone=true;
                var user = usercred.user;
                console.log("the account successfully linked", user);
              }).catch((error) => {
                console.log("Error linking account", error);
              });
            }).catch(function(error) {
              console.log("Sign In Error", error);
            });
          }).catch(function(error) {
            console.log("An error happened.", error)
          });
        }
        const mergeAuthsPhoneUser = async(phoneUser, error_credential) => {
          await firebase.auth().signInWithPhoneNumber(phoneUser.phoneNumber, window.recaptchaVerifier).then(function(confirmationResult) {
            var code = prompt("Once you receive the verification code, enter it here to confirm your identity.");
            if(code != null) {
              const credentialPhone = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code);
              //(deleteUser,main_credential,resultCredential)
              return mergeAuths(phoneUser, error_credential, credentialPhone);
            }
          }).catch(function(error) {
            console.log('Error; SMS not sent', error);
          });
        }
        const userSignOut = async(user_isCredentiel) => {
          console.log("start signOut")
          await firebase.auth().signOut().then(function() {
            console.log("User signOut.")
            return firebase.auth().signInWithCredential(user_isCredentiel).then(function() {
              console.log("Reauthenticate ");
            }).catch(function(error) {
              console.log("Sign In Error", error);
            });
          }).catch(function(error) {
            console.log("An error happened.", error)
          });
        }
        const linking = async(user, provider_, bol) => {
          provider_.addScope('email');
          await firebase.auth().signInWithPopup(provider_).then(async function(result) {
            // Successful sign-in.
            console.log(result);
            var deleteUser = result.user,
              main_credential = user.isCredentiel,
              resultCredential = result.credential;
            if(!window.withSameEmail) {
              if(bol) {
                if(user.isNewUser && user.providerData.length == 1) {
                  deleteUser = user;
                  const elem = document.createElement("DIV");
                  elem.setAttribute('id', 'verifyPhone') // Insert 
                  document.body.appendChild(elem);
                  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('verifyPhone', {
                    'size': 'invisible',
                  });
                  //recaptchaVerifier.render();
                  await mergeAuthsPhoneUser(deleteUser, result.credential);
                  console.log('finich of mergeAuthsPhoneUser');
                }
              } else if(result.additionalUserInfo.isNewUser) {
                console.log("mergeAuths");
                console.log(result, result.additionalUserInfo.isNewUser);
                await mergeAuths(deleteUser, main_credential, resultCredential);
              } else {
                console.log('----userSignOut');
                await userSignOut(user.isCredentiel);
              }
            } else if(result.additionalUserInfo.isNewUser || user.isNewUser) {
              if(user.isNewUser && !result.additionalUserInfo.isNewUser) {
                deleteUser = user,
                  main_credential = result.credential,
                  resultCredential = user.isCredentiel;
              }
              if(user.isEmail == result.user.providerData[0].email) {
                window.thisEmail = user.isEmail;
                //(deleteUser,main_credential,resultCredential)
                await mergeAuths(deleteUser, main_credential, resultCredential);
              } else {
                console.log("Not the same email : " + user.isEmail + " != " + result.user.providerData[0].email);
                return deleteUser.delete().then(function() {
                  console.log("User deleted.")
                  return firebase.auth().signInWithCredential(main_credential).then(function() {
                    console.log("Reauthenticate ");
                  }).catch(function(error) {
                    console.log("Sign In Error", error);
                  });
                }).catch(function(error) {
                  console.log("An error happened.", error)
                });
               
              }
            }
           
            else await userSignOut(user.isCredentiel);
          }).catch(function(error) {
            console.log(error);
            alert(  error);
            
          });
          
        };
        const emailLinking = async(user) => {
          var provider_, providerId = user.isProviderId,
            bolPhone = providerId == firebase.auth.PhoneAuthProvider.PROVIDER_ID;
          if((!window.withSameEmail && providerId == firebase.auth.PhoneAuthProvider.PROVIDER_ID) && !window.withSameEmail && user.providerData.length == 1) {
            if(!providerInArray(user.providerData, firebase.auth.FacebookAuthProvider.PROVIDER_ID)) await linkWithPopup(new firebase.auth.FacebookAuthProvider());
            if(!providerInArray(user.providerData, firebase.auth.GoogleAuthProvider.PROVIDER_ID)) await linkWithPopup(new firebase.auth.GoogleAuthProvider());
          } else if(providerId == firebase.auth.EmailAuthProvider.PROVIDER_ID) {
            if(!providerInArray(user.providerData, firebase.auth.FacebookAuthProvider.PROVIDER_ID)) {
              provider_ = new firebase.auth.FacebookAuthProvider();
              await linking(user, provider_);
            }
            if(!providerInArray(user.providerData, firebase.auth.GoogleAuthProvider.PROVIDER_ID)) {
              provider_ = new firebase.auth.GoogleAuthProvider();
              await linking(user, provider_);
            }
            return;
          } else {
            if(!providerInArray(user.providerData, firebase.auth.FacebookAuthProvider.PROVIDER_ID)) {
              provider_ = new firebase.auth.FacebookAuthProvider();
              await linking(user, provider_, bolPhone);
            }
            if(!providerInArray(user.providerData, firebase.auth.GoogleAuthProvider.PROVIDER_ID)) {
              provider_ = new firebase.auth.GoogleAuthProvider();
              await linking(user, provider_, bolPhone);
            }
          }
          console.log(firebase.auth.EmailAuthProvider.PROVIDER_ID, providerInArray(user.providerData, firebase.auth.EmailAuthProvider.PROVIDER_ID))
          if(!providerInArray(user.providerData, firebase.auth.EmailAuthProvider.PROVIDER_ID)) {
            if(!window.thisEmail && window.withSameEmail) {
              window.thisEmail = user.isEmail;
            }
            if(!window.thisEmail && !window.withSameEmail && user.providerData.length == 1 && user.isEmail) window.thisEmail = user.isEmail; // for add email to not same email
            if(window.thisEmail) {
              console.log("emmmmmmmmail");
              const emailCredential = await firebase.auth.EmailAuthProvider.credential(window.thisEmail, "12345678");
              await firebase.auth().currentUser.linkWithCredential(emailCredential).then((usercred) => {
                //  user.isEmailLinked=true;
                console.log("the account successfully linked with email", usercred);
              }).catch((error) => {
                console.log("Error linking account with email", error);
                
              });
            }
          }
          console.log('fin');
          return;
          
        };
        var user;
        if(firebase.auth().currentUser) {
          // user = firebase.auth().currentUser;
          user = a.user;
          user.isEmail = user.email ? user.email : user.providerData[0].email;
          user.isProviderId = a.additionalUserInfo.providerId;
          user.isCredentiel = a.credential;
          user.isNewUser = a.additionalUserInfo.isNewUser;
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
          //this.userInfo.providerData=user.providerData;
          /*var userInfoData;
          if ((userInfoData=document.querySelector("#userInfoData"))) 
            userInfoData.innerHTML=JSON.stringify(this.userInfo);
           
           */
          try {
            await this.Register(this.userInfo);
            this.$router.go("/user/"+this.uid);
            this.showError = false
          } catch(error) {
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


