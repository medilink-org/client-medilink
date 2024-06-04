import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, Row, Col, List, Divider, Spin, message } from 'antd';
import axiosInstance from '../../axiosInstance';

const { Title } = Typography;

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/patient/id/${id}`)
      .then((response) => {
        setPatient(response.data);
        setLoading(false);
      })
      .catch((error) => {
        message.error('Error fetching patient details');
        console.error('Error fetching patient details:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Typography.Title level={3}>Patient not found</Typography.Title>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '24px',
        minHeight: '100vh'
      }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        Patient Details
      </Title>
      <Card style={{ borderRadius: '8px' }}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Title level={4}>Personal Information</Title>
            <List
              bordered
              dataSource={[
                { title: 'Name', description: patient.name },
                { title: 'Initials', description: patient.initials },
                { title: 'Age', description: patient.age },
                {
                  title: 'Birth Date',
                  description: new Date(patient.birthDate).toLocaleDateString()
                },
                { title: 'Gender', description: patient.gender }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>Medical Information</Title>
            <List
              bordered
              dataSource={[
                {
                  title: 'Allergies',
                  description:
                    patient.allergies
                      .map((allergy) => allergy.allergen)
                      .join(', ') || 'None'
                },
                {
                  title: 'Prescriptions',
                  description:
                    patient.prescriptions
                      .map(
                        (prescription) =>
                          `${prescription.medication} (${prescription.dosage})`
                      )
                      .join(', ') || 'None'
                },
                {
                  title: 'Active Treatments',
                  description:
                    patient.activeTreatments
                      .map((treatment) => treatment.treatment)
                      .join(', ') || 'None'
                },
                {
                  title: 'Medical History',
                  description:
                    patient.medicalHistory
                      .map(
                        (operation) =>
                          `${operation.operation} (${operation.date})`
                      )
                      .join(', ') || 'None'
                },
                {
                  title: 'Family History',
                  description:
                    patient.familyHistory
                      .map(
                        (condition) =>
                          `${condition.condition} (${condition.relative})`
                      )
                      .join(', ') || 'None'
                }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
        <Divider />
        <Title level={4}>Notes</Title>
        <List
          bordered
          dataSource={patient.notes}
          renderItem={(note) => (
            <List.Item>
              <List.Item.Meta
                title={`${note.author} - ${new Date(note.date).toLocaleDateString()}`}
                description={note.content}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default PatientDetails;
