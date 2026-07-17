import { getApiEndpoint } from './api'

// Runtime configuration for Studentlytics.
export const awsConfig = {
  region: 'us-east-1',
  s3: {
    bucket: 'studentlytics-classroom-videos',
    region: 'us-east-1'
  },
  rekognition: {
    region: 'us-east-1'
  },
  lambda: {
    videoProcessingFunction: 'studentlytics-video-processor',
    apiEndpoint: getApiEndpoint()
  }
}

// Student face collection for Rekognition
export const FACE_COLLECTION_ID = 'studentlytics-students'
