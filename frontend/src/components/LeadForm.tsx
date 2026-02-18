import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonToast, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import axios from 'axios';

const LeadForm: React.FC<any> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    college: '',
    year: ''
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setToastMessage('Please fill in all required fields.');
      setIsError(true);
      setShowToast(true);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/leads', formData);
      setToastMessage('Enrollment successful! We will contact you soon.');
      setIsError(false);
      setShowToast(true);
      setFormData({ name: '', email: '', phone: '', course: '', college: '', year: '' });
    } catch (error: any) {
      setToastMessage(error.response?.data?.message || 'Submission failed. Please try again.');
      setIsError(true);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Enroll Now</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>Join LaunchED</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonItem>
                <IonLabel position="floating">Name *</IonLabel>
                <IonInput value={formData.name} onIonChange={e => handleChange('name', e.detail.value!)} required></IonInput>
                </IonItem>

                <IonItem>
                <IonLabel position="floating">Email *</IonLabel>
                <IonInput type="email" value={formData.email} onIonChange={e => handleChange('email', e.detail.value!)} required></IonInput>
                </IonItem>

                <IonItem>
                <IonLabel position="floating">Phone *</IonLabel>
                <IonInput type="tel" value={formData.phone} onIonChange={e => handleChange('phone', e.detail.value!)} required></IonInput>
                </IonItem>

                <IonItem>
                <IonLabel position="floating">Course</IonLabel>
                <IonInput value={formData.course} onIonChange={e => handleChange('course', e.detail.value!)}></IonInput>
                </IonItem>

                <IonItem>
                <IonLabel position="floating">College</IonLabel>
                <IonInput value={formData.college} onIonChange={e => handleChange('college', e.detail.value!)}></IonInput>
                </IonItem>

                <IonItem>
                <IonLabel position="floating">Year</IonLabel>
                <IonSelect value={formData.year} onIonChange={e => handleChange('year', e.detail.value)}>
                    <IonSelectOption value="1">1st Year</IonSelectOption>
                    <IonSelectOption value="2">2nd Year</IonSelectOption>
                    <IonSelectOption value="3">3rd Year</IonSelectOption>
                    <IonSelectOption value="4">4th Year</IonSelectOption>
                </IonSelect>
                </IonItem>

                <div className="ion-padding-top">
                    <IonButton expand="block" onClick={handleSubmit}>Submit</IonButton>
                </div>
            </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={isError ? 'danger' : 'success'}
        />
      </IonContent>
    </IonPage>
  );
};

export default LeadForm;
