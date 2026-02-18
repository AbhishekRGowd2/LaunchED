import React, { useState, useContext } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonItem, IonLabel, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonToast } from '@ionic/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLogin: React.FC<any> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const history = useHistory();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(res.data.token, res.data); // Save token and user
      history.push('/admin/dashboard');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Login failed');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
        <IonContent className="ion-padding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div style={{ maxWidth: '400px', margin: '50px auto' }}>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle className="ion-text-center">Admin Login</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel position="floating">Email</IonLabel>
                            <IonInput value={email} onIonChange={e => setEmail(e.detail.value!)}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Password</IonLabel>
                            <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)}></IonInput>
                        </IonItem>
                        <div className="ion-padding-top">
                            <IonButton expand="block" onClick={handleLogin}>Login</IonButton>
                        </div>
                    </IonCardContent>
                </IonCard>
            </div>
            <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message={message} duration={3000} color="danger" />
        </IonContent>
    </IonPage>
  );
};

export default AdminLogin;
