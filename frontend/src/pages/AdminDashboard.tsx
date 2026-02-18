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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonIcon,
} from "@ionic/react";
import {
  logOutOutline,
  personOutline,
  statsChartOutline,
} from "ionicons/icons";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

const AdminDashboard: React.FC<any> = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(true);
    try {
      const res = await axios.get(
        "https://launched-backend.onrender.com/api/leads",
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
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.put(
        `https://launched-backend.onrender.com/api/leads/${id}`,
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

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Admin Dashboard</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                logout();
                history.push("/admin/login");
              }}
              style={{ marginRight: "8px" }}
            >
              <IonIcon icon={logOutOutline} slot="start" />
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="ion-padding"
        style={{
          background: "#f5f5f5",
        }}
      >
        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <IonCard style={{ borderRadius: "12px", margin: 0 }}>
            <IonCardContent style={{ padding: "20px", textAlign: "center" }}>
              <IonIcon
                icon={statsChartOutline}
                style={{
                  fontSize: "32px",
                  color: "#667eea",
                  marginBottom: "8px",
                }}
              />
              <div
                style={{ fontSize: "32px", fontWeight: "bold", color: "#333" }}
              >
                {stats.total}
              </div>
              <div
                style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}
              >
                Total Leads
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard style={{ borderRadius: "12px", margin: 0 }}>
            <IonCardContent style={{ padding: "20px", textAlign: "center" }}>
              <IonIcon
                icon={personOutline}
                style={{
                  fontSize: "32px",
                  color: "#667eea",
                  marginBottom: "8px",
                }}
              />
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#667eea",
                }}
              >
                {stats.new}
              </div>
              <div
                style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}
              >
                New Leads
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard style={{ borderRadius: "12px", margin: 0 }}>
            <IonCardContent style={{ padding: "20px", textAlign: "center" }}>
              <IonIcon
                icon={personOutline}
                style={{
                  fontSize: "32px",
                  color: "#10b981",
                  marginBottom: "8px",
                }}
              />
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#10b981",
                }}
              >
                {stats.contacted}
              </div>
              <div
                style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}
              >
                Contacted
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Filters */}
        <IonCard style={{ borderRadius: "12px", marginBottom: "20px" }}>
          <IonCardContent style={{ padding: "16px" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <IonSearchbar
                value={searchText}
                onIonInput={(e) => setSearchText(e.detail.value!)}
                placeholder="Search by name or email"
                style={{ padding: 0 }}
              ></IonSearchbar>
              <IonSelect
                placeholder="Filter by Course"
                value={filterCourse}
                onIonChange={(e) => setFilterCourse(e.detail.value)}
                style={{ borderRadius: "8px" }}
              >
                <IonSelectOption value="">All Courses</IonSelectOption>
                <IonSelectOption value="React">React</IonSelectOption>
                <IonSelectOption value="Node">Node</IonSelectOption>
                <IonSelectOption value="Python">Python</IonSelectOption>
                <IonSelectOption value="JavaScript">JavaScript</IonSelectOption>
              </IonSelect>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Leads List */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <IonCard style={{ borderRadius: "12px" }}>
            <IonCardContent style={{ padding: "40px", textAlign: "center" }}>
              <p style={{ color: "#666", fontSize: "16px" }}>No leads found</p>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonList style={{ background: "transparent" }}>
            {leads.map((lead) => (
              <IonCard
                key={lead.id}
                style={{ borderRadius: "12px", marginBottom: "12px" }}
              >
                <IonCardContent style={{ padding: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          margin: "0 0 8px 0",
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#333",
                        }}
                      >
                        {lead.name}
                      </h2>
                      <p
                        style={{
                          margin: "4px 0",
                          color: "#666",
                          fontSize: "14px",
                        }}
                      >
                        📧 {lead.email}
                      </p>
                      <p
                        style={{
                          margin: "4px 0",
                          color: "#666",
                          fontSize: "14px",
                        }}
                      >
                        📞 {lead.phone || "N/A"}
                      </p>
                      {lead.college && (
                        <p
                          style={{
                            margin: "4px 0",
                            color: "#666",
                            fontSize: "14px",
                          }}
                        >
                          🎓 {lead.college}
                        </p>
                      )}
                      {lead.course && (
                        <IonChip style={{ marginTop: "8px" }} color="primary">
                          {lead.course}
                        </IonChip>
                      )}
                      {lead.year && (
                        <IonChip
                          style={{ marginTop: "8px", marginLeft: "8px" }}
                        >
                          Year {lead.year}
                        </IonChip>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "8px",
                      }}
                    >
                      <IonBadge
                        color={lead.status === "new" ? "primary" : "success"}
                        style={{ fontSize: "12px", padding: "6px 12px" }}
                      >
                        {lead.status}
                      </IonBadge>
                      {lead.status === "new" && (
                        <IonButton
                          size="small"
                          onClick={() => updateStatus(lead.id, "contacted")}
                          style={{ fontSize: "12px", height: "32px" }}
                        >
                          Mark Contacted
                        </IonButton>
                      )}
                    </div>
                  </div>
                  {lead.created_at && (
                    <p
                      style={{
                        margin: "8px 0 0 0",
                        fontSize: "12px",
                        color: "#999",
                      }}
                    >
                      Added: {new Date(lead.created_at).toLocaleDateString()}
                    </p>
                  )}
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AdminDashboard;
