import React, { useEffect,useState } from 'react';

import Home from './Pages/Home'
import Login from './Pages/Login'
import logo from './logo.svg';
import './App.css';
import {auth} from './Pages/Firebase'

function App() {

    const [isLogin,setIsLogin] = useState(undefined)

    useEffect(() => {
        // Firebaseの認証状態の変更を監視する
        const unsubscribe = auth.onAuthStateChanged(user => {
            setIsLogin(!!user); // userオブジェクトが存在するかどうかで認証状態を判別
        });

        // コンポーネントがアンマウントされたら監視を解除する
        return () => unsubscribe();
    }, []);

  return (
    <div>
          {isLogin === true && (
              <div style={{ backgroundColor: '#eef2f6' }} >
                  <Home />
              </div >
          )}
          {isLogin === false && (
              <div style={{ backgroundColor: '#eef2f6' }} >
                  <Login />
              </div >
          )}
    </div>
    )
  
}

export default App;
