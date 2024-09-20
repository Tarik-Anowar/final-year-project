'use client';
import { useSession } from 'next-auth/react';
import MyAppBar from './components/Appbar';
import './page.css'; 
const Home: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <div className="homePage">
      <MyAppBar />
      <div>
        {
          status === 'authenticated'? (
            <div>
              <p><strong>ID:</strong> {session?.user?.id}</p>
              <p><strong>Name:</strong> {session?.user?.name}</p>
            </div>
          ) : (
            <div>
              <p>Signup/Signin</p>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Home;
