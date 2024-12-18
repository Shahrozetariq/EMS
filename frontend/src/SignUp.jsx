import { createUserWithEmailAndPassword} from "firebase/auth";
import { auth } from "./firebase-config";

const SignupWithEmail = async (e:React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      console.error("Provide Email and Password");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log(user);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log("errorCode:", errorCode, "errorMessage:", errorMessage);
    }
  };