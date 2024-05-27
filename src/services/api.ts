import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tags = [
  'patient',
  'practitioner',
  'appointment',
  'receptionist',
  'admin'
];

const devUrl = import.meta.env.VITE_API_DEV_URL;
const prodUrl = import.meta.env.VITE_API_PROD_URL;
const buildEnv = import.meta.env.VITE_BUILD_ENV;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: buildEnv === 'prod' ? prodUrl : devUrl,
    prepareHeaders: (headers) => {
      headers.set('content-type', 'application/json');
      return headers;
    }
  }),
  tagTypes: tags,
  endpoints: (build) => ({
    // Authentication endpoint
    login: build.mutation({
      query: ({ username, password }) => ({
        url: 'account/login',
        method: 'POST',
        body: { username, password }
      })
    }),

    getAllPatients: build.query<Patient[], void>({
      query: () => ({
        url: 'patient/all',
        method: 'GET'
      }),
      providesTags: ['patient']
    }),

    getPatient: build.query<Patient, string>({
      query: (_id) => ({
        url: `patient/id/${_id}`,
        method: 'GET'
      }),
      providesTags: ['patient']
    }),

    getPatientByName: build.query<Patient, string>({
      query: (name) => ({
        url: `patient/name/${name}`,
        method: 'GET'
      }),
      providesTags: ['patient']
    }),

    putPatient: build.mutation({
      query: ({ _id, delta }) => ({
        url: `patient/${_id}`,
        method: 'PUT',
        body: delta
      }),
      invalidatesTags: ['patient']
    }),

    postPatient: build.mutation<Patient, Patient>({
      query: (patient) => ({
        url: 'patient/',
        method: 'POST',
        body: patient
      }),
      invalidatesTags: ['patient']
    }),

    deletePatient: build.mutation<void, { _id: string }>({
      query: ({ _id }) => ({
        url: `patient/${_id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['patient']
    }),

    // practitioners
    getPractitioner: build.query<Practitioner, string>({
      query: (_id) => ({
        url: `practitioner/id/${_id}`,
        method: 'GET'
      }),
      providesTags: ['practitioner']
    }),

    getPractitionerByUsername: build.query<Practitioner, string>({
      query: (username) => ({
        url: `practitioner/user/${username}`,
        method: 'GET'
      }),
      providesTags: ['practitioner', 'patient', 'appointment'] // in an ideal world just one, but this is a quick fix
    }),

    // appointments
    getAppointment: build.query<Appointment, string>({
      query: (_id) => ({
        url: `appointment/id/${_id}`,
        method: 'GET'
      }),
      providesTags: ['appointment']
    }),

    putAppointment: build.mutation({
      query: ({ _id, delta }) => ({
        url: `appointment/${_id}`,
        method: 'PUT',
        body: delta
      }),
      invalidatesTags: ['appointment', 'patient', 'practitioner']
    })

    // add more endpoints as needed
  })
});

// hooks for use in components, call the endpoints above. See RTK Query docs for more info
export const {
  useLoginMutation,
  useGetAllPatientsQuery,
  useGetPatientQuery,
  useGetPatientByNameQuery,
  usePutPatientMutation,
  usePostPatientMutation,
  useDeletePatientMutation,
  useGetPractitionerByUsernameQuery,
  useGetPractitionerQuery,
  useGetAppointmentQuery,
  usePutAppointmentMutation
} = api;
