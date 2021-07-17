import { Router } from 'express'
import { LOCATION_ENDPOINT } from '../../constants/endpoint'
import { getLocation } from './location.service';

// Export module for registering router in express app
export const router: Router = Router()

// Define your routes here
router.get(LOCATION_ENDPOINT + "/", (req, res) => {
  
  res.status(200).send({
    message: getLocation(req)
  })
})

router.post(LOCATION_ENDPOINT + "/", (req, res) => {
  res.status(200).send({
    message: "POST request from sample router"
  })
})

router.put(LOCATION_ENDPOINT + "/", (req, res) => {
  res.status(200).send({
    message: "PUT request from sample router"
  })
})

router.delete(LOCATION_ENDPOINT + "/", (req, res) => {
  res.status(200).send({
    message: "DELETE request from sample router"
  })
})


