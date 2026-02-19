import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButtons,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonSpinner,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { getEmailError, getPhoneError } from "../utils/validation";

const LeadForm: React.FC<any> = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    college: "",
    year: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
    if (key === "email" || key === "phone") {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const emailError = getEmailError(formData.email);
    const phoneError = getPhoneError(formData.phone);
    const nameMissing = !formData.name?.trim();

    if (nameMissing || emailError || phoneError) {
      setFieldErrors({
        email: emailError || undefined,
        phone: phoneError || undefined,
      });
      setToastMessage(
        nameMissing
          ? "Please fill in all required fields."
          : emailError || phoneError
      );
      setIsError(true);
      setShowToast(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        "https://launched-backend.onrender.com/api/leads",
        formData,
        { timeout: 25000 }
      );
      setToastMessage("Enrollment successful! We will contact you soon.");
      setIsError(false);
      setShowToast(true);
      setFieldErrors({});
      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
        college: "",
        year: "",
      });
    } catch (error: any) {
      const msg =
        error.code === "ECONNABORTED"
          ? "Request timed out. Please check your connection and try again."
          : error.response?.status === 500
            ? "Something went wrong on our end. Please try again later."
            : error.response?.data?.message || "Submission failed. Please try again.";
      setToastMessage(msg);
      setIsError(true);
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>LaunchED - Enroll Now</IonTitle>
          <IonButtons slot="end">
            <IonButton 
              fill="clear" 
              onClick={() => history.push("/admin/login")}
              style={{ fontWeight: 500 }}
            >
              Admin Login
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100%'
      }}>
        <div style={{ 
          maxWidth: '600px', 
          margin: '20px auto',
          padding: '20px 0'
        }}>
          <IonCard style={{ borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <IonCardHeader style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px 16px 0 0'
            }}>
              <IonCardTitle style={{ 
                fontSize: '28px', 
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'white'
              }}>
                Join LaunchED
              </IonCardTitle>
              <p style={{ 
                textAlign: 'center', 
                marginTop: '8px',
                opacity: 0.9,
                fontSize: '16px'
              }}>
                Start your journey with us today!
              </p>
            </IonCardHeader>
            <IonCardContent style={{ padding: '24px' }}>
              <IonItem lines="full" style={{ marginBottom: '16px', borderRadius: '8px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 600, marginBottom: '8px' }}>
                  Full Name *
                </IonLabel>
                <IonInput
                  value={formData.name}
                  onIonChange={(e) => handleChange("name", e.detail.value!)}
                  placeholder="Enter your full name"
                  required
                ></IonInput>
              </IonItem>

              <IonItem
                lines="full"
                style={{
                  marginBottom: "16px",
                  borderRadius: "8px",
                  border: fieldErrors.email ? "1px solid var(--ion-color-danger)" : undefined,
                }}
              >
                <IonLabel position="stacked" style={{ fontWeight: 600, marginBottom: "8px" }}>
                  Email Address *
                </IonLabel>
                <IonInput
                  type="email"
                  value={formData.email}
                  onIonChange={(e) => handleChange("email", e.detail.value!)}
                  placeholder="your.email@example.com"
                  required
                ></IonInput>
                {fieldErrors.email && (
                  <p style={{ color: "var(--ion-color-danger)", fontSize: "12px", marginTop: "4px" }}>
                    {fieldErrors.email}
                  </p>
                )}
              </IonItem>

              <IonItem
                lines="full"
                style={{
                  marginBottom: "16px",
                  borderRadius: "8px",
                  border: fieldErrors.phone ? "1px solid var(--ion-color-danger)" : undefined,
                }}
              >
                <IonLabel position="stacked" style={{ fontWeight: 600, marginBottom: "8px" }}>
                  Phone Number *
                </IonLabel>
                <IonInput
                  type="tel"
                  value={formData.phone}
                  onIonChange={(e) => handleChange("phone", e.detail.value!)}
                  placeholder="+1 (555) 123-4567"
                  required
                ></IonInput>
                {fieldErrors.phone && (
                  <p style={{ color: "var(--ion-color-danger)", fontSize: "12px", marginTop: "4px" }}>
                    {fieldErrors.phone}
                  </p>
                )}
              </IonItem>

              <IonItem lines="full" style={{ marginBottom: '16px', borderRadius: '8px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 600, marginBottom: '8px' }}>
                  Course Interest
                </IonLabel>
                <IonInput
                  value={formData.course}
                  onIonChange={(e) => handleChange("course", e.detail.value!)}
                  placeholder="e.g., React, Node.js, Python"
                ></IonInput>
              </IonItem>

              <IonItem lines="full" style={{ marginBottom: '16px', borderRadius: '8px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 600, marginBottom: '8px' }}>
                  College/University
                </IonLabel>
                <IonInput
                  value={formData.college}
                  onIonChange={(e) => handleChange("college", e.detail.value!)}
                  placeholder="Enter your college name"
                ></IonInput>
              </IonItem>

              <IonListHeader style={{ paddingLeft: 0, marginBottom: '8px' }}>
                <IonLabel style={{ fontWeight: 600 }}>Academic Year</IonLabel>
              </IonListHeader>
              <IonRadioGroup
                value={formData.year}
                onIonChange={(e) => handleChange("year", e.detail.value)}
                className="academic-year-radio-group"
                style={{ marginBottom: '24px' }}
              >
                <IonItem lines="none" style={{ marginBottom: '4px' }}>
                  <IonRadio value="1" labelPlacement="end" justify="start" />
                  <IonLabel>1st Year</IonLabel>
                </IonItem>
                <IonItem lines="none" style={{ marginBottom: '4px' }}>
                  <IonRadio value="2" labelPlacement="end" justify="start" />
                  <IonLabel>2nd Year</IonLabel>
                </IonItem>
                <IonItem lines="none" style={{ marginBottom: '4px' }}>
                  <IonRadio value="3" labelPlacement="end" justify="start" />
                  <IonLabel>3rd Year</IonLabel>
                </IonItem>
                <IonItem lines="none" style={{ marginBottom: '4px' }}>
                  <IonRadio value="4" labelPlacement="end" justify="start" />
                  <IonLabel>4th Year</IonLabel>
                </IonItem>
              </IonRadioGroup>

              <IonButton 
                expand="block" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  marginTop: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <IonSpinner name="crescent" style={{ marginRight: '8px' }} />
                    Submitting...
                  </>
                ) : (
                  'Submit Enrollment'
                )}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={isError ? "danger" : "success"}
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default LeadForm;
