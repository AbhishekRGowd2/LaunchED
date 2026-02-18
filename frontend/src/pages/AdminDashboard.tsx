import React, { useEffect, useState, useContext } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonButtons,
  IonButton,
} from "@ionic/react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

const AdminDashboard: React.FC<any> = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const { token, logout, isAuthenticated } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/admin/login");
      return;
    }
    fetchLeads();
  }, [searchText, filterCourse, isAuthenticated]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        "https://launched-backend.onrender.com/api/admin/leads",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { search: searchText, course: filterCourse },
        }
      );
      // Handle both array and object response structures
      if (Array.isArray(res.data)) {
        setLeads(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setLeads(res.data.data);
      } else {
        console.warn("Unexpected API response structure:", res.data);
        setLeads([]);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
        history.push("/admin/login");
      }
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.put(
        `https://launched-backend.onrender.com/api/admin/leads/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchLeads(); // Refresh list
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                logout();
                history.push("/admin/login");
              }}
            >
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search by name or email"
          ></IonSearchbar>
          <IonSelect
            placeholder="Filter Course"
            value={filterCourse}
            onIonChange={(e) => setFilterCourse(e.detail.value)}
          >
            <IonSelectOption value="">All Courses</IonSelectOption>
            <IonSelectOption value="React">React</IonSelectOption>
            <IonSelectOption value="Node">Node</IonSelectOption>
            {/* Add more options dynamically if needed */}
          </IonSelect>
        </div>

        <IonList>
          {leads.map((lead) => (
            <IonItem key={lead.id}>
              <IonLabel>
                <h2>{lead.name}</h2>
                <p>
                  {lead.email} | {lead.phone}
                </p>
                <p>{lead.course}</p>
              </IonLabel>
              <IonBadge
                color={lead.status === "new" ? "primary" : "success"}
                slot="end"
              >
                {lead.status}
              </IonBadge>
              {lead.status === "new" && (
                <IonButton
                  slot="end"
                  size="small"
                  onClick={() => updateStatus(lead.id, "contacted")}
                >
                  Mark Contacted
                </IonButton>
              )}
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
