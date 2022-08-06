// import React from "react";
// import CustomButton from "./CustomButton";
// import {
//   GoogleAuthProvider,
//   FacebookAuthProvider,
//   OAuthProvider,
//   signInWithCredential,
//   getAuth,
// } from "firebase/auth";
// import * as Google from "expo-auth-session/providers/google";
// import * as Facebook from "expo-auth-session/providers/facebook";
// import * as Apple from "expo-apple-authentication";
// import * as WebBrowser from "expo-web-browser";
// WebBrowser.maybeCompleteAuthSession();

// const SocialSigninButtons = (props) => {
//   const [requestFacebook, responseFacebook, promptAsyncFacebook] =
//     Facebook.useAuthRequest({
//       expoClientId: "1203243913796973",
//     });

//   const [requestGoogle, responseGoogle, promptAsyncGoogle] =
//     Google.useAuthRequest({
//       expoClientId:
//         "1007508514463-pafao0r0g1qrlq30u8dtj07qcderqd98.apps.googleusercontent.com",
//     });

//   const signInApple = async () => {
//     const appleCredential = await Apple.signInAsync({
//       requestedScopes: [
//         Apple.AppleAuthenticationScope.FULL_NAME,
//         Apple.AppleAuthenticationScope.EMAIL,
//       ],
//     });

//     //NEED TO PAY $99 annual fee to register/enroll for an app: https://developer.apple.com/programs/enroll/

//     // const identityToken = appleCredential.identityToken;
//     // const auth = getAuth();
//     // const provider = new OAuthProvider("apple.com");
//     // const credential = provider.credential({
//     //   idToken: identityToken,
//     // });
//     // signInWithCredential(auth, credential)
//     //   .then((res) => {
//     //     console.log(res);
//     //     //can parse name and email from user here and
//     //   })
//     //   .catch((error) => {
//     //     console.log(error);
//     //   });
//   };

//   const signInFacebook = async () => {
//     await promptAsyncFacebook();
//     if (responseFacebook?.type === "cancel") return;
//     if (responseFacebook?.type === "success") {
//       // const idToken = responseFacebook.authentication.idToken; // UNUSED
//       const accessToken = responseFacebook.authentication.accessToken;
//       const auth = getAuth();
//       const credential = FacebookAuthProvider.credential(accessToken);
//       signInWithCredential(auth, credential)
//         .then((res) => {
//           console.log(res);
//           //can parse name and email from user here and
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     } else {
//       console.log("error in signinfacebook");
//       // console.log(responseFacebook);
//       // console.log(requestFacebook);
//     }
//   };

//   const signInGoogle = async () => {
//     await promptAsyncGoogle();

//     if (responseGoogle?.type === "success") {
//       const idToken = responseGoogle.authentication.idToken;
//       const accessToken = responseGoogle.authentication.accessToken;
//       const auth = getAuth();
//       const credential = GoogleAuthProvider.credential(idToken, accessToken);
//       signInWithCredential(auth, credential)
//         .then((res) => {
//           //console.log(res);
//           //can parse name and email from user here and
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     } else {
//       console.log("error in signinGoogle");
//       // console.log(responseGoogle);
//       // console.log(requestGoogle);
//     }
//   };

//   return (
//     <>
//       <CustomButton
//         text="Sign In with Facebook"
//         onPress={signInFacebook}
//         type="primary"
//         backgroundColor="#e7eaf4"
//         color="#4765a9"
//       />
//       <CustomButton
//         text="Sign In with Google"
//         onPress={signInGoogle}
//         type="primary"
//         backgroundColor="#fae9ea"
//         color="#dd4d44"
//       />
//       <CustomButton
//         text="Sign In with Apple"
//         onPress={signInApple}
//         type="primary"
//         backgroundColor="#e3e3e3"
//         color="#363636"
//       />
//     </>
//   );
// };

// export default SocialSigninButtons;
