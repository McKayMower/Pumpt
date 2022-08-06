import { Alert } from "react-native";

export default function ReportError(error, email) {
  console.log("error: ", error);
  if (!error.code) return;
  switch (error.code) {
    case "auth/invalid-email":
      Alert.alert(`Email is not in a valid format: example@example.com`);
      break;
    case "auth/missing-email":
      Alert.alert("Please enter an email");
      break;
    case "auth/user-not-found":
      Alert.alert(`${email} has not been registered yet`);
      break;
    case "auth/wrong-password":
      Alert.alert("Password is incorrect.");
      break;
    case "auth/too-many-requests":
      Alert.alert(`Please wait to send another request`);
      break;
    case "auth/weak-password":
      Alert.alert(`Please enter a stronger password`);
      break;
    case "auth/email-already-in-use":
      Alert.alert(
        `The email ${email} is already in use. Please use a different email.`
      );
      break;
    default:
      console.log(error)
      break;
  }
}

ReportError.defaultProps = {
  error: null,
  email: null,
};
