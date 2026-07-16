import { awsConfig } from '../config/aws-config'

const API_URL = awsConfig.lambda.apiEndpoint

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }))
    throw new Error(error.detail ?? `Request failed with status ${response.status}`)
  }

  return response.json()
}

export async function getStudent(recordId: string): Promise<any> {
  return request(`/students/records/${encodeURIComponent(recordId)}`)
}

export async function getAllStudents(): Promise<any[]> {
  return request('/students')
}

export async function addStudent(student: any): Promise<any> {
  return request('/students', {
    method: 'POST',
    body: JSON.stringify(student),
  })
}

export async function updateStudent(recordId: string, student: any): Promise<any> {
  return request(`/students/records/${encodeURIComponent(recordId)}`, {
    method: 'PUT',
    body: JSON.stringify(student),
  })
}

export async function deleteStudent(recordId: string): Promise<{ deleted: string }> {
  return request(`/students/records/${encodeURIComponent(recordId)}`, {
    method: 'DELETE',
  })
}
