import "./App.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase/firebase";

function App() {
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, "test@example.com", "password123");
      alert("Logged in!");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="bg-green-500 w-[200px] h-[200px]">hello</div>
      <div className="">add any thing</div>
      <button onClick={handleLogin}>Login</button>
    </>
  );
}

export default App;
