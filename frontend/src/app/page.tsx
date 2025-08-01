import Image from "next/image";
import LoginForm from '../components/auth/loginForm';

export default function Home() {
  return (
    <div className="App" >
      <div>
        <LoginForm/>
      </div>
    </div>
  );
}
