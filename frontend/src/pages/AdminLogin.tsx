import React, { useState, useContext } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonToast,
} from "@ionic/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminLogin: React.FC<any> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const history = useHistory();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://launched-backend.onrender.com/api/auth/login",
        { email, password }
      );
      login(res.data.token, res.data); // Save token and user
      history.push("/admin/dashboard");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Login failed");
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Admin Portal</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="ion-padding"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div style={{ 
          maxWidth: "450px", 
          width: "100%",
          margin: "20px auto",
          padding: "20px"
        }}>
          <IonCard style={{ 
            borderRadius: '16px', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
            <IonCardHeader style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '32px 24px',
              textAlign: 'center'
            }}>
              <IonCardTitle style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '8px'
              }}>
                Admin Login
              </IonCardTitle>
              <p style={{ 
                margin: 0,
                opacity: 0.9,
                fontSize: '14px'
              }}>
                Access the admin dashboard
              </p>
            </IonCardHeader>
            <IonCardContent style={{ padding: '24px' }}>
              <IonItem lines="full" style={{ marginBottom: '20px', borderRadius: '8px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 600, marginBottom: '8px' }}>
                  Email Address
                </IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                  placeholder="admin@example.com"
                  autocomplete="email"
                ></IonInput>
              </IonItem>
              <IonItem lines="full" style={{ marginBottom: '24px', borderRadius: '8px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 600, marginBottom: '8px' }}>
                  Password
                </IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                  placeholder="Enter your password"
                  autocomplete="current-password"
                ></IonInput>
              </IonItem>
              <IonButton 
                expand="block" 
                onClick={handleLogin}
                style={{
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Sign In
              </IonButton>
              <div style={{ 
                marginTop: '20px', 
                textAlign: 'center' 
              }}>
                <IonButton 
                  fill="clear" 
                  size="small"
                  onClick={() => history.push("/")}
                  style={{ fontSize: '14px' }}
                >
                  ← Back to Home
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={message}
          duration={3000}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminLogin;
