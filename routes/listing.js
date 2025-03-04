const express = require('express')
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')
const multer = require('multer')
const { storage } = require('../cloudconfig.js')
const upload = multer({ storage })

const listingController = require('../controllers/listings.js')

router
  .route('/')
  //index route
  .get(wrapAsync(listingController.index))
  //create route
  .post(
    isLoggedIn,
    validateListing,
    upload.single('listing[image][url]'),
    wrapAsync(listingController.createListing)
  )
//new route
router.get('/new', isLoggedIn, listingController.renderNewForm)

router
  .route('/:id')
  //show route
  .get(wrapAsync(listingController.showListing))
  //update route
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image][url]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  //delete route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

//edit route
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
)

module.exports = router
