import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';
import { useState } from 'react';
import './ChartContent.css';
import { styled } from 'styled-components';

declare interface Props {
  patient: Patient;
}

interface MeasurementsByType {
  [type: string]: (string | number)[];
}

export default function ChartContent({ patient }: Props) {
  const { width, height, ref } = useResizeDetector({});
  const [selectedPlots, setSelectedPlots] = useState<string[]>([]);

  const handlePlotSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedPlots((prevSelectedPlots) =>
      prevSelectedPlots.includes(value)
        ? prevSelectedPlots.filter((plot) => plot !== value)
        : [...prevSelectedPlots, value]
    );
  };

  const sortedAppointments = patient.appointments.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const appointmentsWithMeasurements = sortedAppointments.filter(
    (appointment) => {
      return appointment.measurements.length > 0;
    }
  );

  const last10WithMeasurements = appointmentsWithMeasurements
    .slice(-10)
    .reverse();

  const measurementsByType: MeasurementsByType = {};

  last10WithMeasurements.forEach((appointment) => {
    appointment.measurements.forEach((measurement) => {
      const { type, value } = measurement;
      if (!measurementsByType[type]) {
        measurementsByType[type] = new Array(
          last10WithMeasurements.length
        ).fill('-');
      }
      const index = last10WithMeasurements.indexOf(appointment);
      measurementsByType[type][index] = value; // Replace placeholder with actual value
    });
  });

  const last10Dates = last10WithMeasurements.map(
    (appointment) => new Date(appointment.date)
  );

  function extractMeasurementData(appointments, measurementType) {
    return appointments.reduce(
      (acc, appointment) => {
        const measurement = appointment.measurements.find(
          (m) => m.type === measurementType
        );
        if (measurement) {
          acc.dates.push(new Date(appointment.date));
          acc.values.push(measurement.value);
        }
        return acc;
      },
      { dates: [], values: [] }
    );
  }

  const plotsData = {
    Weight: extractMeasurementData(last10WithMeasurements, 'Weight'),
    'Blood Pressure (systolic)': extractMeasurementData(
      last10WithMeasurements,
      'Blood Pressure (systolic)'
    ),
    'Heart Rate': extractMeasurementData(last10WithMeasurements, 'Heart Rate'),
    Temperature: extractMeasurementData(last10WithMeasurements, 'Temperature'),
    'Blood O2': extractMeasurementData(last10WithMeasurements, 'Blood O2')
  };

  const plotTitles = {
    Weight: 'Weight Over Time',
    'Blood Pressure (systolic)': 'Blood Pressure Over Time',
    'Heart Rate': 'Heart Rate Over Time',
    Temperature: 'Temperature Over Time',
    'Blood O2': 'Blood O2 Over Time'
  };

  const yAxisTitles = {
    Weight: 'Weight (kg)',
    'Blood Pressure (systolic)': 'Blood Pressure (mmHg)',
    'Heart Rate': 'Heart Rate (bpm)',
    Temperature: 'Temperature (°F)',
    'Blood O2': 'Blood O2 Saturation (%)'
  };

  const plotColors = {
    Weight: 'blue',
    'Blood Pressure (systolic)': 'red',
    'Heart Rate': 'green',
    Temperature: 'orange',
    'Blood O2': 'purple'
  };

  const renderPlot = (data, title, yAxisTitle, color) => (
    <div
      style={{
        width: '48%',
        padding: '10px'
      }}>
      {' '}
      <Plot
        data={[
          {
            x: data.dates,
            y: data.values,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color },
            name: title
          }
        ]}
        layout={{
          title,
          xaxis: { title: 'Date', type: 'date' },
          yaxis: { title: yAxisTitle },
          autosize: true,
          height: 300
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <SelectionContainer>
          <Title style={{ fontSize: '20px' }}>Select Plots</Title>
          <select
            value={selectedPlots}
            onChange={handlePlotSelection}
            multiple={true}
            style={{ height: '113px' }}>
            {Object.keys(plotsData).map((key) => (
              <StyledSelectionItem key={key} value={key}>
                {key}
              </StyledSelectionItem>
            ))}
          </select>
        </SelectionContainer>
        <table>
          <thead>
            <tr>
              <th>Measurement Type</th>
              {last10Dates.map((date, index) => (
                <th key={index}>{date.toLocaleDateString('en-US')}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(measurementsByType).map(([type, values]) => (
              <tr key={type}>
                <td>{type}</td>
                {values.map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ maxHeight: '60%' }}>
        <div
          ref={ref}
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
          {selectedPlots.map((plotKey) =>
            renderPlot(
              plotsData[plotKey],
              plotTitles[plotKey],
              yAxisTitles[plotKey],
              plotColors[plotKey]
            )
          )}
        </div>
      </div>
    </>
  );
}

const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
  margin-left: 20px;
  height: fit-content;
  margin-top: -15px;
`;

const Title = styled.h2`
  font-size: 1.5em;
  color: #000000;
  margin-bottom: 10px;
`;

const StyledSelectionItem = styled.option`
  border: 1px gray solid;
  font-size: 16px;
  &:hover {
    background-color: #f5f5f5;
  }
`;
